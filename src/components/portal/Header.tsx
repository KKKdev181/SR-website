import { Search, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import elmLogo from "@/assets/elm-logo.png";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-card/95 shadow-sm backdrop-blur">
      <div className="bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <img src={elmLogo} alt="Elm Logo" className="h-10 w-auto brightness-0 invert" />
            <div className="hidden h-8 w-px bg-primary-foreground/20 sm:block" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-base font-semibold leading-tight tracking-tight text-primary-foreground sm:text-lg">
                  Technology Center Portal
                </h1>
                <span className="text-primary-foreground/40">|</span>
                <span
                  dir="rtl"
                  lang="ar"
                  className="text-base font-semibold leading-tight tracking-tight text-primary-foreground/90 sm:text-lg"
                  style={arabicFont}
                >
                  مركز التقنية
                </span>
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="text-xs text-primary-foreground/70">
                  The starting point for project and product technology requests
                </p>
                <span className="text-primary-foreground/30">|</span>
                <p
                  dir="rtl"
                  lang="ar"
                  className="text-xs text-primary-foreground/65"
                  style={arabicFont}
                >
                  نقطة البداية لطلبات المشاريع والمنتجات التقنية
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
            <div className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-2.5 backdrop-blur-sm">
              <div className="hidden text-right xl:block">
                <p className="text-xs font-medium text-primary-foreground">
                  Already submitted a request?
                </p>
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-0.5 text-[11px] text-primary-foreground/70"
                  style={arabicFont}
                >
                  راجع طلباتك السابقة في Jira
                </p>
              </div>

              <a
                href="https://jira.elm.sa/plugins/servlet/desk/user/requests?status=open&reporter=me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="h-10 rounded-full border border-primary-foreground/20 bg-primary-foreground px-4 text-sm text-primary shadow-sm shadow-primary/10 hover:bg-primary-foreground/95"
                >
                  My Jira Requests
                  <span className="mx-1.5 text-primary/40">|</span>
                  <span dir="rtl" lang="ar" style={arabicFont}>
                    طلباتي
                  </span>
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </a>
            </div>

            <div className="relative group">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-3 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary-foreground/25"
                aria-label="About Technology Center Portal"
              >
                <Info className="h-3.5 w-3.5" />
                <span>About</span>
                <span className="text-primary-foreground/40">|</span>
                <span dir="rtl" lang="ar" style={arabicFont}>
                  عن الموقع
                </span>
              </button>

              <div className="pointer-events-none absolute right-0 top-10 z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-4 text-left opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                <p className="text-sm font-semibold text-foreground">
                  About Technology Center Portal
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Technology Center Portal brings together technology sector services in one place.
                  It helps project and product managers find the right request, prepare the
                  required inputs, and submit through Jira with less back-and-forth.
                </p>

                <div dir="rtl" lang="ar" className="mt-3 text-right" style={arabicFont}>
                  <p className="text-sm font-semibold text-foreground">عن مركز التقنية</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    مركز التقنية يجمع خدمات قطاع التقنية في مكان واحد، ويساعد مديري المشاريع
                    والمنتجات على معرفة الطلب المناسب وتجهيز المتطلبات قبل رفعه في Jira.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search request name, keyword, environment... | ابحث باسم الطلب أو البيئة أو الكلمة المفتاحية..."
                className="h-12 rounded-lg border-border bg-background pl-11 text-sm shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
