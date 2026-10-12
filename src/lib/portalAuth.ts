import { useEffect, useState } from "react";

export type SignedInUser = {name:string;username:string;role:"admin"|"editor";isEditor:boolean};
const EVENT="sr-portal-auth-change";
async function request(url:string, init?:RequestInit){
  const res=await fetch(url,{...init,credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json",...init?.headers}});
  const data=await res.json();
  if(!res.ok) throw new Error(data.error || "Authentication service unavailable");
  return data;
}
export async function signIn(password:string):Promise<void> {
  await request("/api/auth/login",{method:"POST",body:JSON.stringify({password})});
  window.dispatchEvent(new Event(EVENT));
}
export async function signOut():Promise<void> {
  await request("/api/auth/logout",{method:"POST",body:"{}"});
  window.dispatchEvent(new Event(EVENT));
}
export function usePortalAuth() {
  const [user,setUser]=useState<SignedInUser|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{
    let alive=true;
    const sync=()=>{setLoading(true);void request("/api/auth/session").then(data=>{
      if(alive){setUser(data.user || null);setError("");setLoading(false);}
    }).catch(e=>{if(alive){setUser(null);setError(e instanceof Error?e.message:"Service unavailable");setLoading(false);}});};
    sync();
    window.addEventListener(EVENT,sync);
    return()=>{alive=false;window.removeEventListener(EVENT,sync);};
  },[]);
  return {user,loading,error,configured:true,signIn,signOut};
}
