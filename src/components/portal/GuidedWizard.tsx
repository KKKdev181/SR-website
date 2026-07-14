import { useState } from "react";
import { HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

const steps = [
  {
    question: "What do you need?",
    questionAr: "وش تحتاج؟",
    options: [
      { label: "Create something new", labelAr: "إنشاء خدمة أو بيئة جديدة" },
      { label: "Change something existing", labelAr: "تعديل خدمة أو إعداد موجود" },
      { label: "Publish a service", labelAr: "نشر خدمة" },
      { label: "Retire a service", labelAr: "إيقاف خدمة" },
    ],
  },
  {
    question: "Which environment?",
    questionAr: "أي Environment؟",
    options: [
      { label: "Dev/QA", labelAr: "Dev/QA" },
      { label: "Staging/Production", labelAr: "Staging/Production" },
      { label: "DR", labelAr: "DR" },
      { label: "Not sure / Any", labelAr: "غير متأكد / أي Environment" },
    ],
  },
] as const;

const GuidedWizard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < steps.length - 1) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const getResults = (): ServiceRequest[] => {
    if (answers.length < 2) return [];
    const [need, env] = answers;

    let filtered = requests;
    if (need === "Create something new") {
      filtered = requests.filter((request) =>
        ["Service Setup & Environments", "Infrastructure, Cloud & Platform"].includes(request.section) ||
        request.category === "New Service Setup" ||
        request.category === "Environment / Server Provisioning",
      );
    } else if (need === "Change something existing") {
      filtered = requests.filter((request) =>
        ["Infrastructure, Cloud & Platform", "Network, Security & Compliance", "Data, Storage & Backup"].includes(request.section) ||
        request.keywords.some((keyword) => ["change", "update", "modify", "increase", "reduce"].includes(keyword.toLowerCase())),
      );
    } else if (need === "Publish a service") {
      filtered = requests.filter((request) =>
        request.section === "DevOps, Release & Lifecycle" ||
        request.category === "Release / Lifecycle" ||
        request.keywords.some((keyword) => ["publish", "release", "go live"].includes(keyword.toLowerCase())),
      );
    } else if (need === "Retire a service") {
      filtered = requests.filter((request) =>
        request.category === "Release / Lifecycle" ||
        request.title.toLowerCase().includes("retire") ||
        request.title.toLowerCase().includes("decommission") ||
        request.keywords.some((keyword) => ["retire", "decommission"].includes(keyword.toLowerCase())),
      );
    }

    if (env !== "Not sure / Any") {
      const environmentMatches = filtered.filter((request) => !request.environment || request.environment === env);
      if (environmentMatches.length > 0) filtered = environmentMatches;
    }

    return filtered.slice(0, 6);
  };

  const results = answers.length >= 2 ? getResults() : [];
  const current = steps[step];

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="premium-tool-card premium-tool-card-green group mb-10 w-full cursor-pointer overflow-hidden text-start"
      >
        <span className="premium-tool-card-inner flex min-h-[7rem] items-center gap-5 px-5 py-4 sm:px-6">
          <span className="premium-tool-icon premium-tool-icon-green flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-emerald-100">
            <HelpCircle className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">{copy.tools.matchTitle}</span>
              <span className="rounded-full border border-emerald-200/20 bg-emerald-300/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-100">
                {isArabic ? "مطابقة سريعة" : "Fast match"}
              </span>
            </span>
            <span className="block text-xs leading-relaxed text-slate-200/75">{copy.tools.matchDescription}</span>
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="mb-10 rounded-xl border border-[#dfe1e6] bg-white p-5 shadow-[0_1px_3px_rgba(9,30,66,0.12)] sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ebecf0] pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <HelpCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#172b4d]">{copy.tools.matchTitle}</h2>
            <p className="text-sm text-[#5e6c84]">{copy.tools.matchDescription}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { reset(); setIsOpen(false); }}>
          {copy.common.close}
        </Button>
      </div>

      {answers.length < steps.length ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0c66e4]">
            {copy.tools.questionProgress(step + 1, steps.length)}
          </p>
          <h3 className="mb-4 text-lg font-semibold text-[#172b4d]">{isArabic ? current.questionAr : current.question}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => (
              <Button
                key={option.label}
                variant="outline"
                className="h-auto min-h-14 justify-start rounded-lg border-[#dfe1e6] bg-white px-4 py-3 text-start text-sm font-medium text-[#172b4d] hover:border-[#0c66e4] hover:bg-[#e9f2ff]"
                onClick={() => handleAnswer(option.label)}
              >
                {isArabic ? option.labelAr : option.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[#172b4d]">{copy.tools.recommended} ({results.length})</h3>
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
            <p className="rounded-lg border border-[#dfe1e6] bg-[#f7f8f9] p-4 text-sm text-[#5e6c84]">{copy.common.noResults}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidedWizard;
