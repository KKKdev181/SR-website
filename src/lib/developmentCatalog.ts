import { useEffect, useState } from "react";
import { requests as defaults, type ServiceRequest } from "@/data/requests";
import { readContentSection, writeContent, watchContent } from "./sharedContent";
export type ManagedRequest = ServiceRequest & { hidden?: boolean };
const normalize=(value:unknown):ManagedRequest[]=>{
  if(!Array.isArray(value))return [...defaults];
  const rows=value.filter((x):x is ManagedRequest=>!!x&&typeof x.id==="string"&&typeof x.title==="string"&&typeof x.section==="string"&&typeof x.category==="string"&&typeof x.shortDescription==="string"&&typeof x.jiraUrl==="string");
  return rows.length===value.length?rows:[...defaults];
};
export function readDevelopmentCatalog():ManagedRequest[]{return normalize(readContentSection("catalog"));}
export async function saveDevelopmentCatalog(rows:ManagedRequest[]){await writeContent("catalog",normalize(rows));}
export async function resetDevelopmentCatalog(){await writeContent("catalog",[...defaults]);}
export function useDevelopmentCatalog(){
 const [items,setItems]=useState<ManagedRequest[]>(readDevelopmentCatalog);
 useEffect(()=>watchContent(()=>setItems(readDevelopmentCatalog())),[]);
 return items.filter(x=>!x.hidden);
}
export function getOriginalCatalog(){return [...defaults];}
