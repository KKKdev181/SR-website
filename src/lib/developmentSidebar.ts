import { useEffect, useState } from "react";
import { portalCategories } from "@/data/portalCategories";

export interface SidebarSetting { id: string; en: string; ar: string; hidden: boolean }
const KEY = "sr-development-sidebar-v1";
const EVENT = "sr-development-sidebar-change";
const defaults = (): SidebarSetting[] => portalCategories.map(({ id, en, ar }) => ({ id, en, ar, hidden: false }));
export const originalSidebar = defaults;
export function readSidebar(): SidebarSetting[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!Array.isArray(parsed)) return defaults();
    const rows = parsed.filter((x): x is SidebarSetting => !!x && typeof x.id === "string" && typeof x.en === "string" && typeof x.ar === "string" && typeof x.hidden === "boolean");
    return [...rows.filter(row => defaults().some(d => d.id === row.id)), ...defaults().filter(row => !rows.some(x => x.id === row.id))];
  } catch { return defaults(); }
}
export function saveSidebar(rows: SidebarSetting[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
  window.dispatchEvent(new Event(EVENT));
}
export function resetSidebar() { localStorage.removeItem(KEY); window.dispatchEvent(new Event(EVENT)); }
export function useSidebar() {
  const [rows, setRows] = useState(readSidebar);
  useEffect(() => {
    const sync = () => setRows(readSidebar());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return rows;
}
