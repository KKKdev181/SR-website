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
import { requests, type ServiceRequest } from "@/data/requests";
import {
  matchRequests,
  type RequestArea,
  type RequestEnvironment,
  type RequestIntent,
} from "@/lib/requestMatching";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";

type PurposeKey =
  | "service-environment"
  | "server-resource"
  | "platform-devops"
  | "application-database"
  | "network-connectivity"
  | "user-access"
  | "privileged-access"
  | "system-account"
  | "remote-connectivity"
  | "scale-resource"
  | "configuration-change"
  | "patch-upgrade"
  | "migration"
  | "internal-publish"
  | "external-publish"
  | "dns-certificate"
  | "deployment-release"
  | "technical-support"
  | "review-assessment"
  | "report-consultation"
  | "general-support";

interface Answers {
  intent?: RequestIntent;
  purpose?: PurposeKey;
  environment?: RequestEnvironment;
  area?: RequestArea;
}

interface PurposeOption {
  value: PurposeKey;
  intents: RequestIntent[];
  en: string;
  ar: string;
  descriptionEn: string;
  descriptionAr: string;
  terms: string[];
  areas?: RequestArea[];
  environmentQuestion?: boolean;
}

const intentOptions = [
  {
    value: "new" as const,
    en: "Create something new",
    ar: "إنشاء خدمة أو مورد جديد",
    descriptionEn: "Create a service, environment, server, platform, account, database, or another technical resource.",
    descriptionAr: "إنشاء خدمة أو Environment أو Server أو Platform أو حساب أو Database أو مورد تقني جديد.",
  },
  {
    value: "change" as const,
    en: "Change or scale something existing",
    ar: "تعديل أو توسعة شيء موجود",
    descriptionEn: "Scale resources, change configuration, patch, upgrade, migrate, renew, or modify an existing service.",
    descriptionAr: "زيادة أو تقليل الموارد أو تعديل Configuration أو Patch أو Upgrade أو Migration أو تجديد خدمة موجودة.",
  },
  {
    value: "access" as const,
    en: "Request access or permissions",
    ar: "طلب صلاحية أو وصول",
    descriptionEn: "Request user access, privileged access, service accounts, VPN, whitelist, or technical connectivity permissions.",
    descriptionAr: "طلب صلاحية مستخدم أو Privileged Access أو Service Account أو VPN أو Whitelist أو صلاحيات اتصال تقنية.",
  },
  {
    value: "publish" as const,
    en: "Deploy, publish, or go live",
    ar: "Deployment أو نشر أو إطلاق الخدمة",
    descriptionEn: "Deployment, internal or external publishing, DNS, SSL, WAF, Load Balancer, or release activities.",
    descriptionAr: "Deployment أو نشر داخلي أو خارجي أو DNS أو SSL أو WAF أو Load Balancer أو Release.",
  },
  {
    value: "retire" as const,
    en: "Retire or decommission a service",
    ar: "إيقاف الخدمة أو Decommission",
    descriptionEn: "Close, retire, remove, or decommission an existing service.",
    descriptionAr: "إغلاق أو إيقاف أو إزالة خدمة موجودة أو تنفيذ Decommission لها.",
  },
  {
    value: "support" as const,
    en: "Get support or resolve an issue",
    ar: "طلب دعم أو حل مشكلة",
    descriptionEn: "Troubleshooting, consultation, technical review, assessment, report, clarification, or general support.",
    descriptionAr: "Troubleshooting أو استشارة أو مراجعة تقنية أو Assessment أو تقرير أو توضيح أو دعم عام.",
  },
];

