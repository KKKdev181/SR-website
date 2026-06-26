import { quickFilters, requests } from "@/data/requests";
import { SlidersHorizontal, X } from "lucide-react";

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const filterArabicLabels: Record<string, string> = {
  "Dev/QA": "تطوير/اختبار",
  "Staging/Production": "تجهيز/إنتاج",
  DR: "تعافي من الكوارث",
  "New request": "طلب جديد",
  Modify: "تعديل",
  Publish: "نشر",
  Retire: "إيقاف",
  Security: "أمن",
  Servers: "خوادم",
  "Scale Up": "زيادة الموارد",
  "Scale Down": "تقليل الموارد",
  "User Access": "وصول المستخدمين",
  "Missing Jira URL": "بدون رابط Jira",
  Platform: "منصات",
  Networking: "شبكات",
  Storage: "تخزين",
  Compliance: "امتثال",
  Access: "وصول",
  Configuration: "إعدادات",
  Architecture: "تصميم",
  Accounts: "حسابات",
  Publishing: "نشر",
  Lifecycle: "دورة الحياة",
  Setup: "تهيئة",
  DevOps: "DevOps",
};

interface QuickFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
}

const QuickFilters = ({ activeFilters, onToggleFilter }: QuickFiltersProps) => {
  const hasActiveFilters = activeFilters.length > 0;
  const categoryFilters = Array.from(new Set(requests.map((request) => request.category))).filter(
    (category) => !quickFilters.includes(category as typeof quickFilters[number])
  );
  const statusFilters = requests.some(
    (request) => !request.jiraUrl?.trim() || request.jiraUrl.includes("jira.example.com")
  )
    ? ["Missing Jira URL"]
    : [];
  const availableFilters = [...quickFilters, ...categoryFilters, ...statusFilters];

  const clearAllFilters = () => {
    activeFilters.forEach((filter) => onToggleFilter(filter));
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-fit items-center gap-2 text-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Quick filters</p>
              <p dir="rtl" lang="ar" className="text-muted-foreground" style={arabicFont}>
                فلاتر سريعة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {availableFilters.map((filter) => {
              const isActive = activeFilters.includes(filter);
              const arLabel = filterArabicLabels[filter];

              return (
                <button
                  key={filter}
                  type="button"
                  className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/40 hover:text-foreground"
                  }`}
                  onClick={() => onToggleFilter(filter)}
                  aria-pressed={isActive}
                >
                  <span>{filter}</span>
                  {arLabel && (
                    <>
                      <span
                        className={
                          isActive ? "text-primary-foreground/50" : "text-muted-foreground/40"
                        }
                      >
                        |
                      </span>
                      <span dir="rtl" lang="ar" className="opacity-85" style={arabicFont}>
                        {arLabel}
                      </span>
                    </>
                  )}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex min-h-8 items-center gap-1 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-150 hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" />
                Clear {activeFilters.length}
                <span className="text-destructive/40">|</span>
                <span dir="rtl" lang="ar" style={arabicFont}>
                  مسح
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
