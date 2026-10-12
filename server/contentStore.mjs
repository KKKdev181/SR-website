import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const path = resolve(process.env.PORTAL_CONTENT_FILE || "./private-data/content.json");
const allowed = new Set(["catalog", "sidebar", "header", "journey"]);
const blank = () => ({version:0, sections:{}, history:[]});
let queue = Promise.resolve();

async function read() {
  try {const value = JSON.parse(await readFile(path, "utf8")); return value?.sections && Array.isArray(value.history) ? value : blank();}
  catch(e) {if(e.code === "ENOENT") return blank();throw e;}
}
async function write(value) {
  await mkdir(dirname(path),{recursive:true,mode:0o700});
  const temp=path+"."+randomBytes(6).toString("hex")+".tmp";
  await writeFile(temp,JSON.stringify(value,null,2),{mode:0o600,flag:"wx"});
  await rename(temp,path);
}
function diff(oldValue,newValue,path="",out=[]) {
  if(JSON.stringify(oldValue)===JSON.stringify(newValue))return out;
  if(Array.isArray(oldValue)||Array.isArray(newValue)) {
    if(Array.isArray(oldValue)&&Array.isArray(newValue)&&oldValue.every(x=>x?.id)&&newValue.every(x=>x?.id)) {
      const before=new Map(oldValue.map((item,i)=>[item.id,{item,i}]));
      const after=new Map(newValue.map((item,i)=>[item.id,{item,i}]));
      for(const id of new Set([...before.keys(),...after.keys()])) {
        const a=before.get(id),b=after.get(id);
        diff(a?.item,b?.item,path+"/"+id,out);
        if(a&&b&&a.i!==b.i) out.push({path:path+"/"+id+"/position",before:a.i+1,after:b.i+1});
      }
    } else out.push({path,before:oldValue,after:newValue});
  } else if(oldValue && newValue && typeof oldValue==="object" && typeof newValue==="object") {
    for(const key of new Set([...Object.keys(oldValue),...Object.keys(newValue)]))diff(oldValue[key],newValue[key],path+"/"+key,out);
  } else out.push({path,before:oldValue??null,after:newValue??null});
  return out;
}
export async function getContent() {const state=await read();return {version:state.version,sections:state.sections};}
export async function getHistory() {const state=await read();return state.history.slice(-250).reverse();}
export function updateContent(section,value,expectedVersion,actor) {
  const operation=queue.then(async()=>{
    if(!allowed.has(section))return {error:"Unknown content section",status:400};
    const encoded=JSON.stringify(value);
    if(!encoded||encoded.length>2_000_000)return {error:"Invalid or oversized section",status:413};
    const state=await read();
    if(expectedVersion!==state.version)return {error:"Content changed since you opened it. Refresh and retry.",status:409,version:state.version};
    const changes=diff(state.sections[section],value);
    if(!changes.length)return {version:state.version,changes:0};
    state.sections[section]=value;
    state.version++;
    state.history.push({id:randomBytes(12).toString("hex"),section,version:state.version,at:new Date().toISOString(),actor:{username:actor.username,name:actor.name},changes});
    await write(state);
    return {version:state.version,changes:changes.length};
  });
  queue=operation.then(()=>{},()=>{});
  return operation;
}
