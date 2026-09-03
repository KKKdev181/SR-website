import type { PortalCategoryId } from "@/data/portalCategories";
import { getSectionSubcategories, type RequestSubcategory } from "@/data/requestSubcategories";

const prefixed = (section: string, item: RequestSubcategory): RequestSubcategory => ({
  ...item,
  id: `${section}:${item.id}`,
});

const fromSections = (sections: string[]): RequestSubcategory[] =>
  sections.flatMap((section) => getSectionSubcategories(section).map((item) => prefixed(section, item)));

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
      return [];
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
