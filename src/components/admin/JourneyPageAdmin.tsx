
import { useEffect, useState } from "react";
import { watchContent } from "@/lib/sharedContent";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import { readJourney, saveJourney, resetJourney, type JourneyConfig, type ItemEdit, type ActionEdit } from "@/lib/developmentJourney";
import { defaultStages } from "@/pages/ProjectJourneyPage";
import { journeyDefaultPhases, journeyDefaultActions } from "@/components/portal/ProjectJourneyChecklist";

type Selected = { kind: "item" | "action"; id: string } | null;
const splitLines = (value: string) => value.split("\n").map(line => line.trim()).filter(Boolean);
const asLines = (value?: string[]) => (value || []).join("\n");

export default function JourneyPageAdmin() {
  const [config, setConfig] = useState<JourneyConfig>(readJourney);
  const [selected, setSelected] = useState<Selected>(null);
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  useEffect(()=>watchContent(()=>{if(!dirty)setConfig(readJourney());}),[dirty]);
  const update = (patch: Partial<JourneyConfig>) => { setConfig(old => ({...old,...patch}));setDirty(true);setNotice(""); };
  const setStage = (id: string, key: "en" | "ar" | "description" | "descriptionAr", value: string) => {
    const base = defaultStages.find(stage => stage.targetId === id)!;
    update({ stages: { ...config.stages, [id]: {en:base.en, ar:base.ar, description:base.description, descriptionAr:base.descriptionAr, ...config.stages?.[id], [key]:value} } });
  };
  const setPhase = (id: string, key: "name" | "nameAr" | "beforeNotes" | "beforeNotesAr", value: string) => {
    update({phases:{...config.phases,[id]:{...config.phases?.[id],[key]: key==="beforeNotes"||key==="beforeNotesAr" ? splitLines(value) : value}}});
  };
  const setItem = (id:string, patch:Partial<ItemEdit>) =>
    update({items:{...config.items,[id]:{...config.items?.[id],...patch}}});
  const setAction = (id:string, patch:Partial<ActionEdit>) =>
    update({actions:{...config.actions,[id]:{...config.actions?.[id],...patch}}});
  const inputClass="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm";
  const line=(title:string, value:string, onChange:(v:string)=>void, multi=false) =>
    <label className="block text-xs font-semibold text-slate-600">{title}{multi
      ? <textarea rows={3} className={inputClass} value={value} onChange={e=>onChange(e.target.value)}/>
      : <input className={inputClass} value={value} onChange={e=>onChange(e.target.value)}/>}</label>;
  const itemInfo = selected?.kind==="item"
    ? journeyDefaultPhases.flatMap(p=>p.items).find(item=>item.id===selected.id) : undefined;
  const actionInfo = selected?.kind==="action" ? journeyDefaultActions[Number(selected.id)] : undefined;
  const currentItem = itemInfo ? {...itemInfo,...config.items?.[itemInfo.id]} : undefined;
  const currentAction = actionInfo && selected ? {...actionInfo,...config.actions?.[selected.id]} : undefined;
  const save = () => {void saveJourney(config).then(()=>{setDirty(false);setNotice("Guide published for all visitors.");}).catch(e=>setNotice(String(e.message||e)));};
  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-5">
      <div><h2 className="text-xl font-bold">New Product / Project Guide Editor</h2><p className="mt-1 text-sm text-slate-500">Edit content of the actual guide page, not just request catalog cards.</p></div>
      <div className="flex flex-wrap gap-2">
        <a href="/#/tools/project-journey-checklist" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><ExternalLink size={16}/>Preview guide</a>
        <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"><Save size={16}/>Save Guide {dirty?"•":""}</button>
        <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm" onClick={()=>{if(confirm("Reset all guide content changes?")){void resetJourney().then(()=>{setConfig({});setDirty(false);setNotice("Guide defaults published.");}).catch(e=>setNotice(String(e.message||e)));}}}><RotateCcw size={16}/>Reset Guide</button>
      </div>
    </div>
    {notice && <p role="status" className="rounded-lg border bg-white px-4 py-3 text-sm">{notice}</p>}
    <div className="rounded-xl border bg-white p-5">
      <h3 className="mb-3 text-lg font-bold">Page introduction</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {line("Journey heading — English",config.headingEn??"Follow the stages in order",v=>update({headingEn:v}))}
        {line("عنوان المسار — عربي",config.headingAr??"اتبع المراحل بالترتيب",v=>update({headingAr:v}))}
        {line("Hero description — English",config.heroEn??"A structured path from project setup to publishing, with the required Jira requests, actions, and guidance for every stage.",v=>update({heroEn:v}),true)}
        {line("وصف مقدمة الصفحة — عربي",config.heroAr??"مسار موحّد يوضح ما يجب تنفيذه من بداية المشروع وحتى النشر، مع طلبات Jira والملاحظات المطلوبة لكل مرحلة.",v=>update({heroAr:v}),true)}
      </div>
    </div>
    <div className="rounded-xl border bg-white p-5">
      <h3 className="mb-3 text-lg font-bold">Journey map & quick navigation — Five stages</h3>
      <p className="mb-4 text-sm text-slate-500">Changes below update both the journey map cards and the quick navigation labels.</p>
      <div className="space-y-4">{defaultStages.map((stage,index)=>{
        const row={...stage,...config.stages?.[stage.targetId]};
        return <div key={stage.targetId} className="rounded-lg border p-4">
          <h4 className="mb-3 font-semibold"><span className="mr-2 rounded-full bg-blue-100 px-2.5 py-1 text-blue-700">{index+1}</span>{stage.en}</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {line("Name — English",row.en,v=>setStage(stage.targetId,"en",v))}
            {line("الاسم — عربي",row.ar,v=>setStage(stage.targetId,"ar",v))}
            {line("Description — English",row.description,v=>setStage(stage.targetId,"description",v),true)}
            {line("الوصف — عربي",row.descriptionAr,v=>setStage(stage.targetId,"descriptionAr",v),true)}
          </div>
        </div>;
      })}</div>
    </div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-5">
        {journeyDefaultPhases.map(phase=>{
          const configPhase=config.phases?.[phase.name];
          return <div className="rounded-xl border bg-white p-5" key={phase.name}>
            <h3 className="text-lg font-bold">{phase.name} — Guide content</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {line("Section title — English",configPhase?.name??phase.name,v=>setPhase(phase.name,"name",v))}
              {line("عنوان القسم — عربي",configPhase?.nameAr??phase.nameAr,v=>setPhase(phase.name,"nameAr",v))}
              {line("Before proceeding notes — English (one per line)",asLines(configPhase?.beforeNotes??phase.beforeNotes),v=>setPhase(phase.name,"beforeNotes",v),true)}
              {line("ملاحظات قبل المتابعة — عربي (كل ملاحظة بسطر)",asLines(configPhase?.beforeNotesAr??phase.beforeNotesAr),v=>setPhase(phase.name,"beforeNotesAr",v),true)}
            </div>
            <h4 className="mb-2 mt-5 font-semibold">Requests and checklist items</h4>
            <div className="space-y-2">{phase.items.map(item=>{
              const effective={...item,...config.items?.[item.id]};
              return <button key={item.id} onClick={()=>setSelected({kind:"item",id:item.id})}
                className={`block w-full rounded-lg border px-4 py-3 text-left text-sm hover:bg-blue-50 ${selected?.kind==="item"&&selected.id===item.id?"border-blue-500 bg-blue-50":""}`}>
                <span className="font-semibold">{effective.title}</span>
                {effective.hidden && <span className="ml-2 text-xs text-red-600">(Hidden)</span>}
                <span className="block text-xs text-slate-500">{effective.titleAr}</span>
              </button>;
            })}</div>
          </div>;
        })}
        <section className="rounded-xl border bg-white p-5"><h3 className="text-lg font-bold">Parallel actions</h3><p className="mb-3 text-sm text-slate-500">Edit registration, SSL, CAPTCHA, performance testing and related optional actions.</p>
          <div className="space-y-2">{journeyDefaultActions.map((action,index)=>{
            const current={...action,...config.actions?.[String(index)]};
            return <button key={index} onClick={()=>setSelected({kind:"action",id:String(index)})}
              className={`block w-full rounded-lg border p-3 text-left text-sm hover:bg-blue-50 ${selected?.kind==="action"&&selected.id===String(index)?"border-blue-500 bg-blue-50":""}`}>
              <span className="font-semibold">{current.title}</span>{current.hidden&&<span className="ml-2 text-xs text-red-600">(Hidden)</span>}
              <span className="block text-xs text-slate-500">{current.titleAr}</span>
            </button>;
          })}</div>
        </section>
      </div>
      <aside className="h-fit rounded-xl border bg-white p-5 lg:sticky lg:top-4">
        {currentItem && itemInfo ? <div className="space-y-4">
          <h3 className="text-lg font-bold">Edit checklist item</h3>
          {line("Title — English",currentItem.title,v=>setItem(itemInfo.id,{title:v}))}
          {line("العنوان — عربي",currentItem.titleAr??"",v=>setItem(itemInfo.id,{titleAr:v}))}
          {line("Instructions — English",currentItem.instruction,v=>setItem(itemInfo.id,{instruction:v}),true)}
          {line("التعليمات — عربي",currentItem.instructionAr??"",v=>setItem(itemInfo.id,{instructionAr:v}),true)}
          {line("Service name",currentItem.serviceName??"",v=>setItem(itemInfo.id,{serviceName:v}))}
          {line("Jira URL",currentItem.jiraUrl??"",v=>setItem(itemInfo.id,{jiraUrl:v}))}
          {line("Requirement note — English",currentItem.requirementNote??"",v=>setItem(itemInfo.id,{requirementNote:v}),true)}
          {line("ملاحظة المتطلبات — عربي",currentItem.requirementNoteAr??"",v=>setItem(itemInfo.id,{requirementNoteAr:v}),true)}
          {line("Notes — English (one per line)",asLines(currentItem.notes),v=>setItem(itemInfo.id,{notes:splitLines(v)}),true)}
          {line("الملاحظات — عربي (كل ملاحظة بسطر)",asLines(currentItem.notesAr),v=>setItem(itemInfo.id,{notesAr:splitLines(v)}),true)}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={currentItem.required} onChange={e=>setItem(itemInfo.id,{required:e.target.checked})}/>Required</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!currentItem.hidden} onChange={e=>setItem(itemInfo.id,{hidden:e.target.checked})}/>Hide item</label>
        </div> : currentAction && selected ? <div className="space-y-4">
          <h3 className="text-lg font-bold">Edit optional action</h3>
          {line("Title — English",currentAction.title,v=>setAction(selected.id,{title:v}))}
          {line("العنوان — عربي",currentAction.titleAr,v=>setAction(selected.id,{titleAr:v}))}
          {line("Jira URL",currentAction.jiraUrl??"",v=>setAction(selected.id,{jiraUrl:v}))}
          {line("Notes — English",asLines(currentAction.notes),v=>setAction(selected.id,{notes:splitLines(v)}),true)}
          {line("الملاحظات — عربي",asLines(currentAction.notesAr),v=>setAction(selected.id,{notesAr:splitLines(v)}),true)}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!currentAction.hidden} onChange={e=>setAction(selected.id,{hidden:e.target.checked})}/>Hide action</label>
        </div> : <div className="py-8 text-center text-sm text-slate-500">Select a checklist item or parallel action to edit its English/Arabic texts, notes and Jira link.</div>}
      </aside>
    </div>
    <p className="text-sm text-slate-500">This editor covers the hero, navigation stages, core phase checklists, and parallel actions. Other custom sections such as detailed developer access, deployment and publishing workflows remain code-defined in this iteration. Changes publish immediately to the development portal after Save. Production/main remains unchanged.</p>
  </section>;
}
