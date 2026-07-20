import type { ServiceRequest } from "@/data/requests";

export type RequestIntent = "new" | "change" | "access" | "publish" | "retire" | "support";
export type RequestEnvironment = "Dev/QA" | "Staging/Production" | "DR" | "Any";
export type RequestArea =
  | "infra"
  | "network"
  | "access"
  | "application"
  | "devops"
  | "data"
  | "business"
  | "general"
  | "any";

interface RequestClassification {
  intents: Set<RequestIntent>;
  environments: Set<Exclude<RequestEnvironment, "Any">>;
  areas: Set<Exclude<RequestArea, "any">>;
  environmentSpecific: boolean;
}

export interface MatchCriteria {
  intent: RequestIntent;
  environment: RequestEnvironment;
  area?: RequestArea;
  limit?: number;
}

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text: string, terms: readonly string[]): boolean =>
  terms.some((term) => text.includes(term));

const linkedRequest = (request: ServiceRequest): boolean => {
  const url = request.jiraUrl?.trim();
  return Boolean(url && url !== "#" && url !== "about:blank");
};

const INTENT_SIGNALS: Record<RequestIntent, readonly string[]> = {
  new: [
    "create",
    "new ",
    "add new",
    "adding",
    "provision",
    "register",
    "onboarding",
    "order ",
    "request new",
    "enable new",
  ],
  change: [
    "change",
    "update",
    "modify",
    "scale",
    "increase",
    "decrease",
    "reduce",
    "expand",
    "renew",
    "rename",
    "configuration",
    "patch",
    "upgrade",
    "migration",
    "move ",
    "transfer",
  ],
  access: [
    "access",
    "permission",
    "privilege",
    "account",
    "user",
    "whitelist",
    "allowlist",
    "connectivity",
    "vpn",
  ],
  publish: [
    "publish",
    "publishing",
    "deployment",
    "deploy",
    "release",
    "go live",
    "ssl certificate",
    "dns",
    "load balancer",
    "waf",
  ],
  retire: ["retire", "retirement", "decommission", "closure", "terminate", "remove service", "delete service"],
  support: [
    "support",
    "help",
    "troubleshoot",
    "incident",
    "issue",
    "review",
    "consultation",
    "clarification",
    "report",
    "assessment",
    "test request",
    "service request",
  ],
};

const classifyIntents = (request: ServiceRequest, title: string, text: string): Set<RequestIntent> => {
  const intents = new Set<RequestIntent>();

  (Object.keys(INTENT_SIGNALS) as RequestIntent[]).forEach((intent) => {
    if (includesAny(title, INTENT_SIGNALS[intent])) intents.add(intent);
  });

  // Description signals are useful, but only after the stronger title-based classification.
  if (intents.size === 0) {
    (Object.keys(INTENT_SIGNALS) as RequestIntent[]).forEach((intent) => {
      if (includesAny(text, INTENT_SIGNALS[intent])) intents.add(intent);
    });
  }

  // Section-based defaults ensure every linked catalog item is reachable without
  // incorrectly treating every unclassified item as generic support.
  if (intents.size === 0) {
    if (request.section === "Access & Privileges") intents.add("access");
    else if (request.section === "Application Lifecycle") intents.add("change");
    else if (request.section === "General Help") intents.add("support");
    else if (request.section === "General Services") intents.add("support");
    else intents.add("new");
  }

  return intents;
};

const classifyEnvironments = (
  request: ServiceRequest,
  text: string,
): Pick<RequestClassification, "environments" | "environmentSpecific"> => {
  const environments = new Set<Exclude<RequestEnvironment, "Any">>();

  if (request.environment === "Dev/QA") environments.add("Dev/QA");
  if (request.environment === "Staging/Production") environments.add("Staging/Production");
  if (request.environment === "DR") environments.add("DR");

  if (includesAny(text, ["dev/qa", "dev qa", "development and testing", "development environment", "qa environment"])) {
    environments.add("Dev/QA");
  }
  if (includesAny(text, ["staging/production", "staging and production", "staging or production", "production environment"])) {
    environments.add("Staging/Production");
  }
  if (/(^| )dr( |$)/.test(text) || text.includes("disaster recovery")) environments.add("DR");

  return { environments, environmentSpecific: environments.size > 0 };
};

