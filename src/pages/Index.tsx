import { useMemo, useState } from "react";
import { CircleHelp, ExternalLink, Search } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import Header from "@/components/portal/Header";
import RequestCard from "@/components/portal/RequestCard";
import EmptyState from "@/components/portal/EmptyState";
import Footer from "@/components/portal/Footer";
import ToolModal, { type PortalTool } from "@/components/portal/ToolModal";
import { requests } from "@/data/requests";
import {
  getNewProductStep,
  portalCategories,
  type PortalCategoryId,
} from "@/data/portalCategories";
import { localizeRequest } from "@/i18n/requestLocalization";
import { getArabicSearchAliases } from "@/i18n/requestSearchAliases";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

const GENERAL_REQUEST_URL =
  "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/836?returnUrl=%2Fcategory%2Fnsr";

const normalizeSearch = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();

function matchesSearch(request: ServiceRequest, query: string): boolean {
  const normalizedQuery = normalizeSearch(query);
  const arabic = localizeRequest(request, true);
  const searchableValues = [
    request.title,
    request.shortDescription,
    request.category,
    request.section,
    request.environment ?? "",
    request.subSection ?? "",
    ...request.keywords,
    arabic.title,
    arabic.description,
    arabic.category,
    arabic.section,
    arabic.environment ?? "",
    ...getArabicSearchAliases(request),
  ];

  return searchableValues.some((value) => normalizeSearch(value).includes(normalizedQuery));
}

const validTools = new Set<PortalTool>(["request-finder", "quick-request-match"]);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PortalCategoryId>("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const toolParam = searchParams.get("tool");
  const activeTool: PortalTool | null = validTools.has(toolParam as PortalTool)
    ? (toolParam as PortalTool)
    : null;

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries([
        ["all", requests.length],
        ...portalCategories.map((category) => [
          category.id,
          requests.filter(category.matches).length,
        ]),
      ]) as Record<PortalCategoryId, number>,
    [],
  );

  const selectedCategory = portalCategories.find((category) => category.id === activeCategory);

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (activeCategory !== "all") {
      const category = portalCategories.find((item) => item.id === activeCategory);
      if (category) result = result.filter(category.matches);
    }

    if (searchQuery.trim()) {
      result = result.filter((request) => matchesSearch(request, searchQuery.trim()));
    }

    if (activeCategory === "new-product-project") {
      result.sort((left, right) => (getNewProductStep(left) ?? 999) - (getNewProductStep(right) ?? 999));
    }

    return result;
  }, [activeCategory, searchQuery]);

  if (toolParam === "project-journey-checklist") {
    return <Navigate replace to="/tools/project-journey-checklist" />;
  }

  const title =
    activeCategory === "all"
      ? copy.catalog.allServices
      : isArabic
        ? selectedCategory?.ar
        : selectedCategory?.en;

  const description =
    activeCategory === "all"
      ? copy.catalog.allDescription
      : activeCategory === "new-product-project"
        ? isArabic
          ? "طلبات مرتبة حسب خطوات تجهيز وإطلاق المنتج أو المشروع الجديد."
          : "Requests ordered by the steps required to prepare and launch a new product or project."
        : isArabic
          ? `استعرض جميع الطلبات ضمن ${selectedCategory?.ar ?? "هذا التصنيف"}.`
          : `Browse all requests under ${selectedCategory?.en ?? "this category"}.`;

  const closeTool = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("tool");
    setSearchParams(nextParams, { replace: true });
  };

  const categoryButtonClass = (isActive: boolean) =>
    `flex min-h-11 min-w-max items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm transition lg:w-full lg:min-w-0 ${
      isActive
        ? "border border-[#c7c3ff] bg-[#eeecff] font-semibold text-[#4c00ff] shadow-sm"
        : "border border-transparent text-[#172b4d] hover:bg-[#f1f2f4]"
    }`;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-[#dfe1e6] bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-e">
          <div className="px-3 py-5">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wide text-[#5e6c84]">
              {copy.catalog.filterByCategory}
            </p>

            <nav
              className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible"
              aria-label={copy.catalog.categoriesLabel}
            >
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={categoryButtonClass(activeCategory === "all")}
              >
                <span className="min-w-0 flex-1 text-start leading-5">{copy.catalog.allServices}</span>
                <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f2f4] px-1.5 text-[11px] font-semibold text-[#44546f]">
                  {categoryCounts.all}
                </span>
              </button>

              {portalCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={categoryButtonClass(activeCategory === category.id)}
                >
                  <span className="min-w-0 flex-1 text-start leading-5">
                    {isArabic ? category.ar : category.en}
                  </span>
                  <span
                    className={`inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                      activeCategory === category.id
                        ? "bg-[#ddd9ff] text-[#4c00ff]"
                        : "bg-[#f1f2f4] text-[#44546f]"
                    }`}
                  >
                    {categoryCounts[category.id]}
                  </span>
                </button>
              ))}
            </nav>

            <section
              className="mt-4 rounded-xl border border-[#b3d4ff] bg-[#e9f2ff] p-4 shadow-sm"
              dir={isArabic ? "rtl" : "ltr"}
              aria-label={isArabic ? "تحتاج مساعدة؟" : "Need Help?"}
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0c66e4] shadow-sm">
                  <CircleHelp className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 text-start">
                  <h2 className="text-sm font-bold text-[#172b4d]">
                    {isArabic ? "تحتاج مساعدة؟" : "Need Help?"}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[#44546f]">
                    {isArabic
                      ? "إذا لم تجد الخدمة المناسبة، يمكنك تقديم طلب عام."
                      : "If you cannot find the right service, submit a general request."}
                  </p>
                </div>
              </div>
              <a
                href={GENERAL_REQUEST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0c66e4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0055cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4] focus-visible:ring-offset-2"
              >
                <span>{isArabic ? "طلب عام" : "General Request"}</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </section>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-[#172b4d]">{title}</h1>
            <p className="mt-1 text-sm leading-6 text-[#5e6c84]">{description}</p>
          </div>

          <div className="relative mb-5">
            <Search
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a869a] ${
                isArabic ? "right-4" : "left-4"
              }`}
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={copy.catalog.searchPlaceholder}
              className={`h-11 w-full rounded-lg border border-[#dfe1e6] bg-white text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${
                isArabic ? "pr-12 pl-4" : "pl-12 pr-4"
              }`}
              aria-label={copy.catalog.searchLabel}
            />
          </div>

          {activeCategory === "new-product-project" && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#5e6c84]">
                {isArabic ? "مسار المنتج/المشروع الجديد" : "New Product/Project Journey"}
              </span>
              <span className="rounded-full border border-[#dfe1e6] bg-white px-3 py-1.5 text-xs font-medium text-[#44546f]">
                {isArabic ? "مرتبة من الخطوة 1 إلى 9" : "Ordered from step 1 to 9"}
              </span>
            </div>
          )}

          <p className="mb-4 text-sm text-[#44546f]">
            <span className="font-semibold text-[#172b4d]">{filteredRequests.length}</span>{" "}
            {copy.catalog.servicesFound}
          </p>

          {filteredRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
      <ToolModal tool={activeTool} onClose={closeTool} />
    </div>
  );
};

export default Index;
