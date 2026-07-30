import type { ServiceRequest } from "@/data/requests";

export type PortalCategoryId =
  | "all"
  | "new-product-project"
  | "infrastructure"
  | "applications"
  | "network"
  | "access"
  | "data-analytics"
  | "business-services"
  | "ux-development";

export interface PortalCategory {
  id: PortalCategoryId;
  en: string;
  ar: string;
  matches: (request: ServiceRequest) => boolean;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const newProductJourney: Array<{ step: number; keywords: string[] }> = [
  { step: 1, keywords: ["name adding", "add name", "service name"] },
  { step: 2, keywords: ["create new staging production server", "staging production server", "new server"] },
  { step: 3, keywords: ["create new project ocp environment", "ocp environment", "openshift environment", "new project product service in openshift"] },
  { step: 4, keywords: ["register domain", "domain registration"] },
  { step: 5, keywords: ["order ssl certificate", "ssl certificate"] },
  { step: 6, keywords: ["google captcha", "captcha"] },
  { step: 7, keywords: ["performance test request", "performance testing"] },
  { step: 8, keywords: ["handover with application team", "handover", "knowledge transfer", "kt session"] },
  { step: 9, keywords: ["new service publishing", "publish service", "service publishing"] },
];

export const getNewProductStep = (request: ServiceRequest): number | undefined => {
  const value = normalize(`${request.title} ${request.shortDescription} ${request.category}`);
  return newProductJourney.find(({ keywords }) => keywords.some((keyword) => value.includes(keyword)))?.step;
};

const isNewProductProject = (request: ServiceRequest) => getNewProductStep(request) !== undefined;

const sections = (...values: string[]) => (request: ServiceRequest) => values.includes(request.section);

export const portalCategories: PortalCategory[] = [
  {
    id: "new-product-project",
    en: "New Product/Project",
    ar: "منتج/مشروع جديد",
    matches: isNewProductProject,
  },
  {
    id: "infrastructure",
    en: "Infrastructure",
    ar: "البنية التحتية",
    matches: (request) =>
      !isNewProductProject(request) &&
      sections("Infrastructure & Hosting", "Storage & Backup", "Platform & Cloud Services")(request),
  },
  {
    id: "applications",
    en: "Applications",
    ar: "التطبيقات",
    matches: (request) =>
      !isNewProductProject(request) &&
      sections("Application Lifecycle", "Application & Database", "DevOps & Software Delivery")(request),
  },
  {
    id: "network",
    en: "Network",
    ar: "الشبكات",
    matches: (request) => !isNewProductProject(request) && request.section === "Network & Connectivity",
  },
  {
    id: "access",
    en: "Access",
    ar: "الصلاحيات",
    matches: (request) => !isNewProductProject(request) && request.section === "Access & Privileges",
  },
  {
    id: "data-analytics",
    en: "Data & Analytics",
    ar: "البيانات والتحليلات",
    matches: (request) => !isNewProductProject(request) && request.section === "BI, Analytics & Reporting",
  },
  {
    id: "business-services",
    en: "Business Services",
    ar: "خدمات الأعمال",
    matches: (request) =>
      !isNewProductProject(request) &&
      sections("Business Operations", "Jira & Amer", "General Services", "General Help")(request),
  },
  {
    id: "ux-development",
    en: "UX/UI & Development",
    ar: "UX/UI والتطوير",
    matches: (request) => !isNewProductProject(request) && request.section === "UX, Web & Mobile",
  },
];

export const getPortalCategory = (request: ServiceRequest) =>
  portalCategories.find((category) => category.matches(request));
