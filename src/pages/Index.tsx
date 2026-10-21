import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bot, CircleHelp, ExternalLink, Loader2, Search, Sparkles } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import Header from "@/components/portal/Header";
import RequestCard from "@/components/portal/RequestCard";
import EmptyState from "@/components/portal/EmptyState";
import Footer from "@/components/portal/Footer";
import ToolModal, { type PortalTool } from "@/components/portal/ToolModal";
import { requests } from "@/data/requests";
import {
  getNewProductStep,
  getPortalCategory,
  portalCategories,
  type PortalCategoryId,
} from "@/data/portalCategories";
import { getPortalSubcategories } from "@/data/portalSubcategories";
import { localizeRequest } from "@/i18n/requestLocalization";
import { getArabicSearchAliases } from "@/i18n/requestSearchAliases";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

const GENERAL_REQUEST_URL =
  "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/836?returnUrl=%2Fcategory%2Fnsr";

type AiRecommendation = {
  title: string;
  reason: string;
  url: string;
};

type AiResult = {
  answer: string;
  recommendations: AiRecommendation[];
};

const getAiGatewayUrl = () => {
  const configured = import.meta.env.VITE_AI_GATEWAY_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "/api/ai";
};

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 8000,
) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
};

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

const applicationRequestPriority: Record<string, number> = {
  "Application Service Requests": 1,
  "Database Service Requests": 2,
  "Integration Support": 3,
  "Installation Database Management System": 4,
  "Google Map": 5,
  "Enable Minor Change": 6,
  "Service Renaming": 7,
  "Release Support": 8,
  "Service Retirement": 99,
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchMode, setSearchMode] = useState<"catalog" | "ai">("catalog");
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiError, setAiError] = useState("");
  const [activeCategory, setActiveCategory] = useState<PortalCategoryId>("all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const toolParam = searchParams.get("tool");
  const activeTool: PortalTool | null = validTools.has(toolParam as PortalTool)
    ? (toolParam as PortalTool)
    : null;

  useEffect(() => {
    const checkAi = async () => {
      try {
        const response = await fetchWithTimeout(
          `${getAiGatewayUrl()}/health`,
          { headers: { Accept: "application/json" } },
          5000,
        );

        if (!response.ok) throw new Error("AI gateway unavailable");
        const payload = await response.json();
        setAiAvailable(Boolean(payload?.ok && payload?.configured));
      } catch {
        setAiAvailable(false);
      }
    };

    checkAi();
  }, []);

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
  const subcategories = useMemo(() => getPortalSubcategories(activeCategory), [activeCategory]);

  const categoryRequests = useMemo(() => {
    if (activeCategory === "all") return [...requests];
    const category = portalCategories.find((item) => item.id === activeCategory);
    return category ? requests.filter(category.matches) : [...requests];
  }, [activeCategory]);

  const visibleSubcategories = useMemo(
    () =>
      subcategories
        .map((subcategory) => ({
          ...subcategory,
          count: categoryRequests.filter(subcategory.matches).length,
        }))
        .filter((subcategory) => subcategory.count > 0),
    [subcategories, categoryRequests],
  );

  const subcategoryRequests = useMemo(() => {
    if (activeCategory === "all" || activeSubcategory === "all") return categoryRequests;
    const selected = subcategories.find((subcategory) => subcategory.id === activeSubcategory);
    return selected ? categoryRequests.filter(selected.matches) : categoryRequests;
  }, [activeCategory, activeSubcategory, categoryRequests, subcategories]);

  const searchSuggestions = useMemo(() => {
    if (searchMode !== "catalog") return [];
    const query = normalizeSearch(searchQuery);
    if (query.length < 2) return [];

    return subcategoryRequests
      .filter((request) => matchesSearch(request, query))
      .map((request) => {
        const localized = localizeRequest(request, isArabic);
        const title = normalizeSearch(localized.title);
        const englishTitle = normalizeSearch(request.title);
        let score = 3;

        if (title.startsWith(query) || englishTitle.startsWith(query)) score = 0;
        else if (title.includes(query) || englishTitle.includes(query)) score = 1;
        else if (normalizeSearch(request.keywords.join(" ")).includes(query)) score = 2;

        return { request, localized, score };
      })
      .sort((a, b) => a.score - b.score || a.localized.title.localeCompare(b.localized.title))
      .slice(0, 7);
  }, [searchQuery, subcategoryRequests, isArabic, searchMode]);

  const filteredRequests = useMemo(() => {
    let result = [...subcategoryRequests];

    if (searchMode === "catalog" && searchQuery.trim()) {
      result = result.filter((request) => matchesSearch(request, searchQuery.trim()));
    }

    if (activeCategory === "new-product-project") {
      result.sort((left, right) => (getNewProductStep(left) ?? 999) - (getNewProductStep(right) ?? 999));
    }

    if (activeCategory === "applications") {
      result.sort((left, right) => {
        const leftPriority = applicationRequestPriority[left.title] ?? 50;
        const rightPriority = applicationRequestPriority[right.title] ?? 50;
        return leftPriority - rightPriority;
      });
    }

    return result;
  }, [activeCategory, subcategoryRequests, searchQuery, searchMode]);

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

  const chooseSuggestion = (request: ServiceRequest) => {
    const localized = localizeRequest(request, isArabic);
    setSearchQuery(localized.title);
    setSearchFocused(false);
  };

  const selectCategory = (category: PortalCategoryId) => {
    setActiveCategory(category);
    setActiveSubcategory("all");
  };

  const askAi = async () => {
    const query = searchQuery.trim();
    if (!query || !aiAvailable || aiLoading) return;

    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    setSearchFocused(false);

    try {
      const response = await fetchWithTimeout(`${getAiGatewayUrl()}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          language,
          catalog: requests.map((request) => ({
            title: request.title,
            description: request.shortDescription,
            category: request.section,
            url: request.jiraUrl,
          })),
        }),
      }, 45000);

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : `AI gateway returned HTTP ${response.status}`,
        );
      }

      setAiResult({
        answer: typeof payload?.answer === "string" ? payload.answer : "",
        recommendations: Array.isArray(payload?.recommendations)
          ? payload.recommendations.slice(0, 5)
          : [],
      });
    } catch {
      setAiError(
        isArabic
          ? "تعذر الوصول إلى مساعد AI حالياً. البحث العادي ما زال يعمل."
          : "AI is currently unavailable. Normal search is still working.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const aiResponseIsArabic = /[\u0600-\u06ff]/.test(
    aiResult?.answer || searchQuery,
  );

  const categoryButtonClass = (isActive: boolean) =>
    `flex min-h-11 min-w-max items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm transition lg:w-full lg:min-w-0 ${
      isActive
        ? "border border-[#b3d4ff] bg-[#e9f2ff] font-semibold text-[#0c66e4] shadow-sm"
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
                onClick={() => selectCategory("all")}
                className={categoryButtonClass(activeCategory === "all")}
              >
                <span className="min-w-0 flex-1 text-start leading-5">{copy.catalog.allServices}</span>
                <span className={`inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${activeCategory === "all" ? "bg-[#d6e8ff] text-[#0c66e4]" : "bg-[#f1f2f4] text-[#44546f]"}`}>
                  {categoryCounts.all}
                </span>
              </button>

              {portalCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={categoryButtonClass(activeCategory === category.id)}
                >
                  <span className="min-w-0 flex-1 text-start leading-5">
                    {isArabic ? category.ar : category.en}
                  </span>
                  <span className={`inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${activeCategory === category.id ? "bg-[#d6e8ff] text-[#0c66e4]" : "bg-[#f1f2f4] text-[#44546f]"}`}>
                    {categoryCounts[category.id]}
                  </span>
                </button>
              ))}
            </nav>

            <section className="mt-4 rounded-xl border border-[#b3d4ff] bg-[#e9f2ff] p-4 shadow-sm" dir={isArabic ? "rtl" : "ltr"} aria-label={isArabic ? "تحتاج مساعدة؟" : "Need Help?"}>
              <div className="mb-3 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0c66e4] shadow-sm">
                  <CircleHelp className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 text-start">
                  <h2 className="text-sm font-bold text-[#172b4d]">{isArabic ? "تحتاج مساعدة؟" : "Need Help?"}</h2>
                  <p className="mt-1 text-xs leading-5 text-[#44546f]">
                    {isArabic ? "إذا لم تجد الخدمة المناسبة، يمكنك تقديم طلب عام." : "If you cannot find the right service, submit a general request."}
                  </p>
                </div>
              </div>
              <a href={GENERAL_REQUEST_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0c66e4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0055cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4] focus-visible:ring-offset-2">
                <span>{isArabic ? "طلب عام" : "General Request"}</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </section>

            <div className="mt-5 border-t border-[#dfe1e6] px-3 pt-4 text-center">
              <p className="text-[11px] font-medium tracking-wide text-[#7a869a]">
                {isArabic ? "تم التطوير بواسطة Technology Delivery" : "Developed by Technology Delivery"}
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-[#172b4d]">{title}</h1>
            <p className="mt-1 text-sm leading-6 text-[#5e6c84]">{description}</p>
          </div>

          <section className="relative z-30 mb-5">
            <div className="mb-3 inline-flex rounded-xl border border-[#dfe1e6] bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setSearchMode("catalog");
                  setAiResult(null);
                  setAiError("");
                }}
                className={`inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition ${searchMode === "catalog" ? "bg-[#e9f2ff] text-[#0c66e4]" : "text-[#6b778c] hover:bg-[#f7f8f9]"}`}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{isArabic ? "البحث في الخدمات" : "Search Services"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode("ai");
                  setSearchFocused(false);
                  setAiError("");
                }}
                disabled={!aiAvailable}
                className={`relative inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${searchMode === "ai" ? "bg-[#0c66e4] text-white shadow-sm" : "border border-[#b3d4ff] bg-[#f7fbff] text-[#0c66e4] hover:bg-[#e9f2ff]"} disabled:cursor-not-allowed disabled:opacity-45`}
              >
                <span className={`relative flex h-5 w-5 items-center justify-center rounded-full ${searchMode === "ai" ? "bg-white/15 text-white" : "bg-[#e9f2ff] text-[#0c66e4]"}`}>
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>{isArabic ? "اسأل مساعد Technology Center" : "Ask Technology Center AI"}</span>
                {searchMode !== "ai" && (
                  <span className="rounded-full border border-[#b3d4ff] bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0c66e4]">
                    AI
                  </span>
                )}
              </button>
            </div>

            {searchMode === "catalog" ? (
              <div className="relative">
                <Search className={`pointer-events-none absolute top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#7a869a] ${isArabic ? "right-4" : "left-4"}`} />
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setAiResult(null);
                    setAiError("");
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
                  placeholder={copy.catalog.searchPlaceholder}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={searchFocused && searchQuery.trim().length >= 2}
                  aria-controls="request-search-suggestions"
                  className={`h-12 w-full rounded-xl border border-[#dfe1e6] bg-white text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"}`}
                  aria-label={copy.catalog.searchLabel}
                />

                {searchFocused && searchQuery.trim().length >= 2 && (
                  <div
                    id="request-search-suggestions"
                    role="listbox"
                    className="absolute inset-x-0 top-[calc(100%+6px)] overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_12px_32px_rgba(9,30,66,0.16)]"
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <div className="border-b border-[#f1f2f4] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#6b778c]">
                      {searchSuggestions.length > 0
                        ? isArabic
                          ? "طلبات مقترحة"
                          : "Suggested requests"
                        : isArabic
                          ? "لا توجد اقتراحات مطابقة"
                          : "No matching suggestions"}
                    </div>

                    {searchSuggestions.map(({ request, localized }) => {
                      const category = getPortalCategory(request);
                      const categoryLabel = category ? (isArabic ? category.ar : category.en) : localized.section;

                      return (
                        <button
                          key={request.id}
                          type="button"
                          role="option"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => chooseSuggestion(request)}
                          className="group flex w-full items-center justify-between gap-4 border-b border-[#f1f2f4] px-4 py-3 text-start transition last:border-b-0 hover:bg-[#f7f9fc] focus:bg-[#f7f9fc] focus:outline-none"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-[#172b4d] group-hover:text-[#0c66e4]">
                              {localized.title}
                            </div>
                            <div className="mt-1 flex min-w-0 items-center gap-2">
                              <span className="shrink-0 rounded-full bg-[#e9f2ff] px-2 py-0.5 text-[10px] font-medium text-[#0c66e4]">
                                {categoryLabel}
                              </span>
                              <span className="truncate text-xs text-[#7a869a]">{localized.description}</span>
                            </div>
                          </div>
                          <ArrowUpRight className={`h-4 w-4 shrink-0 text-[#97a0af] transition group-hover:text-[#0c66e4] ${isArabic ? "-rotate-90" : ""}`} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#b3d4ff] bg-white p-4 shadow-[0_6px_18px_rgba(9,30,66,0.08)]">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <span className={`pointer-events-none absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#e9f2ff] text-[#0c66e4] ${isArabic ? "right-3" : "left-3"}`}>
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <input
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setAiResult(null);
                        setAiError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && aiAvailable) {
                          event.preventDefault();
                          askAi();
                        }
                      }}
                      placeholder={
                        isArabic
                          ? "اكتب احتياجك بطريقتك، مثلاً: أبي اتصال بين سيرفرين"
                          : "Describe what you need, e.g. I need connection between two servers"
                      }
                      autoComplete="off"
                      className={`h-12 w-full rounded-xl border border-[#dfe1e6] bg-white text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#7a869a] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${isArabic ? "pr-14 pl-4" : "pl-14 pr-4"}`}
                      aria-label={isArabic ? "اسأل مساعد التقنية" : "Ask Technology Center AI"}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={askAi}
                    disabled={!aiAvailable || !searchQuery.trim() || aiLoading}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0c66e4] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0055cc] disabled:cursor-not-allowed disabled:bg-[#dfe1e6] disabled:text-[#97a0af] disabled:shadow-none"
                  >
                    {aiLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{isArabic ? "اسأل AI" : "Ask AI"}</span>
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-xs text-[#6b778c]">
                  <span className="font-semibold text-[#0c66e4]">
                    {isArabic ? "اسأل بطريقتك:" : "Ask naturally:"}
                  </span>
                  <span>{isArabic ? "ابي سيرفر" : "I need a server"}</span>
                  <span className="text-[#b3bac5]">•</span>
                  <span>{isArabic ? "ابي اتصال بين سيرفرين" : "Connect two servers"}</span>
                  <span className="text-[#b3bac5]">•</span>
                  <span>{isArabic ? "مين TPM حق الإدارة؟" : "Who is my TPM?"}</span>
                </div>
              </div>
            )}
          </section>

          {aiError && (
            <div className="mb-4 rounded-xl border border-[#ffbdad] bg-[#ffebe6] px-4 py-3 text-sm text-[#ae2a19]">
              {aiError}
            </div>
          )}

          {aiResult && (
            <section
              className="mb-5 overflow-hidden rounded-xl border border-[#b3d4ff] bg-white shadow-sm"
              dir={aiResponseIsArabic ? "rtl" : "ltr"}
            >
              <div className="flex items-center gap-2 border-b border-[#dfe1e6] bg-[#f7f9fc] px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#0c66e4]">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#172b4d]">
                    {isArabic ? "مساعد Technology Center" : "Technology Center AI"}
                  </h2>
                </div>
              </div>

              <div className="p-4">
                {aiResult.answer && (
                  <p
                    dir="auto"
                    className={`whitespace-pre-line text-[15px] leading-8 text-[#334e68] ${aiResponseIsArabic ? "text-right" : "text-left"}`}
                    style={aiResponseIsArabic ? { fontFamily: "'Noto Sans Arabic', Arial, sans-serif" } : undefined}
                  >
                    {aiResult.answer}
                  </p>
                )}

                {aiResult.recommendations.length > 0 && (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {aiResult.recommendations.map((recommendation, index) => (
                      <a
                        key={`${recommendation.title}-${index}`}
                        href={recommendation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-lg border border-[#dfe1e6] bg-[#fafbfc] p-3 transition hover:border-[#0c66e4] hover:bg-[#f7fbff]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 dir="auto" className="text-start text-sm font-bold text-[#172b4d] group-hover:text-[#0c66e4]">
                              {recommendation.title}
                            </h3>
                            <p dir="auto" className="mt-1 text-start text-xs leading-6 text-[#5e6c84]">
                              {recommendation.reason}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#97a0af] group-hover:text-[#0c66e4]" aria-hidden="true" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activeCategory !== "all" && visibleSubcategories.length > 0 && (
            <section className="mb-5" aria-label={isArabic ? "تصفية داخل التصنيف" : "Filter within category"}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#5e6c84]">
                  {isArabic ? "تصفية داخل التصنيف" : "Filter within category"}
                </span>
                {activeSubcategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setActiveSubcategory("all")}
                    className="text-xs font-semibold text-[#0c66e4] hover:underline"
                  >
                    {isArabic ? "مسح التصفية" : "Clear filter"}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubcategory("all")}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    activeSubcategory === "all"
                      ? "border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]"
                      : "border-[#dfe1e6] bg-white text-[#44546f] hover:bg-[#f7f8f9]"
                  }`}
                >
                  {isArabic ? "الكل" : "All"} ({categoryRequests.length})
                </button>

                {visibleSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    type="button"
                    onClick={() => setActiveSubcategory(subcategory.id)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      activeSubcategory === subcategory.id
                        ? "border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]"
                        : "border-[#dfe1e6] bg-white text-[#44546f] hover:bg-[#f7f8f9]"
                    }`}
                  >
                    {isArabic ? subcategory.ar : subcategory.en} ({subcategory.count})
                  </button>
                ))}
              </div>
            </section>
          )}

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

          {searchMode === "catalog" && (
            <>
              <p className="mb-4 text-sm text-[#44546f]">
                <span className="font-semibold text-[#172b4d]">{filteredRequests.length}</span>{" "}
                {copy.catalog.servicesFound}
              </p>

              {filteredRequests.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showJourneyStep={activeCategory === "new-product-project"} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
      <ToolModal tool={activeTool} onClose={closeTool} />
    </div>
  );
};

export default Index;
