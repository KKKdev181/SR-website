import { ExternalLink, Globe2, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const copy = {
  en: {
    portal: "Technology Center Portal",
    strapline: "All technology services in one place",
    tools: "Tools",
    requests: "My Jira Requests",
    eyebrow: "Service request directory",
    title: "Your guide to the right technology request",
    subtitle:
      "Search for a service, review its requirements, and open the correct Jira request without unnecessary back-and-forth.",
    searchLabel: "Search the service catalog",
    placeholder: "Search by request, keyword, category, or environment...",
    language: "العربية",
  },
  ar: {
    portal: "بوابة مركز التقنية",
    strapline: "جميع الخدمات التقنية في مكان واحد",
    tools: "الأدوات",
    requests: "طلباتي في Jira",
    eyebrow: "دليل الطلبات التقنية",
    title: "دليلك لاختيار الطلب التقني المناسب",
    subtitle:
      "ابحث عن الخدمة، راجع متطلباتها، وانتقل مباشرة إلى طلب Jira الصحيح بدون خطوات غير ضرورية.",
    searchLabel: "البحث في دليل الخدمات",
    placeholder: "ابحث باسم الطلب أو الكلمة المفتاحية أو التصنيف أو البيئة...",
    language: "English",
  },
} as const;

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const { language, toggleLanguage } = useLanguage();
  const text = copy[language];
  const isArabic = language === "ar";

  return (
    <header className="border-b border-slate-200 bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav
          aria-label={isArabic ? "التنقل الرئيسي" : "Primary navigation"}
          className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:px-5"
        >
          <a href="/" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <img src="/elmlogo.png" alt="Elm" className="h-8 w-8 object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {text.portal}
              </span>
              <span className="block truncate text-xs font-semibold text-slate-950">{text.strapline}</span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:inline-flex"
            >
              {text.requests}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe2 className="h-4 w-4" />
              {text.language}
            </button>
          </div>
        </nav>

        <section className="mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.07)]">
          <div className="grid items-center gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-11">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                {text.eyebrow}
              </div>
              <h1 className="max-w-3xl text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
                {text.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{text.subtitle}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <label htmlFor="service-search" className="mb-2 block text-xs font-semibold text-slate-700">
                {text.searchLabel}
              </label>
              <div className="relative">
                <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} />
                <Input
                  id="service-search"
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder={text.placeholder}
                  className={`h-14 rounded-xl border-slate-200 bg-white text-sm text-slate-950 shadow-sm placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"}`}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                {["Infra & Network", "Application", "Security"].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};

export default Header;
