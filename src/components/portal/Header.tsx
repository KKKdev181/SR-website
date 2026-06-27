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
    <header className="relative z-50 bg-[#10051d] text-white shadow-2xl shadow-[#160821]/25">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_76%_12%,rgba(128,75,218,0.55),transparent_25rem),radial-gradient(circle_at_18%_88%,rgba(0,140,164,0.48),transparent_34rem),linear-gradient(135deg,#10031f_0%,#1b0734_45%,#093753_100%)]">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute left-1/2 top-24 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-sm" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-6">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center justify-end gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                <img
                  src="/elmlogo.png"
                  alt="Elm Logo"
                  className="h-12 w-12 object-contain brightness-0 invert"
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
                  className="h-11 rounded-full border border-cyan-200/25 bg-white/12 px-4 text-sm font-semibold text-white shadow-xl shadow-black/20 backdrop-blur hover:bg-white/18"
                >
                  My Jira Requests
                  <span className="text-cyan-100/45">|</span>
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

                <div className="pointer-events-none absolute right-0 top-12 z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-cyan-200/25 bg-[#111a33] p-4 text-left opacity-0 shadow-2xl transition-opacity duration-150 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-white">About Technology Center Portal</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-200/75">
                    A single place for project and product teams to find technology services and
                    open the correct Jira request with less back-and-forth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-7 py-8 text-center lg:py-10">
            <div aria-hidden="true" className="premium-hero-motion premium-hero-motion-left hidden xl:block">
              <div className="motion-panel motion-panel-a">
                <span className="motion-kicker" />
                <span className="motion-line motion-line-wide" />
                <span className="motion-line" />
              </div>
              <div className="motion-panel motion-panel-b">
                <span className="motion-chip" />
                <span className="motion-chip motion-chip-soft" />
              </div>
              <svg className="motion-routes" viewBox="0 0 280 220" fill="none">
                <path className="motion-route motion-route-one" d="M16 116 C62 54 124 48 168 92 C210 134 238 112 264 68" />
                <path className="motion-route motion-route-two" d="M24 166 C72 122 120 134 150 158 C190 188 224 160 258 136" />
              </svg>
            </div>

            <div aria-hidden="true" className="premium-hero-motion premium-hero-motion-right hidden xl:block">
              <div className="motion-panel motion-panel-c">
                <span className="motion-kicker" />
                <span className="motion-line motion-line-wide" />
                <span className="motion-line" />
              </div>
              <div className="motion-panel motion-panel-d">
                <span className="motion-chip" />
                <span className="motion-chip motion-chip-soft" />
              </div>
              <svg className="motion-routes" viewBox="0 0 280 220" fill="none">
                <path className="motion-route motion-route-one" d="M18 82 C70 126 116 130 152 92 C194 48 226 52 264 90" />
                <path className="motion-route motion-route-two" d="M26 154 C70 186 118 170 152 144 C194 112 226 118 258 152" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="max-w-4xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
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
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80">
                Search, filter, prepare, and open the correct Jira request from one polished
                enterprise workspace.
                <span className="mx-2 text-white/35">|</span>
                <span dir="rtl" lang="ar" style={arabicFont}>
                  &#1575;&#1576;&#1581;&#1579; &#1608;&#1589;&#1606;&#1601; &#1608;&#1575;&#1585;&#1601;&#1593; &#1575;&#1604;&#1591;&#1604;&#1576; &#1575;&#1604;&#1589;&#1581;&#1610;&#1581; &#1576;&#1587;&#1607;&#1608;&#1604;&#1577;.
                </span>
              </p>
            </div>

            <div className="relative z-10 w-full max-w-3xl">
              <div className="absolute -inset-8 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="relative rounded-[1.75rem] border border-cyan-200/25 bg-[#15233e]/80 p-4 text-left shadow-2xl shadow-black/25 backdrop-blur-xl">
                <div className="rounded-[1.35rem] border border-cyan-200/20 bg-[#0f1931]/80 p-3">
                  <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-white/90">
                    <span>Search service catalog</span>
                    <span dir="rtl" lang="ar" style={arabicFont}>
                      &#1575;&#1576;&#1581;&#1579; &#1601;&#1610; &#1575;&#1604;&#1582;&#1583;&#1605;&#1575;&#1578;
                    </span>
                  </div>
                  <div className="relative min-w-0">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
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
