import { useMemo, useState } from "react";
import { categoryFilters, sections } from "@/data/requests";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const filterArabicLabels: Record<string, string> = {
  "Dev/QA": "تطوير/اختبار",
  "Staging/Production": "تجهيز/إنتاج",
  DR: "تعافي",
  "DNS / Domain": "النطاقات",
  "SSL / Certificate": "الشهادات",
};

const featuredFilters = ["Dev/QA", "Staging/Production", "DR", "DNS / Domain", "SSL / Certificate"];

interface QuickFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
}

const FilterChip = ({
  filter,
  isActive,
  onToggle,
}: {
  filter: string;
  isActive: boolean;
  onToggle: (filter: string) => void;
}) => {
  const arLabel = filterArabicLabels[filter];

  return (
    <button
      type="button"
      className={`inline-flex min-h-9 max-w-full items-center gap-1 rounded-full border px-3.5 py-1 text-xs font-medium transition-all duration-150 ${
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      }`}
      onClick={() => onToggle(filter)}
      aria-pressed={isActive}
    >
      <span className="truncate">{filter}</span>
      {arLabel && (
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
  const activeFilter = activeFilters[0];
  const hasActiveFilter = Boolean(activeFilter);

  const advancedGroups = useMemo(() => {
    const hiddenCategories = categoryFilters.filter((filter) => !featuredFilters.includes(filter));

    return [
      { title: "Sections", filters: [...sections] },
      { title: "Other categories", filters: hiddenCategories },
    ];
  }, []);

  const renderChip = (filter: string) => (
    <FilterChip
      key={filter}
      filter={filter}
      isActive={activeFilter === filter}
      onToggle={onToggleFilter}
    />
  );

  return (
    <div className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="flex min-w-fit items-center gap-2 text-xs">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Filters</p>
              <p dir="rtl" lang="ar" className="text-muted-foreground" style={arabicFont}>
                الفلاتر
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {featuredFilters.map(renderChip)}

            {hasActiveFilter && !featuredFilters.includes(activeFilter) && (
              <button
                type="button"
                onClick={() => onToggleFilter(activeFilter)}
                className="inline-flex min-h-9 max-w-full items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15"
              >
                <span className="truncate">{activeFilter}</span>
                <X className="h-3 w-3 shrink-0" />
              </button>
            )}
          </div>

          <div className="relative flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setShowMore((value) => !value)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              aria-expanded={showMore}
            >
              More filters
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showMore ? "rotate-180" : ""}`}
              />
            </button>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => onToggleFilter(activeFilter)}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {showMore && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[0.7fr_1.3fr]">
              {advancedGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-xs font-semibold text-foreground">{group.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.filters.map(renderChip)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickFilters;
