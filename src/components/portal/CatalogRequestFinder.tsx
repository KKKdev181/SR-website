import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

type Intent = "new" | "change" | "access" | "publish" | "support";
type Environment = "Dev/QA" | "Staging/Production" | "DR" | "Any";
type Area = "infra" | "network" | "application" | "devops" | "data" | "any";

interface Answers {
  intent?: Intent;
  environment?: Environment;
  area?: Area;
}

const intentOptions = [
  { value: "new" as const, en: "Create a new service, environment, or resource", ar: "إنشاء خدمة أو Environment أو مورد جديد" },
  { value: "change" as const, en: "Change or scale an existing service", ar: "تعديل أو توسعة خدمة موجودة" },
  { value: "access" as const, en: "Request access or permissions", ar: "طلب صلاحية أو وصول" },
  { value: "publish" as const, en: "Deploy, publish, or go live", ar: "Deployment أو نشر أو إطلاق الخدمة" },
  { value: "support" as const, en: "Get support or resolve an issue", ar: "طلب دعم أو حل مشكلة" },
];

const environmentOptions = [
  { value: "Dev/QA" as const, en: "Dev/QA", ar: "Dev/QA" },
  { value: "Staging/Production" as const, en: "Staging/Production", ar: "Staging/Production" },
  { value: "DR" as const, en: "DR", ar: "DR" },
  { value: "Any" as const, en: "Not sure / Any", ar: "غير متأكد / أي Environment" },
];

const areaOptions = [
  { value: "infra" as const, en: "Infrastructure, servers, or Cloud", ar: "Infrastructure أو Servers أو Cloud" },
  { value: "network" as const, en: "Network, DNS, security, or connectivity", ar: "Network أو DNS أو Security أو الاتصال" },
  { value: "application" as const, en: "Application, Database, or platform", ar: "Application أو Database أو Platform" },
  { value: "devops" as const, en: "DevOps, CI/CD, deployment, or Jira", ar: "DevOps أو CI/CD أو Deployment أو Jira" },
  { value: "data" as const, en: "BI, reports, UX, mobile, or business services", ar: "BI أو التقارير أو UX أو Mobile أو خدمات الأعمال" },
  { value: "any" as const, en: "Not sure", ar: "غير متأكد" },
];

const intentTerms: Record<Intent, string[]> = {
  new: ["create", "new", "add", "setup", "provision", "register", "enable", "onboard", "environment", "server", "namespace"],
  change: ["change", "update", "modify", "scale", "increase", "reduce", "expand", "upgrade", "renew", "configuration"],
  access: ["access", "permission", "privilege", "account", "user", "role", "whitelist", "connectivity"],
  publish: ["publish", "deployment", "release", "go live", "rfc", "change request", "waf", "load balancer", "external", "internal"],
  support: ["support", "issue", "incident", "help", "troubleshoot", "review", "report", "service request"],
};

const areaTerms: Record<Exclude<Area, "any">, string[]> = {
  infra: ["infrastructure", "hosting", "server", "vm", "cloud", "gcp", "openshift", "ocp", "storage", "backup"],
  network: ["network", "dns", "domain", "firewall", "vpn", "vlan", "connectivity", "security", "ssl", "certificate", "load balancer", "waf"],
  application: ["application", "database", "db", "platform", "api", "middleware", "mobile", "web"],
  devops: ["devops", "ci/cd", "pipeline", "repository", "jira", "deployment", "release", "bitbucket", "bamboo", "cloudbees"],
  data: ["bi", "analytics", "report", "dashboard", "ux", "ui", "mobile", "business", "bizops"],
};

const textFor = (request: ServiceRequest) =>
  [request.title, request.shortDescription, request.section, request.category, request.subSection, request.environment, ...request.keywords]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const score = (request: ServiceRequest, answers: Required<Answers>) => {
  const text = textFor(request);
  let value = 0;

  intentTerms[answers.intent].forEach((term) => {
    if (text.includes(term)) value += request.title.toLowerCase().includes(term) ? 5 : 2;
  });

  if (answers.environment !== "Any") {
    if (request.environment === answers.environment) value += 9;
    else if (text.includes(answers.environment.toLowerCase())) value += 5;
    else if (request.environment) value -= 3;
  }

  if (answers.area !== "any") {
    areaTerms[answers.area].forEach((term) => {
      if (text.includes(term)) value += request.section.toLowerCase().includes(term) ? 4 : 2;
    });
  }

  if (request.popular) value += 1;
  return value;
};

const CatalogRequestFinder = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const currentStep = answers.intent === undefined ? 0 : answers.environment === undefined ? 1 : answers.area === undefined ? 2 : 3;
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const results = useMemo(() => {
    if (currentStep < 3) return [];
    const complete = answers as Required<Answers>;
    const ranked = requests
      .map((request) => ({ request, score: score(request, complete) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.request.title.localeCompare(b.request.title));

    return (ranked.length ? ranked.map((item) => item.request) : requests).slice(0, 12);
  }, [answers, currentStep]);

  const reset = () => setAnswers({});
  const back = () => {
    if (currentStep === 2) setAnswers(({ intent, environment }) => ({ intent, environment }));
    else if (currentStep === 1) setAnswers(({ intent }) => ({ intent }));
  };

  const options = currentStep === 0 ? intentOptions : currentStep === 1 ? environmentOptions : areaOptions;
  const question = currentStep === 0
    ? isArabic ? "ما الذي تريد تنفيذه؟" : "What are you trying to do?"
    : currentStep === 1
      ? isArabic ? "ما هو الـ Environment؟" : "Which environment is involved?"
      : isArabic ? "أي مجال أقرب لطلبك؟" : "Which area best matches your need?";

  if (currentStep === 3) {
    return (
      <div className="catalog-request-finder">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[#172b4d]">{copy.tools.recommended} ({results.length})</h3>
            <p className="mt-1 text-sm text-[#5e6c84]">
              {isArabic ? "تمت المطابقة مع جميع الطلبات الحالية في الكتالوج." : "Matched against every request currently available in the catalog."}
            </p>
          </div>
          <Button variant="outline" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4" />{copy.common.reset}</Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((request) => <RequestCard key={request.id} request={request} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-request-finder">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
            {isArabic ? `السؤال ${currentStep + 1} من 3` : `Question ${currentStep + 1} of 3`}
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#172b4d]">{question}</h3>
        </div>
        {currentStep > 0 && (
          <Button variant="ghost" onClick={back} className="gap-2"><BackIcon className="h-4 w-4" />{isArabic ? "رجوع" : "Back"}</Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className="h-auto min-h-20 justify-start rounded-xl border-[#dfe1e6] bg-white px-5 py-4 text-start text-sm font-semibold text-[#172b4d] hover:border-violet-500 hover:bg-violet-50"
            onClick={() => {
              if (currentStep === 0) setAnswers({ intent: option.value as Intent });
              else if (currentStep === 1) setAnswers((current) => ({ ...current, environment: option.value as Environment }));
              else setAnswers((current) => ({ ...current, area: option.value as Area }));
            }}
          >
            {isArabic ? option.ar : option.en}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CatalogRequestFinder;
