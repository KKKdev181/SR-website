import { useMemo, useState } from "react";
import { categoryFilters, sections } from "@/data/requests";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const featuredFilters = ["Dev/QA", "Staging/Production", "DR", "DNS / Domain", "SSL / Certificate"];

const arabicLabels: Record<string, string> = {
  "Dev/QA": "Dev/QA",
  "Staging/Production": "Staging/Production",
  DR: "DR",
  "DNS / Domain": "DNS / النطاقات",
  "SSL / Certificate": "SSL / الشهادات",
  "Access & Accounts": "الوصول والحسابات",
  "Service Setup & Environments": "إعداد الخدمات والبيئات",
  "Infrastructure, Cloud & Platform": "البنية التحتية والسحابة والمنصات",
  "Network, Security & Compliance": "الشبكات والأمن والامتثال",
  "Data, Storage & Backup": "البيانات وStorage والنسخ الاحتياطي",
  "DevOps, Release & Lifecycle": "DevOps والإصدارات ودورة الحياة",
  "Monitoring, Jira & Support": "المراقبة وJira والدعم",
  "Business, BI, Mobile & UX": "الأعمال وBI والجوال وUX",
};

interface QuickFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
}

const QuickFilters = ({ activeFilters, onToggleFilter }: QuickFiltersProps) => {
  const [showMore, setShowMore] = useState(false);
  const { language } = useLanguage();
  const activeFilter = activeFilters[0];
  const isArabic = language === "ar";

  const groups = useMemo(
    () => [
      { title: isArabic ? "التصنيفات الرئيسية" : "Main categories", filters: [...sections] },
      {
        title: isArabic ? "تصنيفات إضافية" : "Additional categories",
        filters: categoryFilters.filter((filter) => !featuredFilters.includes(filter)),
      },
    ],
    [isArabic],
  );

  const label = (filter: string) => (isArabic ? arabicLabels[filter] ?? filter : filter);

  const chip = (filter: string) => {
    const active = filter === activeFilter;
    return (
      <button
        key={filter}
        type="button"
        onClick={() => onToggleFilter(filter)}
        aria-pressed={active}
        className={`min-h-10 rounded-full border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          active
            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        {label(filter)}
      </button>
    );
  };

  return (
    <section className="border-b border-slate-200 bg-[#f4f7fb]" aria-label={isArabic ? "فلاتر الطلبات" : "Request filters"}>
      <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-fit items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">{isArabic ? "الفلاتر السريعة" : "Quick filters"}</p>
                <p className="text-xs text-slate-500">{isArabic ? "اختر فلترًا لتحسين النتائج" : "Refine the request list"}</p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap gap-2">{featuredFilters.map(chip)}</div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowMore((value) => !value)}
                aria-expanded={showMore}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {isArabic ? "المزيد من الفلاتر" : "More filters"}
                <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
              </button>
              {activeFilter && (
                <button
                  type="button"
                  onClick={() => onToggleFilter(activeFilter)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <X className="h-4 w-4" />
                  {isArabic ? "مسح" : "Clear"}
                </button>
              )}
            </div>
          </div>

          {showMore && (
            <div className="mt-4 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-xs font-semibold text-slate-700">{group.title}</p>
                  <div className="flex flex-wrap gap-2">{group.filters.map(chip)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickFilters;
