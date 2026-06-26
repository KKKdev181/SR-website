import { useMemo, useState } from "react";
import { categoryFilters, quickFilters, requests, sections } from "@/data/requests";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const filterArabicLabels: Record<string, string> = {
  "Dev/QA": "تطوير/اختبار",
  "Staging/Production": "تجهيز/إنتاج",
  DR: "تعافي",
  "Access & Accounts": "الوصول والحسابات",
  "Service Setup & Environments": "إعداد الخدمات والبيئات",
  "Infrastructure, Cloud & Platform": "البنية والمنصات",
  "Network, Security & Compliance": "الشبكات والأمن",
  "Data, Storage & Backup": "البيانات والتخزين",
  "DevOps, Release & Lifecycle": "الإصدارات ودورة الحياة",
  "Monitoring, Jira & Support": "المراقبة والدعم",
  "Business, BI, Mobile & UX": "الأعمال والتجربة",
  "DNS / Domain": "النطاقات",
  "SSL / Certificate": "الشهادات",
  "Scale / Capacity": "السعة",
  "Release / Lifecycle": "الإصدار",
  "Missing Jira URL": "بدون رابط Jira",
};

const environmentFilters = ["Dev/QA", "Staging/Production", "DR"];
const priorityCategoryFilters = [
  "DNS / Domain",
  "SSL / Certificate",
  "Scale / Capacity",
  "Release / Lifecycle",
];

interface QuickFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
}

const FilterChip = ({
  filter,
  isActive,
  onToggle,
  compact = false,
}: {
  filter: string;
  isActive: boolean;
  onToggle: (filter: string) => void;
  compact?: boolean;
}) => {
  const arLabel = filterArabicLabels[filter];

  return (
    <button
      type="button"
      className={`inline-flex min-h-8 max-w-full items-center gap-1 rounded-full border text-xs font-medium transition-all duration-150 ${
        compact ? "px-2.5 py-1" : "px-3 py-1.5"
      } ${
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/40 hover:text-foreground"
      }`}
      onClick={() => onToggle(filter)}
      aria-pressed={isActive}
    >
      <span className="truncate">{filter}</span>
      {arLabel && !compact && (
        <>
          <span className={isActive ? "text-primary-foreground/50" : "text-muted-foreground/40"}>
            |
          </span>
          <span dir="rtl" lang="ar" className="truncate opacity-85" style={arabicFont}>
            {arLabel}
          </span>
        </>
      )}
    </button>
  );
};

const QuickFilters = ({ activeFilters, onToggleFilter }: QuickFiltersProps) => {
  const [showMore, setShowMore] = useState(false);
  const hasActiveFilters = activeFilters.length > 0;

  const statusFilters = requests.some(
    (request) => !request.jiraUrl?.trim() || request.jiraUrl.includes("jira.example.com")
  )
    ? ["Missing Jira URL"]
    : [];

  const sectionFilterSet = new Set<string>(sections);
  const visibleSectionFilters = quickFilters.filter((filter) => sectionFilterSet.has(filter));
  const visibleCategoryFilters = quickFilters.filter((filter) =>
    priorityCategoryFilters.includes(filter)
  );
  const advancedFilters = useMemo(
    () =>
      [...categoryFilters, ...statusFilters].filter(
        (filter) => !visibleCategoryFilters.includes(filter)
      ),
    [statusFilters, visibleCategoryFilters]
  );

  const clearAllFilters = () => {
    activeFilters.forEach((filter) => onToggleFilter(filter));
  };

  const renderChip = (filter: string, compact = false) => (
    <FilterChip
      key={filter}
      filter={filter}
      compact={compact}
      isActive={activeFilters.includes(filter)}
      onToggle={onToggleFilter}
    />
  );

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(10rem,12rem)_1fr_auto] lg:items-start">
          <div className="flex min-w-fit items-center gap-2 text-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Filters</p>
              <p dir="rtl" lang="ar" className="text-muted-foreground" style={arabicFont}>
                الفلاتر
              </p>
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {environmentFilters.map((filter) => renderChip(filter))}
              <span className="hidden h-6 w-px bg-border sm:inline-block" />
              {visibleCategoryFilters.map((filter) => renderChip(filter))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {visibleSectionFilters.map((filter) => renderChip(filter, true))}
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-2">
                <span className="text-xs font-medium text-muted-foreground">Active</span>
                {activeFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => onToggleFilter(filter)}
                    className="inline-flex min-h-7 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
                  >
                    <span>{filter}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            {showMore && (
              <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-foreground">All categories</p>
                  <p dir="rtl" lang="ar" className="text-xs text-muted-foreground" style={arabicFont}>
                    جميع التصنيفات
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {advancedFilters.map((filter) => renderChip(filter, true))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setShowMore((value) => !value)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
              aria-expanded={showMore}
            >
              More filters
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showMore ? "rotate-180" : ""}`}
              />
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-150 hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" />
                Clear {activeFilters.length}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
