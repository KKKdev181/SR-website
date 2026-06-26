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

const specialCategoryFilters: Record<string, (req: ServiceRequest) => boolean> = {
  "Scale Up": (req) =>
    req.category.toLowerCase().includes("scale") ||
    req.title.toLowerCase().includes("scale up") ||
    req.title.toLowerCase().includes("increase") ||
    req.keywords.some((keyword) => keyword.toLowerCase().includes("scale up")),
  "Scale Down": (req) =>
    req.category.toLowerCase().includes("scale") ||
    req.title.toLowerCase().includes("scale down") ||
    req.title.toLowerCase().includes("reduce") ||
    req.keywords.some((keyword) => keyword.toLowerCase().includes("scale down")),
};

function matchesFilter(req: ServiceRequest, filter: string): boolean {
  if (specialCategoryFilters[filter]) {
    return specialCategoryFilters[filter](req);
  }

  const normalizedFilter = filter.toLowerCase();
  return (
    req.environment?.toLowerCase() === normalizedFilter ||
    req.section.toLowerCase() === normalizedFilter ||
    req.category.toLowerCase() === normalizedFilter ||
    req.category.toLowerCase().includes(normalizedFilter) ||
    req.title.toLowerCase().includes(normalizedFilter) ||
    (req.environment || "").toLowerCase().includes(normalizedFilter) ||
    (req.subSection || "").toLowerCase().includes(normalizedFilter) ||
    req.section.toLowerCase().includes(normalizedFilter) ||
    req.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedFilter))
  );
}

function matchesSearch(req: ServiceRequest, query: string): boolean {
  const q = query.toLowerCase();
  return (
    req.title.toLowerCase().includes(q) ||
    req.shortDescription.toLowerCase().includes(q) ||
    req.category.toLowerCase().includes(q) ||
    (req.environment || "").toLowerCase().includes(q) ||
    (req.subSection || "").toLowerCase().includes(q) ||
    req.section.toLowerCase().includes(q) ||
    req.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev[0] === filter ? [] : [filter]));
  };

  const filteredRequests = useMemo(() => {
    let result = requests;

    if (searchQuery.trim()) {
      result = result.filter((r) => matchesSearch(r, searchQuery.trim()));
    }

    if (activeFilters.length > 0) {
      result = result.filter((req) => matchesFilter(req, activeFilters[0]));
    }

    return result;
  }, [searchQuery, activeFilters]);

  const popularRequests = useMemo(() => {
    return requests.filter((request) => request.popular).slice(0, 6);
  }, []);

  const groupedBySection = useMemo(() => {
    const groups: Record<string, ServiceRequest[]> = {};
    const allSections = [
      ...sections,
      ...filteredRequests
        .map((request) => request.section)
        .filter((section): section is string => !sections.includes(section as typeof sections[number])),
    ];

    for (const section of allSections) {
      const sectionRequests = filteredRequests.filter((request) => request.section === section);
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
