import { useState, useMemo } from "react";
import Header from "@/components/portal/Header";
import QuickFilters from "@/components/portal/QuickFilters";
import PopularRequests from "@/components/portal/PopularRequests";
import GuidedWizard from "@/components/portal/GuidedWizard";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import RequestSection from "@/components/portal/RequestSection";
import EmptyState from "@/components/portal/EmptyState";
import Footer from "@/components/portal/Footer";
import { requests, sections } from "@/data/requests";
import type { ServiceRequest } from "@/data/requests";

const sectionFilterMap: Record<string, string[]> = {
  "New request": ["Initiate", "Environment Preparation"],
  Modify: ["Modify"],
  Publish: ["Publishing"],
  Retire: ["Retire"],
  "User Access": ["User Access"],
  DevOps: ["DevOps Requests"],
  Platform: ["Platform Services"],
};

const envFilterMap: Record<string, string> = {
  "Dev/QA": "Dev/QA",
  "Staging/Production": "Staging/Production",
  DR: "DR",
};

const categoryQuickFilters = ["Security", "Servers", "DNS", "SSL", "OpenShift", "Scale Up", "Scale Down"];

function matchesSearch(req: ServiceRequest, query: string): boolean {
  const q = query.toLowerCase();
  return (
    req.title.toLowerCase().includes(q) ||
    req.shortDescription.toLowerCase().includes(q) ||
    req.category.toLowerCase().includes(q) ||
    (req.environment || "").toLowerCase().includes(q) ||
    (req.subSection || "").toLowerCase().includes(q) ||
    req.section.toLowerCase().includes(q) ||
    req.keywords.some((k) => k.toLowerCase().includes(q)) ||
    (req.arabicDescription || "").includes(q)
  );
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredRequests = useMemo(() => {
    let result = requests;

    if (searchQuery.trim()) {
      result = result.filter((r) => matchesSearch(r, searchQuery.trim()));
    }

    if (activeFilters.length > 0) {
      result = result.filter((req) => {
        return activeFilters.every((filter) => {
          if (sectionFilterMap[filter]) {
            return sectionFilterMap[filter].includes(req.section);
          }
          if (envFilterMap[filter]) {
            return req.environment === envFilterMap[filter];
          }
          if (categoryQuickFilters.includes(filter)) {
            const fl = filter.toLowerCase();
            return (
              req.category.toLowerCase().includes(fl) ||
              req.title.toLowerCase().includes(fl) ||
              req.keywords.some((k) => k.toLowerCase().includes(fl))
            );
          }
          return true;
        });
      });
    }

    return result;
  }, [searchQuery, activeFilters]);

  const popularRequests = useMemo(() => {
    const popularOrder = [
      "mod-010",
      "mod-011",
      "mod-012",
      "mod-007",
    ];

    return requests
      .filter((r) => popularOrder.includes(r.id))
      .sort((a, b) => popularOrder.indexOf(a.id) - popularOrder.indexOf(b.id));
  }, []);

  const groupedBySection = useMemo(() => {
    const groups: Record<string, ServiceRequest[]> = {};
    for (const section of sections) {
      const sectionRequests = filteredRequests.filter((r) => r.section === section);
      if (sectionRequests.length > 0) {
        groups[section] = sectionRequests;
      }
    }
    return groups;
  }, [filteredRequests]);

  const isFiltering = searchQuery.trim() !== "" || activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <QuickFilters activeFilters={activeFilters} onToggleFilter={toggleFilter} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 pb-16 flex-1 w-full">
        {!isFiltering && (
          <>
            <div className="mb-6 overflow-hidden rounded-lg border border-primary/15 bg-card px-5 py-5 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold text-primary">
                    Choose the right technology request before you submit
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Built for project and product managers: search by goal, filter by
                    environment, review the project journey, then open the correct Jira request.
                  </p>
                </div>

                <div dir="rtl" lang="ar" className="max-w-3xl lg:text-right">
                  <p className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                    اختر الطلب التقني المناسب قبل الرفع
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                    مصمم لمديري المشاريع والمنتجات: ابحث حسب الهدف، صف حسب البيئة، راجع رحلة المشروع، ثم افتح طلب Jira الصحيح.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/35 px-4 py-3">
                  <p className="text-lg font-semibold text-foreground">{requests.length}</p>
                  <p className="text-xs text-muted-foreground">Available requests | الطلبات المتاحة</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/35 px-4 py-3">
                  <p className="text-lg font-semibold text-foreground">{sections.length}</p>
                  <p className="text-xs text-muted-foreground">Service sections | أقسام الخدمات</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/35 px-4 py-3">
                  <p className="text-lg font-semibold text-foreground">Jira</p>
                  <p className="text-xs text-muted-foreground">Direct submission | رفع مباشر</p>
                </div>
              </div>
            </div>

            <ProjectJourneyChecklist />
            <ProjectJourneyGuide />
            <GuidedWizard />
            <PopularRequests requests={popularRequests} />
          </>
        )}

        {filteredRequests.length === 0 ? (
          <EmptyState />
        ) : (
          Object.entries(groupedBySection).map(([section, reqs]) => (
            <RequestSection key={section} title={section} requests={reqs} />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
