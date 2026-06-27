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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xl">
      <div className="bg-[linear-gradient(135deg,#0b3f75_0%,#155f9f_52%,#0f7f87_100%)] shadow-xl shadow-primary/15">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white shadow-lg shadow-slate-950/20">
                <img src="/elmlogo.png" alt="Elm Logo" className="h-11 w-11 object-contain" />
              </div>

              <div className="min-w-0 pt-1">
                <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase text-white/85">
                  Technology services catalog
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="text-2xl font-semibold leading-tight text-white">
                    Technology Center Portal
                  </h1>
                  <span className="text-white/35">|</span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className="text-2xl font-semibold leading-tight text-white/95"
                    style={arabicFont}
                  >
                    مركز التقنية
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/78">
                  Find the right request, prepare the needed details, and open the correct Jira
                  form with less back-and-forth.
                  <span className="mx-2 text-white/35">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    ابحث عن الطلب المناسب وجهز المتطلبات ثم افتح طلب Jira الصحيح
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
                  className="h-11 rounded-full bg-white px-4 text-sm font-semibold text-primary shadow-lg shadow-slate-950/15 hover:bg-white/95"
                >
                  My Jira Requests
                  <span className="text-primary/35">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    طلباتي
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>

              <div className="group relative">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="About Technology Center Portal"
                >
                  <Info className="h-3.5 w-3.5" />
                  About
                  <span className="text-white/40">|</span>
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
                      مكان واحد يساعد فرق المشاريع والمنتجات على اختيار الخدمة التقنية المناسبة
                      وفتح طلب Jira الصحيح بسرعة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/18 bg-white/12 p-3 shadow-inner shadow-white/5 backdrop-blur">
            <div className="grid gap-3 lg:grid-cols-[16rem_1fr] lg:items-center">
              <div className="px-1">
                <p className="text-sm font-semibold text-white">Search service catalog</p>
                <p dir="rtl" lang="ar" className="mt-0.5 text-xs text-white/70" style={arabicFont}>
                  ابحث في كتالوج الخدمات
                </p>
              </div>

              <div className="relative min-w-0">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                <Input
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search request name, keyword, environment... | ابحث باسم الطلب أو البيئة أو الكلمة المفتاحية..."
                  className="h-12 rounded-xl border-white bg-white pl-11 pr-4 text-sm shadow-lg shadow-slate-950/15 placeholder:text-slate-400 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/70"
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
