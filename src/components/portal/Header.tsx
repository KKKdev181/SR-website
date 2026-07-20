import { ExternalLink, Globe2, ListChecks, Route } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { language, toggleLanguage, copy } = useLanguage();
  const isArabic = language === "ar";

  const requestToolLabel = isArabic ? "موجّه الطلبات" : "Request Finder";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-700 bg-[#0757b8] text-white shadow-sm">
      <nav
        aria-label={copy.navigation.primary}
        className="mx-auto flex min-h-[64px] max-w-[1920px] items-center justify-between gap-3 px-3 sm:px-6"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:gap-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <img src="/elmlogo.png" alt="Elm" className="h-9 w-auto brightness-0 invert" />
            <span className="hidden h-8 w-px bg-white/25 sm:block" />
            <span className="hidden whitespace-nowrap text-lg font-semibold sm:block">
              {copy.navigation.technologyCenter}
            </span>
          </Link>

          <div
            className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={isArabic ? "أدوات مركز التقنية" : "Technology Center tools"}
          >
            <Link
              to="/tools/project-journey-checklist"
              className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#ffd86b] bg-[#fff4c2] px-3.5 text-sm font-bold text-[#5b4300] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffed9c] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0757b8] text-white shadow-sm transition group-hover:bg-[#06499b]">
                <ListChecks className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap">
                {copy.navigation.projectJourneyChecklist}
              </span>
            </Link>

            <Link
              to="/?tool=request-finder"
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3.5 text-sm font-semibold text-white transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Route className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">{requestToolLabel}</span>
            </Link>
          </div>

          <a
            href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 shrink-0 items-center gap-2 rounded-md bg-white/12 px-4 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:inline-flex"
          >
            {copy.navigation.myJiraRequests}
            <ExternalLink className="h-4 w-4" />
          </a>
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
