import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/portal/Header";
import RequestCard from "@/components/portal/RequestCard";
import EmptyState from "@/components/portal/EmptyState";
import Footer from "@/components/portal/Footer";
import { requests, sections } from "@/data/requests";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

function matchesSearch(request: ServiceRequest, query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    request.title.toLowerCase().includes(normalized) ||
    request.shortDescription.toLowerCase().includes(normalized) ||
    request.category.toLowerCase().includes(normalized) ||
    request.section.toLowerCase().includes(normalized) ||
    (request.environment || "").toLowerCase().includes(normalized) ||
    (request.subSection || "").toLowerCase().includes(normalized) ||
    request.keywords.some((keyword) => keyword.toLowerCase().includes(normalized))
  );
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("All Services");
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const sectionCounts = useMemo(
    () => Object.fromEntries(sections.map((section) => [section, requests.filter((request) => request.section === section).length])),
    [],
  );

  const filteredRequests = useMemo(() => {
    let result = requests;
    if (activeSection !== "All Services") {
      result = result.filter((request) => request.section === activeSection);
    }
    if (searchQuery.trim()) {
      result = result.filter((request) => matchesSearch(request, searchQuery.trim()));
    }
    return result;
  }, [activeSection, searchQuery]);

  const title = activeSection === "All Services" ? (isArabic ? "جميع الخدمات" : "All Services") : activeSection;
  const description =
    activeSection === "All Services"
      ? isArabic
        ? "تصفح جميع الخدمات التقنية المتاحة عبر البنية التحتية والشبكات والتطبيقات والدعم وBI/UX/Mobile وBizOps."
        : "Browse all available technology services across Infra & Network, Application, IT Support, BI/UX/Mobile, and BizOps."
      : isArabic
        ? `استعرض الطلبات المتاحة ضمن تصنيف ${activeSection}.`
        : `Browse all available requests in ${activeSection}.`;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />

      <div className="mx-auto grid max-w-[1920px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-[#dfe1e6] bg-white lg:min-h-[calc(100vh-64px)] lg:border-b-0 lg:border-e">
          <div className="px-3 py-5">
            <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-wide text-[#5e6c84]">
              {isArabic ? "التصفية حسب التصنيف" : "Filter by category"}
            </p>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible" aria-label={isArabic ? "تصنيفات الخدمات" : "Service categories"}>
              <button
                type="button"
                onClick={() => setActiveSection("All Services")}
                className={`flex min-w-max items-center justify-between gap-4 rounded-md px-3 py-2 text-sm font-semibold transition lg:w-full ${
                  activeSection === "All Services"
                    ? "border-e-2 border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]"
                    : "text-[#172b4d] hover:bg-[#f1f2f4]"
                }`}
              >
                <span>{isArabic ? "جميع الخدمات" : "All Services"}</span>
                <span className="rounded-full bg-[#dfe1e6] px-2 py-0.5 text-[11px] text-[#44546f]">{requests.length}</span>
              </button>

              {sections.map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`flex min-w-max items-center justify-between gap-4 rounded-md px-3 py-2 text-sm transition lg:w-full ${
                    activeSection === section
                      ? "border-e-2 border-[#0c66e4] bg-[#e9f2ff] font-semibold text-[#0c66e4]"
                      : "text-[#172b4d] hover:bg-[#f1f2f4]"
                  }`}
                >
                  <span className="text-start">{section}</span>
                  <span className="rounded-full bg-[#f1f2f4] px-2 py-0.5 text-[11px] text-[#44546f]">{sectionCounts[section]}</span>
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

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a869a] ${isArabic ? "right-4" : "left-4"}`} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={isArabic ? "ابحث باسم الطلب أو الكلمة المفتاحية أو الإجراء..." : "Search by request name, keyword, or action..."}
                className={`h-11 w-full rounded-md border border-[#dfe1e6] bg-white text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"}`}
                aria-label={isArabic ? "البحث في الخدمات" : "Search services"}
              />
            </div>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#dfe1e6] bg-white px-4 text-sm font-semibold text-[#172b4d] shadow-sm transition hover:bg-[#f7f8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {isArabic ? "فلترة" : "Filter"}
            </button>
          </div>

          <p className="mb-4 text-sm text-[#44546f]">
            <span className="font-semibold text-[#172b4d]">{filteredRequests.length}</span> {isArabic ? "خدمة متاحة" : "services found"}
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
    </div>
  );
};

export default Index;
