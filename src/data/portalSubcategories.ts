import { getNewProductStep, type PortalCategoryId } from "@/data/portalCategories";
import { getSectionSubcategories, type RequestSubcategory } from "@/data/requestSubcategories";
import type { ServiceRequest } from "@/data/requests";

const prefixed = (section: string, item: RequestSubcategory): RequestSubcategory => ({
  ...item,
  id: `${section}:${item.id}`,
});

const fromSections = (sections: string[]): RequestSubcategory[] =>
  sections.flatMap((section) => getSectionSubcategories(section).map((item) => prefixed(section, item)));

const journeyRange = (
  id: string,
  en: string,
  ar: string,
  min: number,
  max: number,
): RequestSubcategory => ({
  id,
  en,
  ar,
  matches: (request: ServiceRequest) => {
    const step = getNewProductStep(request);
    return step !== undefined && step >= min && step <= max;
  },
});

const businessCatchAll: RequestSubcategory[] = [
  {
    id: "business-operations",
    en: "Business Operations",
    ar: "عمليات الأعمال",
    matches: (request) => request.section === "Business Operations",
  },
  {
    id: "general-services",
    en: "General Services",
    ar: "الخدمات العامة",
    matches: (request) => request.section === "General Services" || request.section === "General Help",
  },
];

export const getPortalSubcategories = (category: PortalCategoryId): RequestSubcategory[] => {
  switch (category) {
    case "new-product-project":
      return [
        journeyRange("journey-setup", "Setup & Environments", "الإعداد والبيئات", 1, 3),
        journeyRange("journey-domain-security", "Domain & Security", "النطاق والأمان", 4, 6),
        journeyRange("journey-readiness", "Testing & Readiness", "الاختبار والجاهزية", 7, 8),
        journeyRange("journey-publishing", "Publishing", "النشر", 9, 9),
      ];
    case "infrastructure":
      return fromSections([
        "Infrastructure & Hosting",
        "Storage & Backup",
        "Platform & Cloud Services",
      ]);
    case "applications":
      return fromSections([
        "Application Lifecycle",
        "Application & Database",
        "DevOps & Software Delivery",
      ]);
    case "network":
      return fromSections(["Network & Connectivity"]);
    case "access":
      return fromSections(["Access & Privileges"]);
    case "data-analytics":
      return fromSections(["BI, Analytics & Reporting"]);
    case "business-services":
      return [...fromSections(["Jira & Amer"]), ...businessCatchAll];
    case "ux-development":
      return fromSections(["UX, Web & Mobile"]);
    case "all":
    default:
      return [];
  }
};