const purposeOptions: PurposeOption[] = [
  {
    value: "service-environment",
    intents: ["new"],
    en: "Create a service or environment",
    ar: "إنشاء خدمة أو Environment",
    descriptionEn: "Create a new project/service environment in VM, OpenShift, Dev/QA, Staging, Production, or DR.",
    descriptionAr: "إنشاء Environment جديد لمشروع أو خدمة على VM أو OpenShift أو Dev/QA أو Staging أو Production أو DR.",
    terms: ["create", "new project", "new service", "environment", "openshift", "ocp", "server", "namespace", "dr"],
    areas: ["infra", "devops"],
    environmentQuestion: true,
  },
  {
    value: "server-resource",
    intents: ["new"],
    en: "Create infrastructure or a technical resource",
    ar: "إنشاء بنية تحتية أو مورد تقني",
    descriptionEn: "Create servers, storage, backup, database, middleware, platform, or another infrastructure resource.",
    descriptionAr: "إنشاء Servers أو Storage أو Backup أو Database أو Middleware أو Platform أو مورد بنية تحتية آخر.",
    terms: ["server", "storage", "backup", "database", "middleware", "platform", "resource", "provision"],
    areas: ["infra", "application"],
    environmentQuestion: true,
  },
  {
    value: "platform-devops",
    intents: ["new"],
    en: "Create a DevOps, Jira, or software-delivery resource",
    ar: "إنشاء مورد DevOps أو Jira أو تسليم برمجيات",
    descriptionEn: "Create repositories, pipelines, projects, namespaces, tools, or software-delivery resources.",
    descriptionAr: "إنشاء Repository أو Pipeline أو Project أو Namespace أو Tool أو مورد لتسليم البرمجيات.",
    terms: ["devops", "jira", "bitbucket", "pipeline", "repository", "namespace", "software delivery", "project"],
    areas: ["devops"],
    environmentQuestion: false,
  },
  {
    value: "application-database",
    intents: ["new"],
    en: "Create an application or database resource",
    ar: "إنشاء مورد للتطبيق أو Database",
    descriptionEn: "Create or provision an application, database, schema, integration, or related application resource.",
    descriptionAr: "إنشاء أو توفير Application أو Database أو Schema أو Integration أو مورد مرتبط بالتطبيق.",
    terms: ["application", "database", "schema", "integration", "api", "service"],
    areas: ["application"],
    environmentQuestion: true,
  },
  {
    value: "network-connectivity",
    intents: ["new"],
    en: "Create network or connectivity configuration",
    ar: "إنشاء إعداد شبكة أو Connectivity",
    descriptionEn: "Create VLAN, VPN, DNS, network connectivity, firewall rule, route, or related network configuration.",
    descriptionAr: "إنشاء VLAN أو VPN أو DNS أو Connectivity أو Firewall Rule أو Route أو إعداد شبكة مرتبط.",
    terms: ["network", "connectivity", "vlan", "vpn", "dns", "firewall", "route", "ip"],
    areas: ["network"],
    environmentQuestion: false,
  },
  {
    value: "user-access",
    intents: ["access"],
    en: "User access to a system or application",
    ar: "صلاحية مستخدم على نظام أو Application",
    descriptionEn: "Grant, modify, or remove a normal user’s access to an application, system, platform, database, or tool.",
    descriptionAr: "منح أو تعديل أو إزالة صلاحية مستخدم عادي على Application أو System أو Platform أو Database أو Tool.",
    terms: ["user access", "access", "permission", "application access", "system access", "database access"],
    areas: ["access", "application", "devops"],
    environmentQuestion: true,
  },
  {
    value: "privileged-access",
    intents: ["access"],
    en: "Privileged or administrator access",
    ar: "Privileged Access أو صلاحية Administrator",
    descriptionEn: "Request elevated, privileged, administrator, production, server, database, or operational access.",
    descriptionAr: "طلب صلاحية Elevated أو Privileged أو Administrator على Production أو Server أو Database أو أنظمة التشغيل.",
    terms: ["privileged", "administrator", "admin", "elevated", "production access", "server access", "database access"],
    areas: ["access", "infra", "application"],
    environmentQuestion: true,
  },
  {
    value: "system-account",
    intents: ["access", "new"],
    en: "Service account or system account",
    ar: "Service Account أو System Account",
    descriptionEn: "Create or grant permissions for a service account, system account, technical user, or integration account.",
    descriptionAr: "إنشاء أو منح صلاحيات لـ Service Account أو System Account أو Technical User أو Integration Account.",
    terms: ["service account", "system account", "technical account", "integration account", "account"],
    areas: ["access", "devops", "application"],
    environmentQuestion: true,
  },
  {
    value: "remote-connectivity",
    intents: ["access"],
    en: "VPN, whitelist, or connectivity access",
    ar: "VPN أو Whitelist أو صلاحية Connectivity",
    descriptionEn: "Request VPN, IP whitelist, firewall access, remote connectivity, or network permission.",
    descriptionAr: "طلب VPN أو IP Whitelist أو Firewall Access أو Remote Connectivity أو صلاحية على الشبكة.",
    terms: ["vpn", "whitelist", "allowlist", "firewall", "connectivity", "remote", "ip"],
    areas: ["network", "access"],
    environmentQuestion: false,
  },
  {
    value: "scale-resource",
    intents: ["change"],
    en: "Increase, decrease, or add resources",
    ar: "زيادة أو تقليل أو إضافة موارد",
    descriptionEn: "Scale CPU, RAM, storage, servers, nodes, capacity, or another infrastructure resource.",
    descriptionAr: "زيادة أو تقليل CPU أو RAM أو Storage أو Servers أو Nodes أو Capacity أو مورد بنية تحتية آخر.",
    terms: ["scale", "increase", "decrease", "cpu", "ram", "storage", "add new server", "capacity"],
    areas: ["infra"],
    environmentQuestion: true,
  },
  {
    value: "configuration-change",
    intents: ["change"],
    en: "Modify configuration or an existing service",
    ar: "تعديل Configuration أو خدمة موجودة",
    descriptionEn: "Change configuration, settings, service details, DNS, network, database, application, or platform setup.",
    descriptionAr: "تعديل Configuration أو Settings أو بيانات الخدمة أو DNS أو Network أو Database أو Application أو Platform.",
    terms: ["change", "modify", "update", "configuration", "settings", "service design"],
    environmentQuestion: true,
  },
  {
    value: "patch-upgrade",
    intents: ["change"],
    en: "Patch, upgrade, or renew",
    ar: "Patch أو Upgrade أو تجديد",
    descriptionEn: "Patch or upgrade an operating system, application, database, middleware, platform, certificate, or license.",
    descriptionAr: "تنفيذ Patch أو Upgrade لنظام تشغيل أو Application أو Database أو Middleware أو Platform أو Certificate أو License.",
    terms: ["patch", "upgrade", "renew", "certificate", "license", "version"],
    environmentQuestion: true,
  },
  {
    value: "migration",
    intents: ["change"],
    en: "Migrate or move a service",
    ar: "Migration أو نقل خدمة",
    descriptionEn: "Move or migrate a service, application, database, server, platform, environment, or workload.",
    descriptionAr: "نقل أو Migration لخدمة أو Application أو Database أو Server أو Platform أو Environment أو Workload.",
    terms: ["migration", "migrate", "move", "transfer", "relocate"],
    environmentQuestion: true,
  },
  {
    value: "internal-publish",
    intents: ["publish"],
    en: "Publish internally",
    ar: "نشر داخلي",
    descriptionEn: "Publish a service for users inside Elm network, including internal DNS, Load Balancer, or WAF configuration.",
    descriptionAr: "نشر الخدمة للمستخدمين داخل شبكة Elm، بما يشمل Internal DNS أو Load Balancer أو WAF Configuration.",
    terms: ["internal publish", "internal", "load balancer", "waf", "dns", "publish"],
    areas: ["network", "application"],
    environmentQuestion: true,
  },
  {
    value: "external-publish",
    intents: ["publish"],
    en: "Publish externally over the internet",
    ar: "نشر خارجي عبر الإنترنت",
    descriptionEn: "Publish an internet-facing service, including GRC, public DNS, WAF, SSL, CAPTCHA, or external access.",
    descriptionAr: "نشر خدمة على الإنترنت، بما يشمل GRC أو Public DNS أو WAF أو SSL أو CAPTCHA أو External Access.",
    terms: ["external publish", "internet", "public", "grc", "captcha", "waf", "ssl", "publish"],
    areas: ["network", "application"],
    environmentQuestion: true,
  },
  {
    value: "dns-certificate",
    intents: ["publish", "change"],
    en: "DNS, domain, or SSL certificate",
    ar: "DNS أو Domain أو SSL Certificate",
    descriptionEn: "Create or update DNS records, domains, SSL certificates, TXT records, or related publishing configuration.",
    descriptionAr: "إنشاء أو تعديل DNS Records أو Domain أو SSL Certificate أو TXT Record أو إعداد نشر مرتبط.",
    terms: ["dns", "domain", "ssl", "certificate", "txt", "cname"],
    areas: ["network"],
    environmentQuestion: false,
  },
  {
    value: "deployment-release",
    intents: ["publish"],
    en: "Deployment, release, or go-live activity",
    ar: "Deployment أو Release أو Go-Live",
    descriptionEn: "Open or track deployment, Change Request, release, MRF, production enablement, or go-live activity.",
    descriptionAr: "فتح أو متابعة Deployment أو Change Request أو Release أو MRF أو Production Enablement أو Go-Live.",
    terms: ["deployment", "deploy", "release", "go live", "change request", "mrf"],
    areas: ["application", "devops", "general"],
    environmentQuestion: true,
  },
  {
    value: "technical-support",
    intents: ["support"],
    en: "Troubleshoot a technical issue",
    ar: "حل مشكلة تقنية",
    descriptionEn: "Get help with an application, server, platform, network, database, access, or another technical issue.",
    descriptionAr: "طلب مساعدة لمشكلة في Application أو Server أو Platform أو Network أو Database أو Access أو مشكلة تقنية أخرى.",
    terms: ["support", "troubleshoot", "issue", "incident", "help"],
  },
  {
    value: "review-assessment",
    intents: ["support"],
    en: "Request a review, test, or assessment",
    ar: "طلب مراجعة أو Test أو Assessment",
    descriptionEn: "Request technical review, security assessment, performance test, readiness check, validation, or health check.",
    descriptionAr: "طلب Technical Review أو Security Assessment أو Performance Test أو Readiness Check أو Validation أو Health Check.",
    terms: ["review", "assessment", "test", "validation", "health check", "readiness"],
  },
  {
    value: "report-consultation",
    intents: ["support"],
    en: "Request a report, consultation, or clarification",
    ar: "طلب تقرير أو استشارة أو توضيح",
    descriptionEn: "Request a report, technical consultation, recommendation, clarification, analysis, or information.",
    descriptionAr: "طلب Report أو Technical Consultation أو Recommendation أو Clarification أو Analysis أو Information.",
    terms: ["report", "consultation", "clarification", "analysis", "recommendation", "information"],
  },
  {
    value: "general-support",
    intents: ["support"],
    en: "General support when the exact request is unknown",
    ar: "دعم عام عند عدم معرفة الطلب المناسب",
    descriptionEn: "Use this only when none of the specific support paths describes what you need.",
    descriptionAr: "استخدم هذا الخيار فقط عندما لا يطابق احتياجك أي مسار دعم محدد.",
    terms: ["general help", "general support", "help request"],
    areas: ["general"],
  },
];

