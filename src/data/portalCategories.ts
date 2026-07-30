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

const journeySteps: Array<{ step: number; titles: string[] }> = [
  { step: 1, titles: ["new service name adding", "name adding"] },
  {
    step: 2,
    titles: [
      "create new staging production server for project service",
      "create new staging production server",
    ],
  },
  {
    step: 3,
    titles: [
      "create new project ocp environment dev qa",
      "create new project product service in openshift",
    ],
  },
  { step: 4, titles: ["register domain"] },
  { step: 5, titles: ["order ssl certificate"] },
  { step: 6, titles: ["google captcha"] },
  { step: 7, titles: ["performance test request"] },
  {
    step: 8,
    titles: [
      "handover with application team and operation project manager",
      "handover with application team and operations project manager",
    ],
  },
  { step: 9, titles: ["new service publishing"] },
];

export const getNewProductStep = (request: ServiceRequest): number | undefined => {
  const normalizedTitle = normalize(request.title);
  return journeySteps.find(({ titles }) => titles.includes(normalizedTitle))?.step;
};

const isNewProductProject = (request: ServiceRequest) => getNewProductStep(request) !== undefined;
const sections = (...values: string[]) => (request: ServiceRequest) => values.includes(request.section);

export const portalCategories: PortalCategory[] = [
  { id: "new-product-project", en: "New Product/Project", ar: "منتج/مشروع جديد", matches: isNewProductProject },
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
