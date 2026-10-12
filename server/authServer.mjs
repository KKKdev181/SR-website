import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { loadUsers, verifyPassword, tokenDigest } from "./userStore.mjs";
const port = Number(process.env.PORTAL_AUTH_PORT || 8787);
const sessions = new Map();
const attempts = new Map();
const ttl = 8 * 60 * 60 * 1000;
const cookieName = "sr_portal_session";
const secure = process.env.NODE_ENV === "production";
const cookieOpts = `HttpOnly; SameSite=Strict; Path=/api/auth; ${secure ? "Secure; " : ""}`;
function respond(res, status, json, headers={}) {
  res.writeHead(status, { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff", ...headers });
  res.end(JSON.stringify(json));
}
function sessionFrom(req) {
  const match = (req.headers.cookie || "").split(";").map(v=>v.trim()).find(v=>v.startsWith(cookieName+"="));
  if (!match) return null;
  const raw=match.slice(cookieName.length+1);
  const digest=tokenDigest(raw);
  const session=sessions.get(digest);
  if (!session) return null;
  if (session.expires<=Date.now()) { sessions.delete(digest);return null; }
  return { ...session, digest };
}
function checkOrigin(req) {
  const origin=req.headers.origin;
  if (!origin) return false;
  try {
    const url=new URL(origin);
    const forwardedHost=req.headers["x-forwarded-host"];
    const expected=forwardedHost || req.headers.host;
    const expectedOrigin=process.env.PORTAL_PUBLIC_ORIGIN;
    if(expectedOrigin) return origin===expectedOrigin;
    if(url.host===expected && (url.protocol==="https:" || (!secure && url.protocol==="http:"))) return true;
    // GitHub Codespaces terminates TLS before forwarding to Vite and the local API.
    // The backend sees an internal Host. Only accept that mismatch for verified
    // same-origin browser requests on the Codespaces dev domain, never in production.
    if(!secure && req.headers["sec-fetch-site"]==="same-origin" &&
       url.protocol==="https:" && /^[a-z0-9-]+-8080\\.app\\.github\\.dev$/.test(url.hostname)) return true;
    return false;
  } catch { return false; }
}
async function parseBody(req) {
  const parts=[];let size=0;
  for await (const chunk of req) { size+=chunk.length; if(size>8192) throw new Error("Body too large"); parts.push(chunk); }
  return JSON.parse(Buffer.concat(parts).toString("utf8"));
}
export const handler=async (req,res)=>{
  if (!req.url?.startsWith("/api/auth/")) return respond(res,404,{error:"Not found"});
  if (req.method==="GET" && req.url==="/api/auth/session") {
    const session=sessionFrom(req);
    if(!session)return respond(res,200,{user:null});
    const users=await loadUsers();
    const user=users.find(x=>x.username===session.username && x.enabled!==false);
    if(!user){sessions.delete(session.digest);return respond(res,200,{user:null});}
    return respond(res,200,{user:{name:user.name,username:user.username,role:user.role,isEditor:["admin","editor"].includes(user.role)}});
  }
  if (req.method!=="POST" || !checkOrigin(req)) return respond(res,403,{error:"Forbidden"});
  if (req.url==="/api/auth/login") {
    const ip=(req.socket.remoteAddress || "unknown");
    const recent=(attempts.get(ip)||[]).filter(ts=>Date.now()-ts<15*60*1000);
    if(recent.length>=8) return respond(res,429,{error:"Too many login attempts. Try again later."});
    attempts.set(ip,recent);
    let body;
    try {body=await parseBody(req);}catch{return respond(res,400,{error:"Invalid request"});}
    const username=typeof body?.username==="string" ? body.username.trim().toLowerCase() : "";
    const password=typeof body?.password==="string" ? body.password : "";
    const users=await loadUsers();
    const user=users.find(x=>x.username.toLowerCase()===username && x.enabled!==false);
    // Compute a comparable hash even for an unknown account to reduce username enumeration timing signals.
    const fallback="scrypt:16384:8:1:00000000000000000000000000000000:"+("00".repeat(64));
    const valid=await verifyPassword(password,user?.passwordHash || fallback);
    if(!user||!valid){recent.push(Date.now());attempts.set(ip,recent);return respond(res,401,{error:"Invalid username or password"});}
    attempts.delete(ip);
    const token=randomBytes(32).toString("hex");
    sessions.set(tokenDigest(token),{username:user.username,expires:Date.now()+ttl});
    return respond(res,200,{user:{name:user.name,username:user.username,role:user.role,isEditor:["admin","editor"].includes(user.role)}},{ "Set-Cookie":`${cookieName}=${token}; Max-Age=${ttl/1000}; ${cookieOpts}` });
  }
  if(req.url==="/api/auth/logout"){
    const session=sessionFrom(req);
    if(session)sessions.delete(session.digest);
    return respond(res,200,{user:null},{ "Set-Cookie":`${cookieName}=; Max-Age=0; ${cookieOpts}` });
  }
  return respond(res,404,{error:"Not found"});
};
if (process.argv[1] && import.meta.url===new URL("file://"+process.argv[1]).href) {
  createServer((req,res)=>{handler(req,res).catch(error=>{console.error("Auth API error",error);respond(res,500,{error:"Server error"});});}).listen(port,"127.0.0.1",()=>console.log(`Portal auth API listening on 127.0.0.1:${port}`));
}
