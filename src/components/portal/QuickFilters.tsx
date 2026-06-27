import { useMemo, useState } from "react";
import { categoryFilters, sections } from "@/data/requests";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const filterArabicLabels: Record<string, string> = {
  "Dev/QA": "\u062a\u0637\u0648\u064a\u0631/\u0627\u062e\u062a\u0628\u0627\u0631",
  "Staging/Production": "\u062a\u062c\u0647\u064a\u0632/\u0625\u0646\u062a\u0627\u062c",
  DR: "\u062a\u0639\u0627\u0641\u064a",
  "DNS / Domain": "\u0627\u0644\u0646\u0637\u0627\u0642\u0627\u062a",
  "SSL / Certificate": "\u0627\u0644\u0634\u0647\u0627\u062f\u0627\u062a",
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
          ? "border-cyan-200 bg-white text-primary shadow-sm"
          : "border-white/15 bg-white/10 text-slate-100 shadow-sm hover:border-cyan-200/40 hover:bg-white/15 hover:text-white"
      }`}
      onClick={() => onToggle(filter)}
      aria-pressed={isActive}
    >
      <span className="truncate">{filter}</span>
      {arLabel && (
        <>
          <span className={isActive ? "text-primary/35" : "text-white/30"}>|</span>
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
    <div className="border-b border-white/10 bg-[#0f1931]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl shadow-black/15 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-fit items-center gap-2 text-xs">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-white">Filters</p>
                <p dir="rtl" lang="ar" className="text-cyan-100/65" style={arabicFont}>
                  &#1575;&#1604;&#1601;&#1604;&#1575;&#1578;&#1585;
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {featuredFilters.map(renderChip)}

              {hasActiveFilter && !featuredFilters.includes(activeFilter) && (
                <button
                  type="button"
                  onClick={() => onToggleFilter(activeFilter)}
                  className="inline-flex min-h-9 max-w-full items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-100 hover:bg-white/15"
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
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:border-cyan-200/35 hover:bg-white/15"
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
                  className="inline-flex min-h-9 items-center gap-1 rounded-xl border border-red-200/20 bg-red-300/10 px-3 py-1.5 text-xs font-medium text-red-100 transition-colors hover:bg-red-300/15"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {showMore && (
            <div className="mt-3 rounded-xl border border-white/15 bg-[#0b1326]/70 p-3">
              <div className="grid gap-3 lg:grid-cols-[0.7fr_1.3fr]">
                {advancedGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 text-xs font-semibold text-white">{group.title}</p>
                    <div className="flex flex-wrap gap-2">{group.filters.map(renderChip)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
