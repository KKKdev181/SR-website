import { useState } from "react";
import { HelpCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import RequestCard from "./RequestCard";
import type { ServiceRequest } from "@/data/requests";

const arabicFont = { fontFamily: "'Noto Sans Arabic', sans-serif" };

const steps = [
  {
    question: "What do you need?",
    questionAr: "ما الذي تحتاجه؟",
    options: [
      { label: "Create something new", labelAr: "إنشاء شيء جديد" },
      { label: "Change something existing", labelAr: "تعديل شيء موجود" },
      { label: "Publish a service", labelAr: "نشر خدمة" },
      { label: "Retire a service", labelAr: "إيقاف خدمة" },
    ],
  },
  {
    question: "Which environment?",
    questionAr: "أي بيئة؟",
    options: [
      { label: "Dev/QA", labelAr: "التطوير/ضمان الجودة" },
      { label: "Staging/Production", labelAr: "التجهيز/الإنتاج" },
      { label: "DR", labelAr: "التعافي من الكوارث" },
      { label: "Not sure / Any", labelAr: "غير متأكد / أي بيئة" },
    ],
  },
];

const GuidedWizard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
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
      filtered = requests.filter((r) =>
        ["Service Setup & Environments", "Infrastructure, Cloud & Platform"].includes(r.section) ||
        r.category === "New Service Setup" ||
        r.category === "Environment / Server Provisioning"
      );
    } else if (need === "Change something existing") {
      filtered = requests.filter((r) =>
        ["Infrastructure, Cloud & Platform", "Network, Security & Compliance", "Data, Storage & Backup"].includes(r.section) ||
        r.keywords.some((keyword) => ["change", "update", "modify", "increase", "reduce"].includes(keyword.toLowerCase()))
      );
    } else if (need === "Publish a service") {
      filtered = requests.filter((r) =>
        r.section === "DevOps, Release & Lifecycle" ||
        r.category === "Release / Lifecycle" ||
        r.keywords.some((keyword) => ["publish", "release", "go live"].includes(keyword.toLowerCase()))
      );
    } else if (need === "Retire a service") {
      filtered = requests.filter((r) =>
        r.category === "Release / Lifecycle" ||
        r.title.toLowerCase().includes("retire") ||
        r.title.toLowerCase().includes("decommission") ||
        r.keywords.some((keyword) => ["retire", "decommission"].includes(keyword.toLowerCase()))
      );
    }

    if (env !== "Not sure / Any") {
      const envFiltered = filtered.filter((r) => !r.environment || r.environment === env);
      if (envFiltered.length > 0) filtered = envFiltered;
    }

    return filtered.slice(0, 6);
  };

  const results = answers.length >= 2 ? getResults() : [];

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="group relative mb-8 cursor-pointer overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
      >
        <div className="pointer-events-none absolute -right-12 -top-16 h-32 w-32 rounded-full bg-emerald-200/35" />
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-700 shadow-sm">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">Quick Request Match</h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Fast match</span>
            </div>
            <p dir="rtl" lang="ar" className="text-xs text-accent/60 font-medium mt-0.5" style={arabicFont}>ما تعرف وش تختار؟</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Answer a few questions and we'll suggest the correct request</p>
            <p dir="rtl" lang="ar" className="hidden text-[11px] text-muted-foreground/60 mt-0.5 md:block" style={arabicFont}>جاوب على أسئلة بسيطة وبنقترح لك الطلب المناسب</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-10 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
            <HelpCircle className="h-3.5 w-3.5 text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Guided Request Finder</h3>
            <span dir="rtl" lang="ar" className="text-[11px] text-muted-foreground/70" style={arabicFont}>مساعد اختيار الطلب</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { reset(); setIsOpen(false); }} className="h-7 text-xs text-muted-foreground">
          Close | إغلاق
        </Button>
      </div>

      {answers.length < steps.length ? (
        <div>
          <p className="text-sm text-foreground font-medium mb-1">
            {steps[step].question}
          </p>
          <p dir="rtl" lang="ar" className="text-xs text-muted-foreground mb-3" style={arabicFont}>
            {steps[step].questionAr}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {steps[step].options.map((opt) => (
              <Button
                key={opt.label}
                variant="outline"
                className="h-auto py-3 text-xs text-left justify-start rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-start gap-0.5"
                onClick={() => handleAnswer(opt.label)}
              >
                <span>{opt.label}</span>
                <span dir="rtl" lang="ar" className="text-[10px] text-muted-foreground/60" style={arabicFont}>{opt.labelAr}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-foreground font-medium">
              Recommended for you ({results.length} results)
            </p>
            <span dir="rtl" lang="ar" className="text-xs text-muted-foreground/70" style={arabicFont}>مقترحات لك</span>
            <Button variant="ghost" size="sm" onClick={reset} className="h-6 text-xs text-muted-foreground gap-1">
              <RotateCcw className="h-3 w-3" /> Start over | إعادة
            </Button>
          </div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">No matching requests found. Try starting over with different answers.</p>
              <p dir="rtl" lang="ar" className="text-xs text-muted-foreground/70 mt-1" style={arabicFont}>لم يتم العثور على طلبات مطابقة. جرّب الإعادة بإجابات مختلفة.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidedWizard;
