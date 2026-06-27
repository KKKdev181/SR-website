import { ExternalLink, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-950/[0.04]">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src="/elmlogo.png" alt="Elm Logo" className="h-9 w-9 object-contain" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="text-lg font-semibold leading-tight text-slate-950">
                    Technology Center Portal
                  </h1>
                  <span className="text-slate-300">|</span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className="text-lg font-semibold leading-tight text-slate-800"
                    style={arabicFont}
                  >
                    مركز التقنية
                  </span>
                </div>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Find the right technology request, prepare the needed details, then open it in Jira.
                  <span className="mx-2 text-slate-300">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    ابحث عن الطلب المناسب وجهز المتطلبات قبل رفعه في Jira
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
              <a
                href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  My Jira Requests
                  <span className="text-primary-foreground/45">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    طلباتي
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>

              <div className="group relative">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                  aria-label="About Technology Center Portal"
                >
                  <Info className="h-3.5 w-3.5" />
                  About
                  <span className="text-slate-300">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    عن الموقع
                  </span>
                </button>

                <div className="pointer-events-none absolute right-0 top-12 z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-4 text-left opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-slate-950">About Technology Center Portal</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    A single place for project and product teams to find technology services and
                    open the correct Jira request with less back-and-forth.
                  </p>
                  <div dir="rtl" lang="ar" className="mt-3 text-right" style={arabicFont}>
                    <p className="text-sm font-semibold text-slate-950">عن مركز التقنية</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      مكان واحد يساعد فرق المشاريع والمنتجات على اختيار الخدمة التقنية المناسبة وفتح
                      طلب Jira الصحيح بسرعة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-gradient-to-r from-primary via-primary to-[#197a8d] px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="min-w-0 lg:w-72">
                <p className="text-sm font-semibold text-white">Search service catalog</p>
                <p dir="rtl" lang="ar" className="mt-0.5 text-xs text-white/72" style={arabicFont}>
                  ابحث في كتالوج الخدمات
                </p>
              </div>

              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                <Input
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search request name, keyword, environment... | ابحث باسم الطلب أو البيئة أو الكلمة المفتاحية..."
                  className="h-12 rounded-xl border-white bg-white pl-11 pr-4 text-sm shadow-lg shadow-slate-950/10 placeholder:text-slate-400 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
