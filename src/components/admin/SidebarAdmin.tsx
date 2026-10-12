import { useEffect, useState } from "react";
import { watchContent } from "@/lib/sharedContent";
import { ArrowDown, ArrowUp, Save } from "lucide-react";
import { readSidebar, saveSidebar, type SidebarSetting } from "@/lib/developmentSidebar";

export default function SidebarAdmin() {
  const [rows,setRows] = useState<SidebarSetting[]>(readSidebar);
  const [notice,setNotice]=useState("");
  const [dirty,setDirty]=useState(false);
  useEffect(()=>watchContent(()=>{if(!dirty)setRows(readSidebar());}),[dirty]);
  const change=(id:string,patch:Partial<SidebarSetting>) => {setRows(v=>v.map(x=>x.id===id?{...x,...patch}:x));setDirty(true);};
  const move=(index:number,delta:number) => {
    const next=index+delta;if(next<0||next>=rows.length)return;
    setRows(old=>{const copy=[...old];[copy[index],copy[next]]=[copy[next],copy[index]];return copy;});
    setDirty(true);
  };
  return <section className="rounded-xl border bg-white p-5 shadow-sm">
    <h2 className="text-xl font-bold">Sidebar Management</h2>
    <p className="my-3 text-sm text-slate-500">Edit labels in both languages, choose visibility and reorder categories. Current category classification rules remain unchanged.</p>
    <div className="space-y-2">{rows.map((row,i)=><div key={row.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]">
      <label className="text-xs font-medium">English<input className="mt-1 w-full rounded border p-2 text-sm" value={row.en} onChange={e=>change(row.id,{en:e.target.value})}/></label>
      <label className="text-xs font-medium">Arabic<input dir="rtl" className="mt-1 w-full rounded border p-2 text-sm" value={row.ar} onChange={e=>change(row.id,{ar:e.target.value})}/></label>
      <div className="flex items-center gap-2"><button aria-label="Move category up" className="rounded border p-2" onClick={()=>move(i,-1)}><ArrowUp size={16}/></button><button aria-label="Move category down" className="rounded border p-2" onClick={()=>move(i,1)}><ArrowDown size={16}/></button><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={row.hidden} onChange={e=>change(row.id,{hidden:e.target.checked})}/> Hide</label></div>
    </div>)}</div>
    <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white" onClick={()=>{void saveSidebar(rows).then(()=>{setDirty(false);setNotice("Sidebar published for all users.");}).catch(e=>setNotice(String(e.message||e)));}}><Save size={16}/> Save sidebar</button>
    {notice&&<span role="status" className="ml-3 text-sm text-slate-700">{notice}</span>}
  </section>;
}
