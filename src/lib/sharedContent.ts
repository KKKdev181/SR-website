export type ContentSection = "catalog" | "sidebar" | "header" | "journey";
type Snapshot = {version:number;sections:Partial<Record<ContentSection,unknown>>};
let snapshot:Snapshot={version:0,sections:{}};
let ready=false;
let loading:Promise<void>|null=null;
const callbacks=new Set<()=>void>();
function notify(){for(const fn of callbacks)fn();}
export function watchContent(callback:()=>void){callbacks.add(callback);return ()=>{callbacks.delete(callback);};}
export function readContentSection<T>(section:ContentSection):T|undefined{return snapshot.sections[section] as T|undefined;}
export function contentReady(){return ready;}
export async function refreshContent(){
  if(loading)return loading;
  loading=(async()=>{
    const res=await fetch("/api/content",{cache:"no-store",credentials:"same-origin"});
    if(!res.ok)throw Error("Shared content unavailable (HTTP "+res.status+").");
    const result=await res.json() as Snapshot;
    if(typeof result.version!=="number"||!result.sections)throw Error("Invalid content response");
    snapshot=result;ready=true;notify();
  })().finally(()=>{loading=null;});
  return loading;
}
export async function writeContent(section:ContentSection,value:unknown){
  await refreshContentIfNecessary();
  const res=await fetch("/api/content",{method:"PUT",credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({section,value,version:snapshot.version})});
  const result=await res.json();
  if(!res.ok){
    if(res.status===409)await refreshContent();
    throw Error(result.error||"Could not save shared content");
  }
  snapshot={version:result.version,sections:{...snapshot.sections,[section]:value}};
  notify();
  return result;
}
async function refreshContentIfNecessary(){if(!ready)await refreshContent();}
export async function getChangeHistory(){
  const res=await fetch("/api/content/history",{credentials:"same-origin",cache:"no-store"});
  const value=await res.json();
  if(!res.ok)throw Error(value.error||"Could not retrieve history");
  return value.history as {id:string;section:ContentSection;version:number;at:string;actor:{username:string;name:string};changes:{path:string;before:unknown;after:unknown}[]}[];
}
// Content remains readable publicly; edits require the authenticated backend session.
if(typeof window!=="undefined"){
  void refreshContent().catch(error=>console.warn("[portal] Shared data could not load:",error));
  window.addEventListener("focus",()=>{void refreshContent().catch(()=>{});});
}
