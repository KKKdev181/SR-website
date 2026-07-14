import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

type Need = "create" | "change" | "publish" | "retire";
type Environment = "Dev/QA" | "Staging/Production" | "DR" | "Any";

const needOptions: Array<{ value: Need; en: string; ar: string }> = [
  { value: "create", en: "Create something new", ar: "إنشاء خدمة أو بيئة جديدة" },
  { value: "change", en: "Change something existing", ar: "تعديل خدمة أو إعداد موجود" },
  { value: "publish", en: "Publish a service", ar: "نشر خدمة" },
  { value: "retire", en: "Retire a service", ar: "إيقاف خدمة" },
];

const environmentOptions: Array<{ value: Environment; en: string; ar: string }> = [
  { value: "Dev/QA", en: "Dev/QA", ar: "Dev/QA" },
  { value: "Staging/Production", en: "Staging/Production", ar: "Staging/Production" },
  { value: "DR", en: "DR", ar: "DR" },
  { value: "Any", en: "Not sure / Any", ar: "غير متأكد / أي Environment" },
];

const needTerms: Record<Need, string[]> = {
  create: ["create", "new", "add", "provision", "setup", "register", "enable", "onboard", "creation", "environment", "server", "namespace", "domain", "account"],
  change: ["change", "update", "modify", "scale", "increase", "reduce", "expand", "configuration", "access", "renew", "replace", "upgrade", "resize"],
  publish: ["publish", "release", "go live", "external", "internal", "deployment", "rfc", "change request", "load balancer", "waf"],
  retire: ["retire", "decommission", "remove", "delete", "disable", "closure", "terminate"],
};

const searchableText = (request: ServiceRequest) =>
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
    .join(" ")
    .toLowerCase();

const scoreRequest = (request: ServiceRequest, need: Need, environment: Environment): number => {
  const text = searchableText(request);
  let score = 0;

  for (const term of needTerms[need]) {
    if (text.includes(term)) score += term.includes(" ") ? 4 : 2;
    if (request.title.toLowerCase().includes(term)) score += 3;
  }

  if (environment !== "Any") {
    if (request.environment === environment) score += 8;
    else if (text.includes(environment.toLowerCase())) score += 5;
    else if (request.environment && request.environment !== environment) score -= 4;
  }

  if (request.popular) score += 1;
  return score;
};

const GuidedWizard = () => {
  const [need, setNeed] = useState<Need | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";

  const results = useMemo(() => {
    if (!need || !environment) return [];

    const ranked = requests
      .map((request) => ({ request, score: scoreRequest(request, need, environment) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.request.title.localeCompare(b.request.title));

    // Always return useful recommendations from the complete workbook.
    if (ranked.length > 0) return ranked.slice(0, 9).map(({ request }) => request);

    return requests
      .filter((request) => environment === "Any" || !request.environment || request.environment === environment)
      .slice(0, 9);
  }, [need, environment]);

  const reset = () => {
    setNeed(null);
    setEnvironment(null);
  };

  const step = need ? 2 : 1;
  const complete = Boolean(need && environment);

  return (
    <div className="quick-match-tool">
      {!complete ? (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#0c66e4]">
            {copy.tools.questionProgress(step, 2)}
          </p>
          <h3 className="mb-5 text-xl font-bold text-[#172b4d]">
            {need
              ? isArabic ? "أي Environment؟" : "Which environment?"
              : isArabic ? "وش تحتاج؟" : "What do you need?"}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {(need ? environmentOptions : needOptions).map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="h-auto min-h-16 justify-start rounded-xl border-[#dfe1e6] bg-white px-5 py-4 text-start text-sm font-semibold text-[#172b4d] hover:border-[#0c66e4] hover:bg-[#e9f2ff]"
                onClick={() => {
                  if (need) setEnvironment(option.value as Environment);
                  else setNeed(option.value as Need);
                }}
              >
                {isArabic ? option.ar : option.en}
              </Button>
            ))}
          </div>

          {need && (
            <Button variant="ghost" className="mt-4" onClick={() => setNeed(null)}>
              {isArabic ? "رجوع" : "Back"}
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[#172b4d]">
                {copy.tools.recommended} ({results.length})
              </h3>
              <p className="mt-1 text-sm text-[#5e6c84]">
                {isArabic
                  ? `نتائج من جميع الطلبات الحالية بناءً على اختيارك.`
                  : "Results from the complete current request catalog based on your selections."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {copy.common.reset}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((request) => <RequestCard key={request.id} request={request} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedWizard;
