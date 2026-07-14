import { ChevronDown, ExternalLink, Globe2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { language, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-700 bg-[#0757b8] text-white shadow-sm">
      <nav
        aria-label={isArabic ? "التنقل الرئيسي" : "Primary navigation"}
        className="mx-auto flex min-h-[64px] max-w-[1920px] items-center justify-between gap-3 px-4 sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <a href="/" className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <img src="/elmlogo.png" alt="Elm" className="h-9 w-auto brightness-0 invert" />
            <span className="hidden h-8 w-px bg-white/25 sm:block" />
            <span className="hidden text-xl font-semibold sm:block">Jira</span>
          </a>

          <button
            type="button"
            className="hidden min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white/95 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:inline-flex"
          >
            {isArabic ? "دليل رحلة المشروع" : "Project Journey Guide"}
            <ChevronDown className="h-4 w-4" />
          </button>

          <a
            href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center gap-2 rounded-md bg-white/12 px-4 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex"
          >
            {isArabic ? "طلباتي في Jira" : "My Jira Requests"}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
