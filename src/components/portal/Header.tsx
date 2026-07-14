import { ChevronDown, ExternalLink, Globe2, ListChecks, Route, WandSparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { language, toggleLanguage } = useLanguage();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isArabic = language === "ar";

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const tools = [
    {
      href: "#project-journey-checklist",
      icon: ListChecks,
      en: "Project Journey Checklist",
      ar: "قائمة رحلة المشروع",
    },
    {
      href: "#request-finder",
      icon: Route,
      en: "Request Finder",
      ar: "موجّه الطلبات",
    },
    {
      href: "#quick-request-match",
      icon: WandSparkles,
      en: "Quick Request Match",
      ar: "المطابقة السريعة للطلب",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-blue-700 bg-[#0757b8] text-white shadow-sm">
      <nav
        aria-label={isArabic ? "التنقل الرئيسي" : "Primary navigation"}
        className="mx-auto flex min-h-[64px] max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <a
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <img src="/elmlogo.png" alt="Elm" className="h-9 w-auto brightness-0 invert" />
            <span className="hidden h-8 w-px bg-white/25 sm:block" />
            <span className="hidden whitespace-nowrap text-lg font-semibold sm:block">
              {isArabic ? "مركز التقنية" : "Technology Center"}
            </span>
          </a>

          <div ref={menuRef} className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setIsToolsOpen((current) => !current)}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3.5 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-expanded={isToolsOpen}
              aria-haspopup="menu"
            >
              {isArabic ? "أدوات مركز التقنية" : "Technology Center Tools"}
              <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
            </button>

            {isToolsOpen && (
              <div
                role="menu"
                className={`absolute top-[calc(100%+8px)] w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${
                  isArabic ? "right-0" : "left-0"
                }`}
              >
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <a
                      key={tool.href}
                      href={tool.href}
                      role="menuitem"
                      onClick={() => setIsToolsOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{isArabic ? tool.ar : tool.en}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center gap-2 rounded-md bg-white/12 px-4 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:inline-flex"
          >
            {isArabic ? "طلباتي في Jira" : "My Jira Requests"}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        >
          <Globe2 className="h-5 w-5" />
          <span className="hidden sm:inline">{isArabic ? "English" : "العربية"}</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