const environmentOptions = [
  { value: "Dev/QA" as const, en: "Dev/QA", ar: "Dev/QA", descriptionEn: "Development and testing environment only.", descriptionAr: "بيئة التطوير والاختبار فقط." },
  { value: "Staging/Production" as const, en: "Staging/Production", ar: "Staging/Production", descriptionEn: "Staging, pre-production, or live Production environment.", descriptionAr: "بيئة Staging أو ما قبل الإطلاق أو Production." },
  { value: "DR" as const, en: "DR", ar: "DR", descriptionEn: "Disaster recovery environment or DR site.", descriptionAr: "بيئة أو موقع DR." },
  { value: "Any" as const, en: "Not tied to a specific environment", ar: "لا يرتبط بـ Environment محدد", descriptionEn: "The request applies generally across environments.", descriptionAr: "الطلب عام وينطبق على أكثر من Environment." },
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

const normalizeText = (value: string): string =>
  value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9/]+/g, " ").replace(/\s+/g, " ").trim();

const requestText = (request: ServiceRequest): string =>
  normalizeText([
    request.title,
    request.shortDescription,
    request.section,
    request.category,
    request.subSection,
    request.environment,
    ...request.keywords,
  ].filter(Boolean).join(" "));

const matchesPurpose = (request: ServiceRequest, purpose: PurposeOption): boolean => {
  const text = requestText(request);
  return purpose.terms.some((term) => text.includes(normalizeText(term)));
};

