import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import Header from "@/components/portal/Header";
import RequestCard from "@/components/portal/RequestCard";
import EmptyState from "@/components/portal/EmptyState";
import Footer from "@/components/portal/Footer";
import ToolModal, { type PortalTool } from "@/components/portal/ToolModal";
import { requests, sections } from "@/data/requests";
import { getSectionSubcategories } from "@/data/requestSubcategories";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

function matchesSearch(request: ServiceRequest, query: string): boolean {
  const normalized = query.toLowerCase();
  return [
    request.title,
    request.shortDescription,
    request.category,
    request.section,
    request.environment ?? "",
    request.subSection ?? "",
    ...request.keywords,
  ].some((value) => value.toLowerCase().includes(normalized));
}

const sectionArabic: Record<string, string> = {
  "General Help": "المساعدة العامة",
  "Infrastructure & Hosting": "البنية التحتية والاستضافة",
  "Storage & Backup": "التخزين والنسخ الاحتياطي",
  "Network & Connectivity": "الشبكات والاتصال",
  "Access & Privileges": "الصلاحيات والوصول",
  "Platform & Cloud Services": "المنصات والخدمات السحابية",
  "Application Lifecycle": "دورة حياة التطبيقات",
  "Application & Database": "التطبيقات وقواعد البيانات",
  "DevOps & Software Delivery": "DevOps وتسليم البرمجيات",
  "Jira & Amer": "Jira وAmer",
  "BI, Analytics & Reporting": "ذكاء الأعمال والتحليلات والتقارير",
  "UX, Web & Mobile": "تجربة المستخدم والويب والجوال",
  "Business Operations": "عمليات الأعمال",
  "General Services": "الخدمات العامة",
};

const validTools = new Set<PortalTool>(["request-finder", "quick-request-match"]);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("All Services");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const toolParam = searchParams.get("tool");
  const activeTool: PortalTool | null = validTools.has(toolParam as PortalTool) ? (toolParam as PortalTool) : null;

  const sectionCounts = useMemo(
    () => Object.fromEntries(sections.map((section) => [section, requests.filter((request) => request.section === section).length])),
    [],
  );

  const subcategories = useMemo(
    () => (activeSection === "All Services" ? [] : getSectionSubcategories(activeSection)),
    [activeSection],
  );

  const filteredRequests = useMemo(() => {
    let result = requests;
    if (activeSection !== "All Services") result = result.filter((request) => request.section === activeSection);
    if (activeSubcategory !== "all") {
      const selected = subcategories.find((item) => item.id === activeSubcategory);
      if (selected) result = result.filter(selected.matches);
    }
    if (searchQuery.trim()) result = result.filter((request) => matchesSearch(request, searchQuery.trim()));
    return result;
  }, [activeSection, activeSubcategory, searchQuery, subcategories]);

  if (toolParam === "project-journey-checklist") return <Navigate replace to="/tools/project-journey-checklist" />;

  const localizedSection = (section: string) => (isArabic ? sectionArabic[section] ?? section : section);
  const title = activeSection === "All Services" ? copy.catalog.allServices : localizedSection(activeSection);
  const description = activeSection === "All Services" ? copy.catalog.allDescription : copy.catalog.categoryDescription(localizedSection(activeSection));

  const selectSection = (section: string) => {
    setActiveSection(section);
    setActiveSubcategory("all");
  };

  const closeTool = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("tool");
    setSearchParams(nextParams, { replace: true });
  };

  const categoryButtonClass = (isActive: boolean) =>
    `flex min-h-11 min-w-max items-center justify-between gap-4 rounded-md px-3 py-2 text-sm transition lg:w-full lg:min-w-0 ${
      isActive ? "border-e-2 border-[#0c66e4] bg-[#e9f2ff] font-semibold text-[#0c66e4]" : "text-[#172b4d] hover:bg-[#f1f2f4]"
    }`;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-[#dfe1e6] bg-white lg:min-h-[calc(100vh-64px)] lg:border-b-0 lg:border-e">
          <div className="px-3 py-5">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wide text-[#5e6c84]">{copy.catalog.filterByCategory}</p>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible" aria-label={copy.catalog.categoriesLabel}>
              <button type="button" onClick={() => selectSection("All Services")} className={categoryButtonClass(activeSection === "All Services")}>
                <span className="min-w-0 flex-1 text-start leading-5">{copy.catalog.allServices}</span>
                <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[#dfe1e6] px-1.5 text-[11px] font-semibold text-[#44546f]">{requests.length}</span>
              </button>
              {sections.map((section) => (
                <button key={section} type="button" onClick={() => selectSection(section)} className={categoryButtonClass(activeSection === section)}>
                  <span className="min-w-0 flex-1 text-start leading-5">{localizedSection(section)}</span>
                  <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f2f4] px-1.5 text-[11px] font-semibold text-[#44546f]">{sectionCounts[section]}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-[#172b4d]">{title}</h1>
            <p className="mt-1 text-sm leading-6 text-[#5e6c84]">{description}</p>
          </div>

          <div className="mb-4 relative">
            <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a869a] ${isArabic ? "right-4" : "left-4"}`} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={copy.catalog.searchPlaceholder}
              className={`h-11 w-full rounded-md border border-[#dfe1e6] bg-white text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"}`}
              aria-label={copy.catalog.searchLabel}
            />
          </div>

          {subcategories.length > 0 && (
            <section className="mb-5 rounded-xl border border-[#dfe1e6] bg-white p-4" aria-label={isArabic ? "التصنيفات الفرعية" : "Subcategories"}>
              <p className="mb-3 text-xs font-semibold text-[#44546f]">
                {isArabic ? `تصفية ${localizedSection(activeSection)}` : `Filter ${activeSection}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubcategory("all")}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${activeSubcategory === "all" ? "border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]" : "border-[#dfe1e6] bg-white text-[#44546f] hover:bg-[#f7f8f9]"}`}
                >
                  {isArabic ? "الكل" : "All"} ({sectionCounts[activeSection]})
                </button>
                {subcategories.map((subcategory) => {
                  const count = requests.filter((request) => request.section === activeSection && subcategory.matches(request)).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={subcategory.id}
                      type="button"
                      onClick={() => setActiveSubcategory(subcategory.id)}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${activeSubcategory === subcategory.id ? "border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]" : "border-[#dfe1e6] bg-white text-[#44546f] hover:bg-[#f7f8f9]"}`}
                    >
                      {isArabic ? subcategory.ar : subcategory.en} ({count})
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <p className="mb-4 text-sm text-[#44546f]"><span className="font-semibold text-[#172b4d]">{filteredRequests.length}</span> {copy.catalog.servicesFound}</p>
          {filteredRequests.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)}
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
