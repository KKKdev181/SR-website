import rows1 from "./requestRows1";
import rows2 from "./requestRows2";
import rows3 from "./requestRows3";
import rows4 from "./requestRows4";

export interface ServiceRequest {
  id: string;
  title: string;
  section: string;
  subSection?: string;
  environment?: string;
  category: string;
  shortDescription: string;
  deliveryTime?: string;
  keywords: string[];
  jiraUrl: string;
  popular?: boolean;
  icon?: string;
}

type SourceRow = readonly [string, string, string, string, string];
const sourceRows: SourceRow[] = [...rows1, ...rows2, ...rows3, ...rows4];

export const sourceWorkbookRowCount = sourceRows.length;

export const SERVICE_SECTIONS = [
  "General Help",
  "Infrastructure & Hosting",
  "Storage & Backup",
  "Network & Connectivity",
  "Access & Privileges",
  "Platform & Cloud Services",
  "Application Lifecycle",
  "Application & Database",
  "DevOps & Software Delivery",
  "Jira & Amer",
  "BI, Analytics & Reporting",
  "UX, Web & Mobile",
  "Business Operations",
  "General Services",
] as const;

export const SERVICE_CATEGORIES = [
  "Internal Technology Requests",
  "Products and Projects Requests",
  "General IT Operations Services",
  "Platform services (Jira, HPSM, Cloud NativeServices)",
  "Network & Security",
  "User Access Management",
  "BizOps",
  "BI Service Request",
  "DevOps Platform Services",
  "Mobile App Requests",
  "UXUI Request",
] as const;

const popularRequests = new Set([
  "Access Provisioning: Communication Provisioning for Staging & Production",
  "Scale Up: Add New Server",
  "Scale Up: Add CPU, RAM, or Storage",
  "Create New Project OCP Environment (DEV/QA)",
  "New DNS  (New | Update DNS)",
  "Order SSL Certificate",
]);

const getEnvironment = (text: string): string | undefined => {
  const value = text.toLowerCase();
  if (value.includes("dev/qa") || value.includes("dev qa")) return "Dev/QA";
  if (value.includes("staging/production") || (value.includes("staging") && value.includes("production"))) {
    return "Staging/Production";
  }
  if (/\bdr\b/.test(value)) return "DR";
  return undefined;
};

const getId = (title: string, index: number) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "request"}-${index + 1}`;

export const requests: ServiceRequest[] = sourceRows.map(
  ([group, title, description, category, jiraUrl], index) => ({
    id: getId(title, index),
    title,
    section: group,
    subSection: category,
    environment: getEnvironment(`${title} ${description}`),
    category,
    shortDescription: description || `Submit a ${title} request.`,
    keywords: `${title} ${description} ${group} ${category}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    jiraUrl,
    popular: popularRequests.has(title),
  }),
);

export const sections = SERVICE_SECTIONS;
export const environmentFilters = ["Dev/QA", "Staging/Production", "DR"] as const;
export const categoryFilters = SERVICE_CATEGORIES;
export const quickFilters = SERVICE_SECTIONS;

export const sectionIcons: Record<string, string> = {
  "General Help": "CircleHelp",
  "Infrastructure & Hosting": "Server",
  "Storage & Backup": "Database",
  "Network & Connectivity": "Network",
  "Access & Privileges": "KeyRound",
  "Platform & Cloud Services": "Cloud",
  "Application Lifecycle": "RefreshCw",
  "Application & Database": "AppWindow",
  "DevOps & Software Delivery": "GitBranch",
  "Jira & Amer": "TicketCheck",
  "BI, Analytics & Reporting": "BarChart3",
  "UX, Web & Mobile": "Smartphone",
  "Business Operations": "BriefcaseBusiness",
  "General Services": "Settings",
};

export const sectionDescriptions: Record<string, { title: string; description: string }> = Object.fromEntries(
  SERVICE_SECTIONS.map((title) => [
    title,
    {
      title,
      description: `Browse all ${title.toLowerCase()} service requests from the approved classification workbook.`,
    },
  ]),
);
