import { ClipboardCheck, ExternalLink, Globe2, Headset, Inbox, ListChecks, Mail, Route, Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHeaderSettings, type HeaderKey } from "@/lib/developmentHeader";

const Header = () => {
  const { language, toggleLanguage, copy } = useLanguage();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);
  const isArabic = language === "ar";
  const headerSettings = useHeaderSettings();
  const label = (key: HeaderKey) => headerSettings[key][isArabic ? "ar" : "en"];
  const visible = (key: HeaderKey) => headerSettings[key].visible;


  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (supportRef.current && !supportRef.current.contains(event.target as Node)) {
        setIsSupportOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSupportOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-700 bg-[#0757b8] text-white shadow-sm">
      <nav
        aria-label={copy.navigation.primary}
        className="mx-auto flex min-h-[72px] max-w-[1920px] items-center justify-between gap-3 px-3 sm:px-6"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:gap-4">
          {visible("portal") && (
          <Link
            to="/"
            className="flex shrink-0 items-center gap-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Elm Requests Portal"
          >
            <img
              src="/elm%20logo.png"
              alt="Elm"
              className="h-10 w-auto shrink-0 object-contain brightness-0 invert sm:h-11"
            />
            <span className="hidden h-10 w-px bg-white/30 sm:block" />
            <span className="hidden whitespace-nowrap text-lg font-semibold sm:block">
              {label("portal")}
            </span>
          </Link>
          )}

          <div
            className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={isArabic ? "أدوات مركز التقنية" : "Technology Center tools"}
          >
            {visible("guide") && (
          <Link
              to="/tools/project-journey-checklist"
              className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#ffd86b] bg-[#fff4c2] px-3.5 text-sm font-bold text-[#5b4300] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffed9c] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0757b8] text-white shadow-sm transition group-hover:bg-[#06499b]">
                <ListChecks className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap">{label("guide")}</span>
            </Link>
          )}

            {visible("finder") && (
          <Link
              to="/?tool=request-finder"
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Route className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">{label("finder")}</span>
            </Link>
          )}
          </div>

          {visible("jira") && (
          <a
            href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 shrink-0 items-center gap-2 rounded-md border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:inline-flex"
          >
            <Inbox className="h-4 w-4" aria-hidden="true" />
            <span className="whitespace-nowrap">{label("jira")}</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          )}

          {visible("approvals") && (
          <a
            href="https://jira.elm.sa/projects/SR/queues/custom/471"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 shrink-0 items-center gap-2 rounded-md border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:inline-flex"
          >
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            <span className="whitespace-nowrap">{label("approvals")}</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          )}

          {visible("admin") && (
          <a
            href="/admin"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-amber-300 bg-amber-100 px-3 text-sm font-bold text-amber-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            title="Development admin — temporary test link"
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            <span>{label("admin")}</span>
            <span className="hidden rounded bg-amber-200 px-1.5 py-0.5 text-[10px] uppercase sm:inline">Test</span>
          </a>
          )}

          {visible("support") && (
          <div ref={supportRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSupportOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={label("support")}
              aria-expanded={isSupportOpen}
              aria-haspopup="menu"
            >
              <Headset className="h-[22px] w-[22px] stroke-[1.9]" aria-hidden="true" />
            </button>

            {isSupportOpen && (
              <div
                role="menu"
                className={`absolute top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.22)] ${
                  isArabic ? "left-0 text-right" : "right-0 text-left"
                }`}
              >
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5 text-sm font-semibold text-slate-700">
                  <Mail className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <span>{label("support")}</span>
                </div>
                <a
                  href="mailto:TD@ELM.SA"
                  role="menuitem"
                  onClick={() => setIsSupportOpen(false)}
                  className="block px-4 py-4 text-center text-sm font-semibold text-[#0757b8] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                >
                  {copy.navigation.supportEmail}
                </a>
              </div>
            )}
          </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={copy.navigation.switchLanguage}
        >
          <Globe2 className="h-5 w-5" />
          <span className="hidden sm:inline">{copy.navigation.languageName}</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