const classifyAreas = (request: ServiceRequest, text: string): Set<Exclude<RequestArea, "any">> => {
  const areas = new Set<Exclude<RequestArea, "any">>();

  switch (request.section) {
    case "Infrastructure & Hosting":
    case "Storage & Backup":
    case "Platform & Cloud Services":
      areas.add("infra");
      break;
    case "Network & Connectivity":
      areas.add("network");
      break;
    case "Access & Privileges":
      areas.add("access");
      break;
    case "Application Lifecycle":
    case "Application & Database":
      areas.add("application");
      break;
    case "DevOps & Software Delivery":
    case "Jira & Amer":
      areas.add("devops");
      break;
    case "BI, Analytics & Reporting":
    case "UX, Web & Mobile":
      areas.add("data");
      break;
    case "Business Operations":
      areas.add("business");
      break;
    case "General Help":
    case "General Services":
      areas.add("general");
      break;
  }

  // Some access requests are easier to find through their technical domain too.
  if (request.section === "Access & Privileges") {
    if (includesAny(text, ["firewall", "network", "vpn", "remote", "ip ", "dns"])) areas.add("network");
    if (includesAny(text, ["database", " db ", "application", "kibana"])) areas.add("application");
    if (includesAny(text, ["devops", "devsecops", "monitoring", "ucmdb", "jira"])) areas.add("devops");
    if (includesAny(text, ["server", "vm", "cloud", "openshift", "ocp"])) areas.add("infra");
  }

  return areas;
};

const classifyRequest = (request: ServiceRequest): RequestClassification => {
  const title = normalize(request.title);
  const text = normalize(
    [
      request.title,
      request.shortDescription,
      request.section,
      request.category,
      request.subSection,
      request.environment,
      ...request.keywords,
    ]
      .filter(Boolean)
      .join(" "),
  );

  const intents = classifyIntents(request, title, text);
  const { environments, environmentSpecific } = classifyEnvironments(request, text);
  const areas = classifyAreas(request, text);

  return { intents, environments, areas, environmentSpecific };
};

const scoreMatch = (
  request: ServiceRequest,
  classification: RequestClassification,
  criteria: MatchCriteria,
): number => {
  const title = normalize(request.title);
  let score = request.popular ? 3 : 0;

  if (includesAny(title, INTENT_SIGNALS[criteria.intent])) score += 18;
  if (criteria.area && criteria.area !== "any" && classification.areas.has(criteria.area)) score += 12;

  if (criteria.environment !== "Any") {
    if (classification.environments.has(criteria.environment)) score += 16;
    else if (!classification.environmentSpecific) score += 1;
  } else if (!classification.environmentSpecific) {
    score += 3;
  }

  return score;
};

export const matchRequests = (catalog: ServiceRequest[], criteria: MatchCriteria): ServiceRequest[] =>
  catalog
    .filter(linkedRequest)
    .map((request) => ({ request, classification: classifyRequest(request) }))
    .filter(({ classification }) => {
      if (!classification.intents.has(criteria.intent)) return false;
      if (criteria.area && criteria.area !== "any" && !classification.areas.has(criteria.area)) return false;

      // A selected environment must never return a request explicitly classified
      // for another environment. Environment-neutral requests may still appear
      // because they can apply across the lifecycle.
      if (
        criteria.environment !== "Any" &&
        classification.environmentSpecific &&
        !classification.environments.has(criteria.environment)
      ) {
        return false;
      }

      return true;
    })
    .map(({ request, classification }) => ({
      request,
      score: scoreMatch(request, classification, criteria),
    }))
    .sort((a, b) => b.score - a.score || a.request.title.localeCompare(b.request.title))
    .slice(0, criteria.limit ?? 18)
    .map(({ request }) => request);
