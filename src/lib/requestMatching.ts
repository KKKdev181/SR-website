import type { ServiceRequest } from "@/data/requests";

export type RequestIntent = "new" | "change" | "access" | "publish" | "retire" | "support";
export type RequestEnvironment = "Dev/QA" | "Staging/Production" | "DR" | "Any";
export type RequestArea = "infra" | "network" | "application" | "devops" | "data" | "any";

interface RequestClassification {
  intents: Set<RequestIntent>;
  environments: