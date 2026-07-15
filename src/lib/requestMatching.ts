import type { ServiceRequest } from "@/data/requests";

export type RequestIntent = "new" | "change" | "access" | "publish" | "retire" | "support";
export type RequestEnvironment = "Dev/QA" | "Staging/Production" | "DR" | "Any";
export type RequestArea = "infra" | "network" | "application" | "devops" | "data" | "any";

interface RequestClassification {
  intents: Set<RequestIntent>;
  environments: Set<Exclude<RequestEnvironment, "Any">>;
  areas: Set<Exclude<RequestArea, "any">>;
  text: string;
}

export interface MatchCriteria {
  intent: RequestIntent;
  environment: RequestEnvironment;
  area?: RequestArea;
  limit?: number;
}

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9/]+/g, " ").replace(/\s+/g, " ").trim();
const hasAny = (text: string, terms: string[]): boolean => terms.some((term) => text.includes(term));

const classifyRequest = (request: ServiceRequest): RequestClassification => {
  const title = normalize(request.title);
  const text = normalize([
    request.title,
    request.shortDescription,
    request.section,
    request.category,
    request.subSection,
    request.environment,
    ...request.keywords,
  ].filter(Boolean).join(" "));

  const intents = new Set<RequestIntent>();
  const environments = new Set<Exclude<RequestEnvironment, "Any">>();
  const areas = new Set<Exclude<RequestArea, "any">>();

  if (hasAny(title, ["create", "new ", "register", "order", "onboarding", "adding", "provision"])) intents.add("new");
  if (hasAny(title, ["change", "update", "modify", "scale", "increase", "reduce", "expand", "renew", "rename", "configuration", "patching exception"])) intents.add("change");
  if (hasAny(title, ["access", "permission", "privilege", "account", "user", "whitelist", "connectivity"])) intents.add("access");
  if (hasAny(title, ["publish", "publishing", "release", "deployment", "minor change"])) intents.add("publish");
  if (hasAny(title, ["retire", "retirement", "decommission", "closure", "terminate"])) intents.add("retire");
  if (hasAny(title, ["support", "troubleshooting", "clarification", "consultation", "help", "review", "report", "services request", "service requests"])) intents.add("support");

  if (intents.size === 0) {
    if (hasAny(text, ["grant access", "user access", "permission"])) intents.add("access");
    else if (hasAny(text, ["publish", "go live", "release related"])) intents.add("publish");
    else if (hasAny(text, ["create", "new service", "new environment", "provision"])) intents.add("new");
    else intents.add("support");
  }

  if (request.environment === "Dev/QA" || hasAny(text, ["dev/qa", "dev qa", "development and testing", "qa cloud", "dev environment", "qa environment"])) environments.add("Dev/QA");
  if (request.environment === "Staging/Production" || hasAny(text, ["staging/production", "staging and production", "staging or production", "production environment"])) environments.add("Staging/Production");
  if (request.environment === "DR" || /(^| )dr( |$)/.test(text) || text.includes("disaster recovery")) environments.add("DR");

  // Known prerequisites that are specifically used to establish Dev/QA.
  if (hasAny(title, ["create name space in iaas", "create namespace in iaas", "project ocp environment (dev/qa)", "corporate (dev, qa) access", "dev/qa compliance"])) {
    environments.add("Dev/QA");
  }

  // Production-only requests should not appear under Dev/QA.
  if (hasAny(title, ["production access", "new staging/production", "service design change for production", "communication provisioning for staging & production"])) {
    environments.add("Staging/Production");
  }

  const section = request.section;
  if (["Infrastructure & Hosting", "Storage & Backup", "Platform & Cloud Services"].includes(section)) areas.add("infra");
  if (section === "Network & Connectivity") areas.add("network");
  if (["Application Lifecycle", "Application & Database"].includes(section)) areas.add("application");
  if (["DevOps & Software Delivery", "Jira & Amer"].includes(section)) areas.add("devops");
  if (["BI, Analytics & Reporting", "UX, Web & Mobile", "Business Operations"].includes(section)) areas.add("data");

  if (section === "Access & Privileges") {
    if (hasAny(text, ["vpn", "network", "firewall", "remote access"])) areas.add("network");
    if (hasAny(text, ["database", "db", "application", "kibana"])) areas.add("application");
    if (hasAny(text, ["devsecops", "monitoring", "ucmdb"])) areas.add("devops");
    if (areas.size === 0) areas.add("infra");
  }

  return { intents, environments, areas, text };
};

const scoreMatch = (request: ServiceRequest, classification: RequestClassification, criteria: MatchCriteria): number => {
  let score = 0;
  if (classification.intents.has(criteria.intent)) score += 40;
  if (criteria.environment !== "Any" && classification.environments.has(criteria.environment)) score += 35;
  if (criteria.area && criteria.area !== "any" && classification.areas.has(criteria.area)) score += 25;
  if (request.popular) score += 2;

  const title = normalize(request.title);
  const titleSignals: Record<RequestIntent, string[]> = {
    new: ["create", "new", "register", "order", "adding"],
    change: ["change", "update", "modify", "scale", "increase", "reduce", "expand", "renew"],
    access: ["access", "permission", "privilege", "account", "connectivity"],
    publish: ["publish", "publishing", "release", "deployment"],
    retire: ["retire", "retirement", "decommission"],
    support: ["support", "troubleshooting", "clarification", "consultation", "help"],
  };
  if (hasAny(title, titleSignals[criteria.intent])) score += 10;
  return score;
};

export const matchRequests = (catalog: ServiceRequest[], criteria: MatchCriteria): ServiceRequest[] => {
  const classified = catalog.map((request) => ({ request, classification: classifyRequest(request) }));

  const strict = classified.filter(({ classification }) => {
    if (!classification.intents.has(criteria.intent)) return false;
    if (criteria.environment !== "Any" && !classification.environments.has(criteria.environment)) return false;
    if (criteria.area && criteria.area !== "any" && !classification.areas.has(criteria.area)) return false;
    return true;
  });

  // Relax only the area when the exact area produces no matches. Never relax a selected Environment.
  const candidates = strict.length > 0
    ? strict
    : classified.filter(({ classification }) =>
        classification.intents.has(criteria.intent) &&
        (criteria.environment === "Any" || classification.environments.has(criteria.environment))
      );

  return candidates
    .map(({ request, classification }) => ({ request, score: scoreMatch(request, classification, criteria) }))
    .sort((a, b) => b.score - a.score || a.request.title.localeCompare(b.request.title))
    .slice(0, criteria.limit ?? 9)
    .map(({ request }) => request);
};
