import { useEffect, useState } from "react";
import { Clock3, RefreshCw } from "lucide-react";
import { getChangeHistory } from "@/lib/sharedContent";

type Entry = Awaited<ReturnType<typeof getChangeHistory>>[number];
const renderValue = (v:unknown) => {
  if(v===null || v===undefined) return "(empty)";
  if(typeof v==="string")return v;
  return JSON.stringify(v);
};
export default function ChangeHistoryAdmin(){
  const [entries,setEntries]=useState<Entry[]>([]);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [section,setSection]=useState("all");
  const load=()=>{
    setBusy(true);setError("");
    void getChangeHistory().then(setEntries).catch(e=>setError(String(e.message||e))).finally(()=>setBusy(false));
  };
  useEffect(()=>{load();},[]);
  const filtered=entries.filter(e=>section==="all"||e.section===section);
  return <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-bold">Change History</h2><p className="text-sm text-slate-500">Published changes, recorded by signed-in user with old and new values.</p></div>
      <div className="flex items-center gap-2">
        <select aria-label="Filter by section" className="rounded-lg border px-3 py-2 text-sm" value={section} onChange={e=>setSection(e.target.value)}>
          <option value="all">All sections</option><option value="catalog">Cards</option><option value="sidebar">Sidebar</option><option value="header">Header</option><option value="journey">Guide</option>
        </select>
        <button type="button" onClick={load} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><RefreshCw size={16}/>{busy?"Loading":"Refresh"}</button>
      </div>
    </div>
    {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
    {!busy&&!error&&!filtered.length&&<p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">No published edits recorded yet.</p>}
    <div className="space-y-3">{filtered.map(entry=><article key={entry.id} className="rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-semibold capitalize">{entry.section} <span className="ml-1 font-normal text-slate-400">v{entry.version}</span></div>
        <div className="flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14}/><time dateTime={entry.at}>{new Date(entry.at).toLocaleString()}</time></div>
      </div>
      <p className="mt-1 text-sm text-slate-600">By <b>{entry.actor.name}</b> (@{entry.actor.username}) · {entry.changes.length} changes</p>
      <div className="mt-3 space-y-2">{entry.changes.map((change,i)=><div className="rounded-lg bg-slate-50 px-3 py-2 text-xs" key={i}>
        <p className="mb-1 font-mono font-semibold text-slate-700 break-all">{change.path||"/"}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="min-w-0"><span className="font-semibold text-slate-500">Before:</span><pre className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap break-words font-sans">{renderValue(change.before)}</pre></div>
          <div className="min-w-0"><span className="font-semibold text-slate-500">After:</span><pre className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap break-words font-sans">{renderValue(change.after)}</pre></div>
        </div>
      </div>)}</div>
    </article>)}</div>
  </section>;
}
