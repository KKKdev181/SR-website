import { useEffect, useState } from "react";
import { portalCategories } from "@/data/portalCategories";
import { readContentSection, writeContent, watchContent } from "./sharedContent";
export interface SidebarSetting {id:string;en:string;ar:string;hidden:boolean}
const defaults=():SidebarSetting[]=>portalCategories.map(({id,en,ar})=>({id,en,ar,hidden:false}));
export const originalSidebar=defaults;
export function readSidebar():SidebarSetting[]{
 const parsed=readContentSection<SidebarSetting[]>("sidebar");
 if(!Array.isArray(parsed))return defaults();
 const rows=parsed.filter(x=>!!x&&typeof x.id==="string"&&typeof x.en==="string"&&typeof x.ar==="string"&&typeof x.hidden==="boolean");
 return [...rows.filter(x=>defaults().some(d=>d.id===x.id)),...defaults().filter(x=>!rows.some(y=>y.id===x.id))];
}
export async function saveSidebar(rows:SidebarSetting[]){await writeContent("sidebar",rows);}
export async function resetSidebar(){await writeContent("sidebar",defaults());}
export function useSidebar(){
 const [rows,setRows]=useState(readSidebar);
 useEffect(()=>watchContent(()=>setRows(readSidebar())),[]);
 return rows;
}
