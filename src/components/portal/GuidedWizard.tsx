import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import { matchRequests, type RequestEnvironment, type RequestIntent } from "@/lib/requestMatching";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";

type Need = "create" | "change" | "publish" | "retire";
type Environment = RequestEnvironment;

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

const intentMap: Record<Need, RequestIntent> = {
  create: "new",
  change: "change",
  publish: "publish",
  retire: "retire",
};

const GuidedWizard = () => {
  const [need, setNeed] = useState<Need | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";

  const results = useMemo(() => {
    if (!need || !environment) return [];
    return matchRequests(requests, {
      intent: intentMap[need],
      environment,
      limit: 9,
    });
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
                  ? "النتائج مطابقة لنوع الطلب والـ Environment الذي اخترته."
                  : "Results match both the selected request type and environment."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {copy.common.reset}
            </Button>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((request) => <RequestCard key={request.id} request={request} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-[#dfe1e6] bg-[#f7f8f9] p-5 text-sm text-[#5e6c84]">
              {isArabic
                ? "لا توجد طلبات مطابقة تماماً لهذه الخيارات. جرّب اختيار Environment آخر أو اختر غير متأكد."
                : "No requests exactly match these selections. Try another environment or choose Not sure / Any."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidedWizard;
