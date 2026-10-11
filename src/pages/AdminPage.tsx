import HeaderAdmin from "@/components/admin/HeaderAdmin";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, Eye, EyeOff, Plus, RotateCcw, Save, Search, Trash2, Upload } from "lucide-react";
import { getOriginalCatalog, readDevelopmentCatalog, resetDevelopmentCatalog, saveDevelopmentCatalog, type ManagedRequest } from "@/lib/developmentCatalog";

const iconOptions = ["Auto","Server","Database","Cloud","Network","ShieldCheck","KeyRound","Globe2","HardDrive","Boxes","Workflow","GitBranch","Rocket","Users","Settings","FileText","AppWindow","Code2","Palette","Smartphone","Bot","Gauge","Plug","Mail","LifeBuoy","Package","Wrench","SearchCheck","LayoutDashboard","FileChartColumn","LockKeyhole","UserCog","Fingerprint","TestTube2","BarChart3","RefreshCw","Activity","Cable","Laptop","PanelTop","FileKey2","CheckCircle2","ChartNoAxesCombined"];
const blank = (): ManagedRequest => ({
  id: "custom-" + crypto.randomUUID(), title: "", section: "Application & Database",
  category: "General IT Operations Services", shortDescription: "", jiraUrl: "",
  keywords: [], popular: false,
});

