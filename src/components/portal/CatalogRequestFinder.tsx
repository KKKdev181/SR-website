import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Cloud,
  Database,
  GitBranch,
  KeyRound,
  Network,
  RotateCcw,
  SearchCheck,
  Settings,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import {
  matchRequests,
  type RequestArea,
  type RequestEnvironment,
  type RequestIntent,
} from "@/lib/requestMatching";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Answers {
  intent?: RequestIntent;
  environment?: RequestEnvironment;
  area?: RequestArea;
}

const intentOptions = [
  {
    value: "new" as const,
    en: "Create something new",
    ar: "إنشاء خدمة أو مورد جديد",
    descriptionEn: "New service, server, environment, platform, account, or technical resource.",
    descriptionAr: "خدمة أو Server أو Environment أو Platform أو حساب أو مورد تقني جديد.",
  },
  {
    value: "change" as const,
    en: "Change or scale something existing",
    ar: "تعديل أو توسعة خدمة موجودة",
    descriptionEn: "Update, scale, migrate, patch, renew, or change an existing service.",
    descriptionAr: "تحديث أو زيادة موارد أو Migration أو Patch أو تجديد أو تعديل خدمة حالية.",
  },
  {
    value: "access" as const,
    en: "Request access or permissions",
    ar: "طلب صلاحية أو وصول",
    descriptionEn: "User access, privileged access, VPN, connectivity, whitelist, or account permissions.",
    descriptionAr: "صلاحيات مستخدم أو Privileged Access أو VPN أو Connectivity أو Whitelist أو حساب.",
  },
  {
    value: "publish" as const,
    en: "Deploy, publish, or go live",
    ar: "Deployment أو نشر أو إطلاق الخدمة",
    descriptionEn: "Deployment, publishing, DNS, SSL, WAF, Load Balancer, or release activities.",
    descriptionAr: "Deployment أو نشر أو DNS أو SSL أو WAF أو Load Balancer أو Release.",
  },
  {
    value: "retire" as const,
    en: "Retire or decommission a service",
    ar: "إيقاف أو Decommission للخدمة",
    descriptionEn: "Retire, close, remove, or decommission an existing service or resource.",
    descriptionAr: "إيقاف أو إغلاق أو إزالة أو Decommission لخدمة أو مورد موجود.",
  },
  {
    value: "support" as const,
    en: "Get support or resolve an issue",
    ar: "طلب دعم أو حل مشكلة",
    descriptionEn: "Troubleshooting, consultation, review, report, assessment, or general support.",
    descriptionAr: "Troubleshooting أو استشارة أو مراجعة أو تقرير أو Assessment أو دعم عام.",
  },
];

const environmentOptions = [
  {
    value: "Dev/QA" as const,
    en: "Dev/QA",
    ar: "Dev/QA",
    descriptionEn: "Development and testing environment only.",
    descriptionAr: "بيئة التطوير والاختبار فقط.",
  },
  {
    value: "Staging/Production" as const,
    en: "Staging/Production",
    ar: "Staging/Production",
    descriptionEn: "Pre-production or live production environment.",
    descriptionAr: "بيئة ما قبل الإطلاق أو Production.",
  },
  {
    value: "DR" as const,
    en: "DR",
    ar: "DR",
    descriptionEn: "Disaster recovery environment or DR site.",
    descriptionAr: "بيئة أو موقع DR.",
  },
  {
    value: "Any" as const,
    en: "Not environment-specific",
    ar: "لا يرتبط بـ Environment محدد",
    descriptionEn: "Choose this for requests that apply generally or when you are not sure.",
    descriptionAr: "اختر هذا للطلبات العامة أو إذا لم تكن متأكدًا.",
  },
];

const areaOptions = [
  { value: "infra" as const, en: "Infrastructure, Hosting & Storage", ar: "البنية التحتية والاستضافة والتخزين", icon: Cloud },
  { value: "network" as const, en: "Network & Connectivity", ar: "الشبكات والاتصال", icon: Network },
  { value: "access" as const, en: "Access & Privileges", ar: "الصلاحيات والوصول", icon: KeyRound },
  { value: "application" as const, en: "Application & Database", ar: "التطبيقات وقواعد البيانات", icon: Database },
  { value: "devops" as const, en: "DevOps, Jira & Software Delivery", ar: "DevOps وJira وتسليم البرمجيات", icon: GitBranch },
  { value: "data" as const, en: "BI, Analytics, UX & Mobile", ar: "BI والتحليلات وUX والجوال", icon: Smartphone },
  { value: "business" as const, en: "Business Operations", ar: "عمليات الأعمال", icon: BriefcaseBusiness },
  { value: "general" as const, en: "General Services & Support", ar: "الخدمات العامة والدعم", icon: Settings },
  { value: "any" as const, en: "Not sure", ar: "غير متأكد", icon: SearchCheck },
];

