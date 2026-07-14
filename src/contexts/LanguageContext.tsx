import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getTranslations } from "@/i18n/translations";
import type { TranslationSet } from "@/i18n/translations";

export type Language = "en" | "ar";

interface LanguageContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  copy: TranslationSet;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem("portal-language");
    return saved === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    const direction = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dir = direction;
    window.localStorage.setItem("portal-language", language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: language === "ar" ? "rtl" : "ltr",
      copy: getTranslations(language),
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "ar" : "en")),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
