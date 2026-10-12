import { useEffect, useState } from "react";
import { watchContent } from "@/lib/sharedContent";
import { Save, RotateCcw } from "lucide-react";
import {
  headerKeys, headerDefaults, readHeaderSettings, saveHeaderSettings, resetHeaderSettings,
  type HeaderSettings, type HeaderKey,
} from "@/lib/developmentHeader";

const names: Record<HeaderKey,string> = {
  portal: "Portal name", guide: "New Product/Project Guide", finder: "Request Finder",
  jira: "My Jira Requests", approvals: "My Pending Approvals", admin: "Admin (temporary)",
  support: "Support",
};

export default function HeaderAdmin() {
  const [settings,setSettings] = useState<HeaderSettings>(readHeaderSettings);
  const [notice,setNotice] = useState("");
  const [dirty,setDirty] = useState(false);
  useEffect(()=>watchContent(()=>{if(!dirty)setSettings(readHeaderSettings());}),[dirty]);
  const change=(id:HeaderKey,field:"en"|"ar"|"visible",value:string|boolean) => {
    setSettings(old => ({...old,[id]:{...old[id],[field]:value}}));
    setNotice("");setDirty(true);
  };
  return <section className="rounded-xl border bg-white p-5 shadow-sm">
    <h2 className="text-xl font-bold">Top Bar / Header</h2>
    <p className="my-3 text-sm text-slate-500">Edit each header item separately in English and Arabic. Text switches with the portal language. Hiding a button does not delete its linked page or grant access control.</p>
    <div className="space-y-4">{headerKeys.map(id=><div className="rounded-lg border p-4" key={id}>
      <div className="mb-3 flex flex-wrap justify-between gap-2"><h3 className="text-sm font-bold">{names[id]}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={settings[id].visible} onChange={e=>change(id,"visible",e.target.checked)}/> Visible</label></div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs font-semibold text-slate-600">English
          <input className="mt-1 w-full rounded-lg border p-3 text-sm text-slate-800" value={settings[id].en} onChange={e=>change(id,"en",e.target.value)}/>
        </label>
        <label className="text-xs font-semibold text-slate-600">Arabic
          <input dir="rtl" className="mt-1 w-full rounded-lg border p-3 text-sm text-slate-800" value={settings[id].ar} onChange={e=>change(id,"ar",e.target.value)}/>
        </label>
      </div>
    </div>)}</div>
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white" onClick={()=>{
        if(headerKeys.some(k=>!settings[k].en.trim()||!settings[k].ar.trim())) {setNotice("All English and Arabic labels are required.");return;}
        void saveHeaderSettings(settings).then(()=>{setDirty(false);setNotice("Header published to all users.");}).catch(e=>setNotice(String(e.message||e)));
      }}><Save size={16}/>Save header</button>
      <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm" onClick={()=>{
        if(!confirm("Restore default header labels and visibility?"))return;
        void resetHeaderSettings().then(()=>{setSettings(structuredClone(headerDefaults));setDirty(false);setNotice("Header defaults published.");}).catch(e=>setNotice(String(e.message||e)));
      }}><RotateCcw size={16}/>Reset header</button>
      {notice && <span role="status" className="text-sm text-slate-600">{notice}</span>}
    </div>
  </section>;
}
