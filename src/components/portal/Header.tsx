import { ExternalLink, Info, Search, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/82 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1.35rem] border border-white/70 bg-[linear-gradient(135deg,#0f4f8d_0%,#1668a8_48%,#168c98_100%)] shadow-xl shadow-primary/15">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/12" />
          <div className="pointer-events-none absolute bottom-0 right-24 h-24 w-72 rounded-t-full bg-emerald-300/10 blur-2xl" />
          <div className="relative px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-16 w-32 shrink-0 items-center gap-2 rounded-2xl bg-white px-3 shadow-lg shadow-slate-950/10 ring-1 ring-white/70">
                  <img src="/elmlogo.png" alt="Elm Logo" className="h-10 w-10 object-contain" />
                  <div className="leading-none">
                    <p className="text-lg font-bold tracking-tight text-slate-950">elm</p>
                    <p className="text-[10px] font-semibold uppercase text-slate-500">Technology</p>
                  </div>
                </div>

                <div className="min-w-0 pt-1">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-[11px] font-medium text-white/90">
                    <Sparkles className="h-3 w-3" />
                    Service request hub
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
                      Technology Center Portal
                    </h1>
                    <span className="text-white/35">|</span>
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-xl font-semibold leading-tight text-white/92 sm:text-2xl"
                      style={arabicFont}
                    >
                      مركز التقنية
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/78">
                    Find the right technology request, prepare the needed details, then open it in Jira.
                    <span className="mx-2 text-white/35">|</span>
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
                    className="h-11 rounded-full border border-white/20 bg-white px-4 text-sm font-semibold text-primary shadow-lg shadow-slate-950/10 hover:bg-white/95"
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
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 text-xs font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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

            <div className="mt-6 rounded-2xl border border-white/25 bg-white/14 p-2 shadow-inner shadow-white/5 backdrop-blur">
              <div className="relative mx-auto w-full max-w-4xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                <Input
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search by request, keyword, environment... | ابحث باسم الطلب أو البيئة أو الكلمة المفتاحية..."
                  className="h-[3.25rem] rounded-xl border-white bg-white pl-11 pr-4 text-sm shadow-lg shadow-slate-950/10 transition-shadow placeholder:text-slate-400 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/60"
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
