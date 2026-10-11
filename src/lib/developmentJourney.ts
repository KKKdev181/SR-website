import { useEffect, useState } from "react";

export type StageEdit = { en: string; ar: string; description: string; descriptionAr: string };
export type ItemEdit = {
  title?: string; titleAr?: string; instruction?: string; instructionAr?: string;
  jiraUrl?: string; serviceName?: string; requirementNote?: string; requirementNoteAr?: string;
  notes?: string[]; notesAr?: string[]; required?: boolean; hidden?: boolean;
};
export type PhaseEdit = { name?: string; nameAr?: string; beforeNotes?: string[]; beforeNotesAr?: string[] };
export type ActionEdit = { title?: string; titleAr?: string; jiraUrl?: string; notes?: string[]; notesAr?: string[]; hidden?: boolean };
export type JourneyConfig = {
  heroEn?: string; heroAr?: string; headingEn?: string; headingAr?: string;
  stages?: Record<string, StageEdit>;
  phases?: Record<string, PhaseEdit>;
  items?: Record<string, ItemEdit>;
  actions?: Record<string, ActionEdit>;
};
const KEY = "sr-dev-full-journey-v1";
const EVENT = "sr-dev-full-journey-update";
export function readJourney(): JourneyConfig {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as JourneyConfig : {};
  } catch { return {}; }
}
export function saveJourney(config: JourneyConfig) {
  localStorage.setItem(KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(EVENT));
}
export function resetJourney() { localStorage.removeItem(KEY); window.dispatchEvent(new Event(EVENT)); }
export function useJourney() {
  const [value,setValue] = useState(readJourney);
  useEffect(() => {
    const sync = () => setValue(readJourney());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {window.removeEventListener(EVENT, sync);window.removeEventListener("storage", sync);};
  }, []);
  return value;
}
