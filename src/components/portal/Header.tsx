import { ChevronDown, ExternalLink, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requests, sections } from "@/data/requests";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const heroStats = [
  {
    value: `${requests.length}+`,
    label: "Technology requests",
    labelAr: "\u0637\u0644\u0628 \u062a\u0642\u0646\u064a",
  },
  {
    value: `${sections.length}`,
    label: "Service sections",
    labelAr: "\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u062e\u062f\u0645\u0627\u062a",
  },
  {
    value: "Jira",
    label: "Direct submission",
    labelAr: "\u0631\u0641\u0639 \u0645\u0628\u0627\u0634\u0631",
  },
];

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="relative z-50 bg-[#10051d] text-white shadow-2xl shadow-[#160821]/25">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_76%_12%,rgba(128,75,218,0.55),transparent_25rem),radial-gradient(circle_at_18%_88%,rgba(0,140,164,0.48),transparent_34rem),linear-gradient(135deg,#10031f_0%,#1b0734_45%,#093753_100%)]">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute left-1/2 top-24 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-sm" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center justify-end gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/15 bg-white/10 shadow-xl shadow-black/20 backdrop-blur">
                <img
                  src="/elmlogo.png"
                  alt="Elm Logo"
                  className="h-11 w-11 object-contain brightness-0 invert"
                />
              </div>

              <div className="min-w-0 text-right">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                    Technology Center Portal
                  </h1>
                  <span className="text-white/35">|</span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className="text-xl font-bold leading-tight text-white/95 sm:text-2xl"
                    style={arabicFont}
                  >
                    &#1605;&#1585;&#1603;&#1586; &#1575;&#1604;&#1578;&#1602;&#1606;&#1610;&#1577;
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-cyan-100/75">
                  Enterprise technology services
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
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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

          <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-y border-white/10 py-3 text-sm font-semibold text-white/85 lg:justify-end">
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

          <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:py-14">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-cyan-200/25 bg-cyan-100/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                Unified service catalog
              </p>
              <h2 className="max-w-4xl text-5xl font-bold leading-[1.08] text-white sm:text-6xl">
                Find the right technology request
                <span
                  className="mt-2 block text-white/92"
                  dir="rtl"
                  lang="ar"
                  style={arabicFont}
                >
                  &#1575;&#1601;&#1578;&#1581; &#1575;&#1604;&#1591;&#1604;&#1576; &#1575;&#1604;&#1578;&#1602;&#1606;&#1610; &#1575;&#1604;&#1605;&#1606;&#1575;&#1587;&#1576;
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
                Search, filter, prepare, and open the correct Jira request from one polished
                enterprise workspace.
                <span className="mx-2 text-white/35">|</span>
                <span dir="rtl" lang="ar" style={arabicFont}>
                  &#1575;&#1576;&#1581;&#1579; &#1608;&#1589;&#1606;&#1601; &#1608;&#1575;&#1585;&#1601;&#1593; &#1575;&#1604;&#1591;&#1604;&#1576; &#1575;&#1604;&#1589;&#1581;&#1610;&#1581; &#1576;&#1587;&#1607;&#1608;&#1604;&#1577;.
                </span>
              </p>

              <div className="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-white/20 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="px-4 text-center first:pl-0 last:pr-0">
                    <p className="text-3xl font-bold leading-none text-white">{stat.value}</p>
                    <p className="mt-2 text-xs font-medium text-white/70">{stat.label}</p>
                    <p
                      dir="rtl"
                      lang="ar"
                      className="mt-1 text-[11px] text-cyan-100/70"
                      style={arabicFont}
                    >
                      {stat.labelAr}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl">
                <div className="rounded-[1.25rem] border border-white/15 bg-[#080d26]/75 p-4">
                  <div className="mb-4 flex items-center justify-between text-xs font-semibold text-white/70">
                    <span>Service intelligence</span>
                    <span className="rounded-full bg-emerald-300/15 px-2.5 py-1 text-emerald-100">
                      Live catalog
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-24 rounded-2xl border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(0,180,210,0.3),rgba(104,72,220,0.28))] p-3">
                      <div className="h-2 w-24 rounded-full bg-white/70" />
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="h-11 rounded-xl bg-white/20" />
                        <div className="h-11 rounded-xl bg-white/12" />
                        <div className="h-11 rounded-xl bg-white/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <div className="h-2 w-16 rounded-full bg-cyan-200/70" />
                        <div className="mt-3 h-8 rounded-xl bg-white/12" />
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <div className="h-2 w-12 rounded-full bg-violet-200/70" />
                        <div className="mt-3 h-8 rounded-xl bg-white/12" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.35rem] border border-white/20 bg-white/15 p-3">
                  <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-white/80">
                    <span>Search service catalog</span>
                    <span dir="rtl" lang="ar" style={arabicFont}>
                      &#1575;&#1576;&#1581;&#1579; &#1601;&#1610; &#1575;&#1604;&#1582;&#1583;&#1605;&#1575;&#1578;
                    </span>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
