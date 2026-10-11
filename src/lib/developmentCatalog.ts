import { useEffect, useState } from "react";
import { requests as defaults, type ServiceRequest } from "@/data/requests";

const KEY = "sr-development-catalog-v1";
const EVENT = "sr-development-catalog-change";
export type ManagedRequest = ServiceRequest & { hidden?: boolean };
const normalize = (value: unknown): ManagedRequest[] => {
  if (!Array.isArray(value)) return [...defaults];
  const valid = value.filter((item): item is ManagedRequest =>
    !!item && typeof item.id === "string" && typeof item.title === "string" &&
    typeof item.section === "string" && typeof item.category === "string" &&
    typeof item.shortDescription === "string" && typeof item.jiraUrl === "string"
  );
  return valid.length || value.length === 0 ? valid : [...defaults];
};
export function readDevelopmentCatalog(): ManagedRequest[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw === null ? [...defaults] : normalize(JSON.parse(raw));
  } catch {
    return [...defaults];
  }
}
export function saveDevelopmentCatalog(items: ManagedRequest[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}
export function resetDevelopmentCatalog() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}
export function useDevelopmentCatalog() {
  const [items, setItems] = useState<ManagedRequest[]>(readDevelopmentCatalog);
  useEffect(() => {
    const sync = () => setItems(readDevelopmentCatalog());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items.filter(item => !item.hidden);
}
export function getOriginalCatalog() { return [...defaults]; }
