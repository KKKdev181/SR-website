import { ChevronDown, ExternalLink, Info, Search } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-[#10051d] text-white shadow-2xl shadow-[#160821]/25">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_76%_12%,rgba(102,65,190,0.5),transparent_24rem),radial-gradient(circle_at_20%_90%,rgba(0,126,155,0.42),transparent_30rem),linear-gradient(135deg,#12051f_0%,#1b0b31_48%,#0e3956_100%)]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl shadow-black/20 backdrop-blur">
                <img
                  src="/elmlogo.png"
                  alt="Elm Logo"
                  className="h-11 w-11 object-contain brightness-0 invert"
                />
              </div>

              <div className="min-w-0 pt-1">
                <div className="mb-2 inline-flex rounded-full border border-cyan-200/25 bg-cyan-100/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100">
                  Enterprise technology services
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="text-3xl font-bold leading-tight text-white">
                    Technology Center Portal
                  </h1>
                  <span className="text-white/35">|</span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className="text-3xl font-bold leading-tight text-white/95"
                    style={arabicFont}
                  >
                    &#1605;&#1585;&#1603;&#1586; &#1575;&#1604;&#1578;&#1602;&#1606;&#1610;&#1577;
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/78">
                  Search the service catalog, prepare the needed details, and open the correct Jira
                  form with a clearer enterprise workflow.
                  <span className="mx-2 text-white/35">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    &#1575;&#1576;&#1581;&#1579; &#1601;&#1610; &#1603;&#1578;&#1575;&#1604;&#1608;&#1580; &#1575;&#1604;&#1582;&#1583;&#1605;&#1575;&#1578; &#1608;&#1580;&#1607;&#1586; &#1575;&#1604;&#1605;&#1578;&#1591;&#1604;&#1576;&#1575;&#1578; &#1602;&#1576;&#1604; &#1585;&#1601;&#1593; &#1575;&#1604;&#1591;&#1604;&#1576; &#1601;&#1610; Jira.
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
                  className="h-11 rounded-full bg-white px-4 text-sm font-semibold text-[#175a96] shadow-xl shadow-black/20 hover:bg-white/95"
                >
                  My Jira Requests
                  <span className="text-slate-300">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    &#1591;&#1604;&#1576;&#1575;&#1578;&#1610;
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>

              <div className="group relative">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-3.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="About Technology Center Portal"
                >
                  <Info className="h-3.5 w-3.5" />
                  About
                  <span className="text-white/40">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    &#1593;&#1606; &#1575;&#1604;&#1605;&#1608;&#1602;&#1593;
                  </span>
                </button>

                <div className="pointer-events-none absolute right-0 top-12 z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 text-left opacity-0 shadow-2xl transition-opacity duration-150 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-slate-950">About Technology Center Portal</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    A single place for project and product teams to find technology services and
                    open the correct Jira request with less back-and-forth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm font-semibold text-white/86">
            <span className="inline-flex items-center gap-1">
              Request catalog
              <ChevronDown className="h-3.5 w-3.5 text-white/55" />
            </span>
            <span className="inline-flex items-center gap-1">
              Project guide
              <ChevronDown className="h-3.5 w-3.5 text-white/55" />
            </span>
            <span>Jira services</span>
            <span dir="rtl" lang="ar" style={arabicFont}>
              &#1571;&#1593;&#1605;&#1575;&#1604;&#1606;&#1575;
            </span>
          </nav>

          <div className="mt-5 rounded-[1.65rem] border border-white/18 bg-white/12 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="grid gap-3 lg:grid-cols-[16rem_1fr] lg:items-center">
              <div className="px-1">
                <p className="text-sm font-semibold text-white">Search service catalog</p>
                <p dir="rtl" lang="ar" className="mt-0.5 text-xs text-white/72" style={arabicFont}>
                  &#1575;&#1576;&#1581;&#1579; &#1601;&#1610; &#1575;&#1604;&#1582;&#1583;&#1605;&#1575;&#1578;
                </p>
              </div>

              <div className="relative min-w-0">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f46d9]" />
                <Input
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search request, keyword, environment..."
                  className="h-14 rounded-2xl border-white bg-white pl-11 pr-4 text-sm text-slate-950 shadow-xl shadow-black/20 placeholder:text-slate-400 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-cyan-200"
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
