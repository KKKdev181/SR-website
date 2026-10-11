import { useEffect, useState } from "react";

export const headerKeys = ["portal","guide","finder","jira","approvals","admin","support"] as const;
export type HeaderKey = typeof headerKeys[number];
export type HeaderSettings = Record<HeaderKey, { en: string; ar: string; visible: boolean }>;
const STORAGE_KEY = "sr-development-header-labels-v1";
const EVENT = "sr-development-header-labels-change";
export const headerDefaults: HeaderSettings = {
  portal: { en: "Requests Portal", ar: "بوابة الطلبات", visible: true },
  guide: { en: "New Product/Project Guide", ar: "دليل المنتج / المشروع الجديد", visible: true },
  finder: { en: "Request Finder", ar: "موجّه الطلبات", visible: true },
  jira: { en: "My Jira Requests", ar: "طلباتي في Jira", visible: true },
  approvals: { en: "My Pending Approvals", ar: "موافقاتي المعلقة", visible: true },
  admin: { en: "Admin", ar: "الإدارة", visible: true },
  support: { en: "Contact Support", ar: "الدعم", visible: true },
};
export function readHeaderSettings(): HeaderSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<HeaderSettings> | null;
    return Object.fromEntries(headerKeys.map(key => {
      const item = parsed?.[key];
      return [key, {
        en: typeof item?.en === "string" && item.en.trim() ? item.en : headerDefaults[key].en,
        ar: typeof item?.ar === "string" && item.ar.trim() ? item.ar : headerDefaults[key].ar,
        visible: typeof item?.visible === "boolean" ? item.visible : true,
      }];
    })) as HeaderSettings;
  } catch { return structuredClone(headerDefaults); }
}
export function saveHeaderSettings(value: HeaderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}
export function resetHeaderSettings() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT));
}
export function useHeaderSettings() {
  const [value, setValue] = useState(readHeaderSettings);
  useEffect(() => {
    const sync = () => setValue(readHeaderSettings());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return value;
}
