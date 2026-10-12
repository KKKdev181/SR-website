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
  const origin = req.headers.origin;
  const expectedOrigin = process.env.PORTAL_PUBLIC_ORIGIN;
  const forwardedHost = req.headers["x-forwarded-host"];
  const expectedHost = forwardedHost || req.headers.host;
  try {
    if (!origin) return false;
    const originUrl = new URL(origin);
    if (expectedOrigin) return origin === expectedOrigin;
    if (originUrl.host === expectedHost &&
        (originUrl.protocol === "https:" || (!secure && originUrl.protocol === "http:"))) return true;

    // Codespaces TLS terminates upstream. The backend only listens on loopback,
    // while the browser sees a *.app.github.dev HTTPS origin.
    // Require both browser Origin and Referer to match exactly to avoid
    // accepting cross-site browser requests forwarded through a dev proxy.
    const isLocalProxy = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress);
    const isCodespaces = originUrl.protocol === "https:" &&
      /^[a-z0-9-]+-8080\.app\.github\.dev$/.test(originUrl.hostname);
    const refererUrl = req.headers.referer ? new URL(req.headers.referer) : null;
    if (!secure && isLocalProxy && isCodespaces &&
        refererUrl?.origin === originUrl.origin) return true;

    // Codespaces forwards HTTPS traffic to Vite over HTTP on localhost:8080.
    // Vite may rewrite the Origin header to http://localhost:8080 while
    // preserving the browser's actual HTTPS Referer and forwarded host.
    // Only trust this exact development-only combination, from loopback.
    const proxyHost = typeof forwardedHost === "string" ? forwardedHost : "";
    const codespacesForwardedHost = /^[a-z0-9-]+-8080\.app\.github\.dev$/.test(proxyHost);
    const localViteOrigin = ["http://localhost:8080", "http://127.0.0.1:8080"].includes(originUrl.origin);
    if (!secure && isLocalProxy && localViteOrigin && codespacesForwardedHost &&
        refererUrl?.protocol === "https:" && refererUrl.host === proxyHost &&
        req.headers["sec-fetch-site"] === "same-origin") return true;
    return false;
  } catch {
    return false;
  }
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
  if (req.method !== "POST") return respond(res,405,{error:"Method not allowed"});
  if (!checkOrigin(req)) {
    console.warn("[auth] Rejected request origin:", {
      origin: req.headers.origin || "(absent)",
      referer: req.headers.referer || "(absent)",
      host: req.headers.host,
      forwardedHost: req.headers["x-forwarded-host"] || "(absent)",
      fetchSite: req.headers["sec-fetch-site"] || "(absent)",
      remoteAddress: req.socket.remoteAddress
    });
    return respond(res,403,{error:"Request origin rejected. Restart npm run dev, then retry."});
  }
  if (req.url==="/api/auth/login") {
    const ip=(req.socket.remoteAddress || "unknown");
    const recent=(attempts.get(ip)||[]).filter(ts=>Date.now()-ts<15*60*1000);
    if(recent.length>=8) return respond(res,429,{error:"Too many login attempts. Try again later."});
    attempts.set(ip,recent);
    let body;
    try {body=await parseBody(req);}catch{return respond(res,400,{error:"Invalid request"});}
    const password=typeof body?.password==="string" ? body.password : "";
    const users=await loadUsers();
    // Shared-password access is limited to the pre-created portaladmin account.
    // Never trust a supplied username/role from the browser.
    const user=users.find(x=>x.username.toLowerCase()==="portaladmin" && x.role==="admin" && x.enabled!==false);
    // Compute a comparable hash even for an unknown account to reduce username enumeration timing signals.
    const fallback="scrypt:16384:8:1:00000000000000000000000000000000:"+("00".repeat(64));
    const valid=await verifyPassword(password,user?.passwordHash || fallback);
    if(!user||!valid){recent.push(Date.now());attempts.set(ip,recent);return respond(res,401,{error:"Invalid password"});}
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
