import { useMemo, useState } from "react";
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

function matchesFilter(request: ServiceRequest, filter: string): boolean {
  const normalized = filter.toLowerCase();
  return (
    request.environment?.toLowerCase() === normalized ||
    request.section.toLowerCase() === normalized ||
    request.category.toLowerCase() === normalized ||
    request.category.toLowerCase().includes(normalized) ||
    request.title.toLowerCase().includes(normalized) ||
    (request.environment || "").toLowerCase().includes(normalized) ||
    (request.subSection || "").toLowerCase().includes(normalized) ||
    request.keywords.some((keyword) => keyword.toLowerCase().includes(normalized))
  );
}

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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((current) => (current[0] === filter ? [] : [filter]));
  };

  const filteredRequests = useMemo(() => {
    let result = requests;
    const query = searchQuery.trim();

    if (query) result = result.filter((request) => matchesSearch(request, query));
    if (activeFilters[0]) result = result.filter((request) => matchesFilter(request, activeFilters[0]));

    return result;
  }, [searchQuery, activeFilters]);

  const popularRequests = useMemo(
    () => requests.filter((request) => request.popular && request.jiraUrl?.trim()).slice(0, 6),
    [],
  );

  const groupedBySection = useMemo(() => {
    const groups: Record<string, ServiceRequest[]> = {};
    const orderedSections = [
      ...sections,
      ...filteredRequests
        .map((request) => request.section)
        .filter((section) => !sections.includes(section as (typeof sections)[number])),
    ];

    orderedSections.forEach((section) => {
      const sectionRequests = filteredRequests.filter((request) => request.section === section);
      if (sectionRequests.length > 0) groups[section] = sectionRequests;
    });

    return groups;
  }, [filteredRequests]);

  const isFiltering = Boolean(searchQuery.trim() || activeFilters.length);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <QuickFilters activeFilters={activeFilters} onToggleFilter={toggleFilter} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
        {!isFiltering && (
          <>
            <div className="mb-8 grid gap-4 lg:grid-cols-3">
              <ProjectJourneyChecklist />
              <ProjectJourneyGuide />
              <GuidedWizard />
            </div>
            <PopularRequests requests={popularRequests} />
          </>
        )}

        {filteredRequests.length === 0 ? (
          <EmptyState />
        ) : (
          Object.entries(groupedBySection).map(([section, sectionRequests]) => (
            <RequestSection key={section} title={section} requests={sectionRequests} />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