const CatalogRequestFinder = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const currentStep =
    answers.intent === undefined
      ? 0
      : answers.environment === undefined
        ? 1
        : answers.area === undefined
          ? 2
          : 3;
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const results = useMemo(() => {
    if (currentStep < 3) return [];
    const complete = answers as Required<Answers>;
    return matchRequests(requests, {
      intent: complete.intent,
      environment: complete.environment,
      area: complete.area,
      limit: 18,
    });
  }, [answers, currentStep]);

  const reset = () => setAnswers({});
  const back = () => {
    if (currentStep === 3) setAnswers(({ intent, environment }) => ({ intent, environment }));
    else if (currentStep === 2) setAnswers(({ intent, environment }) => ({ intent, environment }));
    else if (currentStep === 1) setAnswers(({ intent }) => ({ intent }));
  };

  const question =
    currentStep === 0
      ? isArabic
        ? "ما الإجراء الذي تحتاجه؟"
        : "What do you need to do?"
      : currentStep === 1
        ? isArabic
          ? "أي Environment يتعلق به الطلب؟"
          : "Which environment does this request affect?"
        : isArabic
          ? "أي مجال تقني مسؤول عن الطلب؟"
          : "Which technology area owns this request?";

  const helper =
    currentStep === 0
      ? isArabic
        ? "اختر الهدف الرئيسي من الطلب. ستظهر لك الخيارات المتوافقة فقط في الخطوات التالية."
        : "Choose the main outcome you need. The next steps will narrow the catalog to relevant requests only."
      : currentStep === 1
        ? isArabic
          ? "اختر Environment بدقة حتى لا تظهر طلبات خاصة ببيئة مختلفة."
          : "Select the environment carefully so requests for other environments are excluded."
        : isArabic
          ? "اختر الفريق أو المجال الأقرب لطلبك. يمكنك اختيار غير متأكد عند الحاجة."
          : "Choose the team or domain closest to your request. Select Not sure when needed.";

  if (currentStep === 3) {
    return (
      <div className="catalog-request-finder" dir={isArabic ? "rtl" : "ltr"}>
        <div className="mb-5 rounded-xl border border-[#b3d4ff] bg-[#e9f2ff] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#0c66e4]">
                {isArabic ? "النتيجة المقترحة" : "Recommended result"}
              </p>
              <h3 className="mt-1 text-xl font-bold text-[#172b4d]">
                {copy.tools.recommended} ({results.length})
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#44546f]">
                {isArabic
                  ? "تمت مطابقة الطلبات باستخدام نوع الإجراء والـ Environment والمجال التقني. تظهر فقط الطلبات التي تحتوي على رابط صالح."
                  : "Requests were matched using the selected action, environment, and technology area. Only requests with a valid link are shown."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={back} className="gap-2 bg-white">
                <BackIcon className="h-4 w-4" />
                {isArabic ? "تعديل آخر اختيار" : "Change last answer"}
              </Button>
              <Button variant="outline" onClick={reset} className="gap-2 bg-white">
                <RotateCcw className="h-4 w-4" />
                {copy.common.reset}
              </Button>
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#dfe1e6] bg-white p-6 text-center">
            <SearchCheck className="mx-auto h-9 w-9 text-[#7a869a]" />
            <h4 className="mt-3 font-bold text-[#172b4d]">
              {isArabic ? "لا توجد مطابقة دقيقة" : "No exact match found"}
            </h4>
            <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-[#5e6c84]">
              {isArabic
                ? "ارجع وعدّل المجال أو اختر غير متأكد. لن نعرض طلبات من Environment مختلف أو طلبات بدون رابط."
                : "Go back and change the area or select Not sure. Requests from another environment and requests without links are not shown."}
            </p>
          </div>
        )}
      </div>
    );
  }

  const options = currentStep === 0 ? intentOptions : currentStep === 1 ? environmentOptions : areaOptions;

  return (
    <div className="catalog-request-finder" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mb-6 border-b border-[#dfe1e6] pb-5">
        <div className="mb-4 flex items-center gap-2" aria-label={isArabic ? "تقدم الأسئلة" : "Question progress"}>
          {[0, 1, 2].map((step) => (
            <span
              key={step}
              className={`h-1.5 flex-1 rounded-full ${step <= currentStep ? "bg-[#0c66e4]" : "bg-[#dfe1e6]"}`}
            />
          ))}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#0c66e4]">
              {isArabic ? `السؤال ${currentStep + 1} من 3` : `Question ${currentStep + 1} of 3`}
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#172b4d] sm:text-2xl">{question}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5e6c84]">{helper}</p>
          </div>
          {currentStep > 0 && (
            <Button variant="ghost" onClick={back} className="shrink-0 gap-2">
              <BackIcon className="h-4 w-4" />
              {isArabic ? "رجوع" : "Back"}
            </Button>
          )}
        </div>
      </div>

      <div className={`grid gap-3 ${currentStep === 2 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((option) => {
          const Icon = "icon" in option ? option.icon : null;
          const description = "descriptionEn" in option
            ? isArabic
              ? option.descriptionAr
              : option.descriptionEn
            : undefined;

          return (
            <button
              key={option.value}
              type="button"
              className="group min-h-24 rounded-xl border border-[#dfe1e6] bg-white p-4 text-start transition hover:-translate-y-0.5 hover:border-[#0c66e4] hover:bg-[#f7fbff] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/35"
              onClick={() => {
                if (currentStep === 0) setAnswers({ intent: option.value as RequestIntent });
                else if (currentStep === 1) {
                  setAnswers((current) => ({ ...current, environment: option.value as RequestEnvironment }));
                } else {
                  setAnswers((current) => ({ ...current, area: option.value as RequestArea }));
                }
              }}
            >
              <div className="flex items-start gap-3">
                {Icon && (
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#0c66e4] group-hover:bg-[#0c66e4] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0">
                  <span className="block text-sm font-bold leading-6 text-[#172b4d]">
                    {isArabic ? option.ar : option.en}
                  </span>
                  {description && (
                    <span className="mt-1 block text-xs leading-5 text-[#5e6c84]">{description}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogRequestFinder;