const linkedOnly = (items: ServiceRequest[]): ServiceRequest[] =>
  items.filter((request) => {
    const url = request.jiraUrl?.trim();
    return Boolean(url && url !== "#" && url !== "about:blank");
  });

const CatalogRequestFinder = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const selectedPurpose = useMemo(
    () => purposeOptions.find((option) => option.value === answers.purpose),
    [answers.purpose],
  );

  const isRetirementFlow = answers.intent === "retire";
  const asksEnvironment = Boolean(selectedPurpose?.environmentQuestion);
  const fixedAreas = selectedPurpose?.areas;
  const asksArea = !isRetirementFlow && (!fixedAreas || fixedAreas.length > 1);

  const currentStep =
    answers.intent === undefined
      ? "intent"
      : isRetirementFlow
        ? "results"
        : answers.purpose === undefined
          ? "purpose"
          : asksEnvironment && answers.environment === undefined
            ? "environment"
            : asksArea && answers.area === undefined
              ? "area"
              : "results";

  const availablePurposes = useMemo(() => {
    if (!answers.intent || isRetirementFlow) return [];
    return purposeOptions.filter((option) => option.intents.includes(answers.intent!));
  }, [answers.intent, isRetirementFlow]);

  const candidateResults = useMemo(() => {
    if (!answers.intent || currentStep !== "results") return [];

    const environment = asksEnvironment ? answers.environment ?? "Any" : "Any";
    const area = answers.area ?? (fixedAreas?.length === 1 ? fixedAreas[0] : "any");

    const base = matchRequests(requests, {
      intent: answers.intent,
      environment,
      area,
      limit: 140,
    });

    if (isRetirementFlow || !selectedPurpose) return linkedOnly(base).slice(0, 18);

    const purposeMatches = linkedOnly(base.filter((request) => matchesPurpose(request, selectedPurpose)));
    return (purposeMatches.length > 0 ? purposeMatches : linkedOnly(base)).slice(0, 18);
  }, [answers, asksEnvironment, currentStep, fixedAreas, isRetirementFlow, selectedPurpose]);

  const availableEnvironments = useMemo(() => {
    if (!answers.intent || !selectedPurpose || !asksEnvironment) return [];

    return environmentOptions.filter((environment) => {
      const areas = fixedAreas?.length === 1 ? fixedAreas : ["any" as const];
      return areas.some((area) => {
        const matches = matchRequests(requests, {
          intent: answers.intent!,
          environment: environment.value,
          area,
          limit: 140,
        });
        return matches.some((request) => matchesPurpose(request, selectedPurpose));
      });
    });
  }, [answers.intent, asksEnvironment, fixedAreas, selectedPurpose]);

  const availableAreas = useMemo(() => {
    if (!answers.intent || !selectedPurpose || !asksArea) return [];

    const allowedAreas = fixedAreas ?? areaOptions.map((option) => option.value);
    return areaOptions.filter((option) => {
      if (option.value === "any") return true;
      if (!allowedAreas.includes(option.value)) return false;

      const matches = matchRequests(requests, {
        intent: answers.intent!,
        environment: asksEnvironment ? answers.environment ?? "Any" : "Any",
        area: option.value,
        limit: 140,
      });
      return matches.some((request) => matchesPurpose(request, selectedPurpose));
    });
  }, [answers.intent, answers.environment, asksArea, asksEnvironment, fixedAreas, selectedPurpose]);

  const steps = useMemo(() => {
    if (isRetirementFlow) return ["intent"];
    const flow = ["intent", "purpose"];
    if (asksEnvironment) flow.push("environment");
    if (asksArea) flow.push("area");
    return flow;
  }, [asksArea, asksEnvironment, isRetirementFlow]);

  const displayedStep = currentStep === "results" ? steps.length : Math.max(1, steps.indexOf(currentStep) + 1);

  const reset = () => setAnswers({});
  const back = () => {
    if (currentStep === "results") {
      if (asksArea) setAnswers((current) => ({ ...current, area: undefined }));
      else if (asksEnvironment) setAnswers((current) => ({ ...current, environment: undefined }));
      else setAnswers((current) => ({ intent: current.intent }));
      return;
    }
    if (currentStep === "area") {
      if (asksEnvironment) setAnswers((current) => ({ ...current, environment: undefined, area: undefined }));
      else setAnswers((current) => ({ intent: current.intent }));
      return;
    }
    if (currentStep === "environment") {
      setAnswers((current) => ({ intent: current.intent }));
      return;
    }
    if (currentStep === "purpose") setAnswers({});
  };

  const question =
    currentStep === "intent"
      ? isArabic ? "ما النتيجة التي تريد الوصول إليها؟" : "What outcome do you need?"
      : currentStep === "purpose"
        ? isArabic ? "ما الاحتياج المحدد داخل هذا المسار؟" : "What exactly do you need in this path?"
        : currentStep === "environment"
          ? isArabic ? "أي Environment يتأثر بهذا الطلب؟" : "Which environment does this request affect?"
          : isArabic ? "أي مجال تقني يرتبط بالطلب؟" : "Which technology area is related to the request?";

  const helper =
    currentStep === "intent"
      ? isArabic
        ? "اختر النتيجة الرئيسية أولاً. بعد ذلك ستظهر لك أسئلة مخصصة لاختيار الـ SR الصحيح، ولن نعرض مسارات غير منطقية."
        : "Start with the main outcome. The following questions will be tailored to find the correct SR, and illogical paths will be excluded."
      : currentStep === "purpose"
        ? isArabic
          ? "اختر الوصف الأقرب لما تحتاجه فعلياً. هذا السؤال يفصل بين الطلبات المتشابهة قبل سؤال Environment أو المجال التقني."
          : "Choose the description closest to your actual need. This separates similar requests before asking about environment or technology area."
        : currentStep === "environment"
          ? isArabic
            ? "تظهر فقط الـ Environments التي تحتوي على SR متوافق مع اختياراتك السابقة."
            : "Only environments with an SR compatible with your previous answers are shown."
          : isArabic
            ? "تظهر فقط المجالات التي تحتوي فعلياً على SR مطابق. مثال: عند اختيار Dev/QA لن يظهر Business Operations ما لم يوجد طلب مطابق حقيقي."
            : "Only areas with a genuinely matching SR are shown. For example, selecting Dev/QA will not show Business Operations unless a real matching request exists.";

  if (currentStep === "results") {
    return (
      <div className="catalog-request-finder" dir={isArabic ? "rtl" : "ltr"}>
        <div className="mb-5 rounded-xl border border-[#b3d4ff] bg-[#e9f2ff] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#0c66e4]">
                {isArabic ? "الطلبات المطابقة" : "Matching requests"}
              </p>
              <h3 className="mt-1 text-xl font-bold text-[#172b4d]">
                {copy.tools.recommended} ({candidateResults.length})
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#44546f]">
                {isRetirementFlow
                  ? isArabic
                    ? "تم عرض طلب إيقاف الخدمة مباشرة لأنه المسار الوحيد المطابق."
                    : "The service retirement request is shown directly because it is the only matching path."
                  : isArabic
                    ? "تمت المطابقة حسب النتيجة المطلوبة والاحتياج المحدد والـ Environment والمجال التقني عند الحاجة. لا تظهر الطلبات غير المرتبطة أو التي لا تحتوي على رابط صالح."
                    : "Matching uses the selected outcome, specific need, environment, and technology area when relevant. Unrelated requests and requests without valid links are excluded."}
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

        {candidateResults.length > 0 ? (
          <div className={`grid grid-cols-1 gap-4 ${isRetirementFlow ? "max-w-2xl" : "md:grid-cols-2 xl:grid-cols-3"}`}>
            {candidateResults.map((request) => <RequestCard key={request.id} request={request} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-[#dfe1e6] bg-white p-6 text-center">
            <SearchCheck className="mx-auto h-9 w-9 text-[#7a869a]" />
            <h4 className="mt-3 font-bold text-[#172b4d]">{isArabic ? "لا توجد مطابقة دقيقة" : "No exact match found"}</h4>
            <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-[#5e6c84]">
              {isArabic
                ? "ارجع وعدّل آخر اختيار. لن نضيف طلبات غير مرتبطة فقط لعرض نتائج."
                : "Go back and change the last answer. Unrelated requests will not be added merely to show results."}
            </p>
          </div>
        )}
      </div>
    );
  }

  const options =
    currentStep === "intent"
      ? intentOptions
      : currentStep === "purpose"
        ? availablePurposes
        : currentStep === "environment"
          ? availableEnvironments
          : availableAreas;

  return (
    <div className="catalog-request-finder" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mb-6 border-b border-[#dfe1e6] pb-5">
        <div className="mb-4 flex items-center gap-2" aria-label={isArabic ? "تقدم الأسئلة" : "Question progress"}>
          {steps.map((step, index) => (
            <span key={step} className={`h-1.5 flex-1 rounded-full ${index < displayedStep ? "bg-[#0c66e4]" : "bg-[#dfe1e6]"}`} />
          ))}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#0c66e4]">
              {isArabic ? `السؤال ${displayedStep} من ${steps.length}` : `Question ${displayedStep} of ${steps.length}`}
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#172b4d] sm:text-2xl">{question}</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[#5e6c84]">{helper}</p>
          </div>
          {currentStep !== "intent" && (
            <Button variant="ghost" onClick={back} className="shrink-0 gap-2">
              <BackIcon className="h-4 w-4" />
              {isArabic ? "رجوع" : "Back"}
            </Button>
          )}
        </div>
      </div>

      <div className={`grid gap-3 ${currentStep === "area" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((option) => {
          const Icon = "icon" in option ? option.icon : null;
          const description = "descriptionEn" in option ? (isArabic ? option.descriptionAr : option.descriptionEn) : undefined;

          return (
            <button
              key={option.value}
              type="button"
              className="group min-h-28 rounded-xl border border-[#dfe1e6] bg-white p-4 text-start transition hover:-translate-y-0.5 hover:border-[#0c66e4] hover:bg-[#f7fbff] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/35"
              onClick={() => {
                if (currentStep === "intent") {
                  const intent = option.value as RequestIntent;
                  setAnswers({ intent });
                } else if (currentStep === "purpose") {
                  const purpose = option.value as PurposeKey;
                  const selected = purposeOptions.find((item) => item.value === purpose);
                  const area = selected?.areas?.length === 1 ? selected.areas[0] : undefined;
                  setAnswers((current) => ({ intent: current.intent, purpose, area }));
                } else if (currentStep === "environment") {
                  setAnswers((current) => ({ ...current, environment: option.value as RequestEnvironment, area: fixedAreas?.length === 1 ? fixedAreas[0] : undefined }));
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
                  <span className="block text-sm font-bold leading-6 text-[#172b4d]">{isArabic ? option.ar : option.en}</span>
                  {description && <span className="mt-1 block text-xs leading-5 text-[#5e6c84]">{description}</span>}
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