export default function AdminPage() {
  const [items, setItems] = useState<ManagedRequest[]>(readDevelopmentCatalog);
  const [tab,setTab] = useState<"cards"|"sidebar"|"journey"|"header">("cards");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const [onlyHidden, setOnlyHidden] = useState(false);
  const selected = items.find(item => item.id === editing);
  const filtered = useMemo(() => items.filter(item =>
    (!onlyHidden || item.hidden) &&
    (item.title + " " + item.section + " " + item.category).toLowerCase().includes(search.toLowerCase())
  ), [items, search, onlyHidden]);
  const change = (id: string, patch: Partial<ManagedRequest>) => {
    setItems(old => old.map(item => item.id === id ? { ...item, ...patch } : item));
    setDirty(true);
  };
  const move = (id: string, direction: number) => {
    setItems(old => {
      const copy = [...old], index = copy.findIndex(item => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= copy.length) return old;
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
    setDirty(true);
  };
  const save = () => {
    if (items.some(item => !item.title.trim() || !item.section.trim() || !item.category.trim())) {
      setNotice("Every card requires a title, section and category."); return;
    }
    saveDevelopmentCatalog(items);
    setDirty(false);
    setNotice("Draft saved in this browser only. It is not shared with teammates.");
  };
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "development-requests.json"; a.click();
    URL.revokeObjectURL(url);
  };
  const importJson = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed) || parsed.some(row => !row || typeof row.id !== "string" || typeof row.title !== "string" || typeof row.section !== "string" || typeof row.category !== "string" || typeof row.shortDescription !== "string" || typeof row.jiraUrl !== "string") || new Set(parsed.map(row => row.id)).size !== parsed.length) throw Error("Invalid catalog format");
      setItems(parsed); setDirty(true); setNotice("Imported draft. Click Save Draft to store it locally.");
    } catch { setNotice("Could not import this file. Please select a valid catalog JSON file."); }
  };
  const field = (label: string, key: keyof ManagedRequest, multiline = false) =>
    <label className="block text-sm font-medium text-slate-700">{label}
      {multiline ?
        <textarea className="mt-1 w-full rounded-lg border p-3" rows={4} value={String(selected?.[key] ?? "")} onChange={e => selected && change(selected.id, { [key]: e.target.value })}/> :
        <input className="mt-1 w-full rounded-lg border p-3" value={String(selected?.[key] ?? "")} onChange={e => selected && change(selected.id, { [key]: e.target.value })}/>}
    </label>;
  return <main className="min-h-screen bg-slate-50 text-slate-800">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5">
      <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Development only</p><h1 className="text-2xl font-bold">Requests Portal · Admin</h1><p className="text-sm text-slate-500">Manage request cards and their order — local draft mode</p></div>
      <div className="flex flex-wrap gap-2"><a href="/" className="rounded-lg border px-4 py-2 text-sm">View portal</a><button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"><Save size={16}/>Save Draft {dirty ? "•" : ""}</button></div>
    </div></header>
    <div className="mx-auto max-w-7xl px-6 py-7">
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>Testing environment:</b> Changes are saved only in this browser (localStorage). Other team members cannot see them automatically. This is not a secured login or shared publishing system. Do not deploy this admin route to production before adding server-side authentication and role permissions.</div>
      {notice && <p role="status" className="mb-4 rounded-lg border bg-white px-4 py-3 text-sm">{notice}</p>}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 text-sm"><span className="rounded-lg bg-white px-4 py-3 shadow-sm"><b>{items.length}</b> total cards</span><span className="rounded-lg bg-white px-4 py-3 shadow-sm"><b>{items.filter(i => !i.hidden).length}</b> visible</span><span className="rounded-lg bg-white px-4 py-3 shadow-sm"><b>{items.filter(i => i.hidden).length}</b> hidden</span></div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm" onClick={() => { const item = blank(); setItems(old => [item, ...old]); setEditing(item.id); setDirty(true); }}><Plus size={16}/> Add card</button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm" onClick={exportJson}><Download size={16}/> Export JSON</button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm"><Upload size={16}/> Import JSON<input type="file" accept=".json,application/json" className="hidden" onChange={e => { void importJson(e.target.files?.[0]); e.target.value = ""; }}/></label>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm" onClick={() => { if (confirm("Reset all local changes to the original catalog?")) { resetDevelopmentCatalog(); setItems(getOriginalCatalog()); setEditing(null); setDirty(false); } }}><RotateCcw size={16}/> Reset</button>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">{(["cards","sidebar","journey","header"] as const).map(name => <button key={name} onClick={()=>setTab(name)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab===name?"bg-blue-700 text-white":"border bg-white"}`}>{name==="cards"?"Cards":name==="sidebar"?"Sidebar":name==="journey"?"New Product/Project":"Top Bar / Header"}</button>)}</div>
      {tab==="sidebar" ? <SidebarAdmin/> : tab==="header" ? <HeaderAdmin/> : tab==="journey" ? <section className="rounded-xl border bg-white p-5"><h2 className="text-lg font-bold">New Product/Project</h2><p className="my-3 text-sm text-slate-500">Select a card to edit its journey step and icon. Step 0 excludes it from the journey.</p><div className="grid gap-2 sm:grid-cols-2">{items.filter(item => (item.journeyStep && item.journeyStep>0) || /service name adding|new staging.*server|project ocp environment|register domain|ssl certificate|google captcha|performance test|handover with application|new service publishing/i.test(item.title)).map(item=><button key={item.id} className="rounded-lg border p-3 text-left text-sm hover:bg-blue-50" onClick={()=>{setEditing(item.id);setSearch("");setTab("cards");}}>{item.title}</button>)}</div></section> : <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
        <section className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3"><div className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" placeholder="Search cards or categories" value={search} onChange={e => setSearch(e.target.value)}/></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyHidden} onChange={e => setOnlyHidden(e.target.checked)}/> Hidden only</label></div>
          <p className="mb-3 text-xs text-slate-500">Use arrows to reorder cards. Clear your search to see the full list. Saved order is applied to the development catalog.</p>
          <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
            {filtered.map(item => <div key={item.id} className={`flex items-center gap-2 rounded-lg border p-3 ${editing === item.id ? "border-blue-400 bg-blue-50" : "bg-white"}`}>
              <div className="min-w-0 flex-1"><button onClick={() => setEditing(item.id)} className="block w-full truncate text-left text-sm font-semibold hover:text-blue-700">{item.title || "New card (untitled)"}</button><p className="truncate text-xs text-slate-500">{item.section} · {item.category}</p></div>
              <button title="Move up" aria-label="Move up" className="rounded p-1 hover:bg-slate-100" onClick={() => move(item.id, -1)}><ArrowUp size={16}/></button>
              <button title="Move down" aria-label="Move down" className="rounded p-1 hover:bg-slate-100" onClick={() => move(item.id, 1)}><ArrowDown size={16}/></button>
              <button title={item.hidden ? "Show" : "Hide"} aria-label={item.hidden ? "Show" : "Hide"} className="rounded p-1 hover:bg-slate-100" onClick={() => change(item.id, { hidden: !item.hidden })}>{item.hidden ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
            </div>)}
          </div>
        </section>
        <aside className="h-fit rounded-xl border bg-white p-5 shadow-sm">
          {selected ? <div className="space-y-4"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Edit card</h2><button title="Delete card" className="rounded-lg border border-red-200 p-2 text-red-700" onClick={() => { if (confirm("Delete this card from your development draft?")) { setItems(old => old.filter(i => i.id !== selected.id)); setEditing(null); setDirty(true); } }}><Trash2 size={17}/></button></div>
            {field("Title", "title")}{field("Description", "shortDescription", true)}
            <label className="block text-sm font-medium text-slate-700">Card Icon
              <select className="mt-1 w-full rounded-lg border p-3" value={selected.icon || "Auto"} onChange={e=>change(selected.id,{icon:e.target.value==="Auto"?undefined:e.target.value})}>
                {iconOptions.map(icon=><option key={icon} value={icon}>{icon}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">New Product/Project step (0 to exclude)
              <input type="number" min="0" max="99" className="mt-1 w-full rounded-lg border p-3" placeholder="Automatic" value={selected.journeyStep??""} onChange={e=>change(selected.id,{journeyStep:e.target.value===""?undefined:Number(e.target.value)})}/>
            </label>{field("Section", "section")}{field("Category", "category")}{field("Jira request URL", "jiraUrl")}{field("Environment", "environment")}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!selected.popular} onChange={e => change(selected.id, { popular: e.target.checked })}/> Popular request</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!selected.hidden} onChange={e => change(selected.id, { hidden: e.target.checked })}/> Hide card</label>
          </div> : <div className="py-12 text-center text-slate-500"><p className="font-semibold">Select a card to edit</p><p className="mt-2 text-sm">You can change its title, description, section, category and link.</p></div>}
        </aside>
      </div>}
    </div>
  </main>;
}
