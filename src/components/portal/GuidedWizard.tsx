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

    let sectionFilter: string[] = [];
    if (need === "Create something new") sectionFilter = ["Initiate", "Environment Preparation"];
    else if (need === "Change something existing") sectionFilter = ["Modify"];
    else if (need === "Publish a service") sectionFilter = ["Publishing"];
    else if (need === "Retire a service") sectionFilter = ["Retire"];

    let filtered = requests.filter((r) => sectionFilter.includes(r.section));

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
        className="relative overflow-hidden bg-gradient-to-r from-accent/[0.06] via-accent/[0.03] to-primary/[0.04] border border-accent/20 rounded-xl p-5 cursor-pointer group hover:shadow-lg hover:border-accent/30 transition-all duration-300 mb-10"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-accent/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4 relative">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0 group-hover:bg-accent/15 group-hover:scale-105 transition-all shadow-sm">
            <HelpCircle className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Not sure what to choose?</h3>
            <p dir="rtl" lang="ar" className="text-xs text-accent/60 font-medium mt-0.5" style={arabicFont}>ما تعرف وش تختار؟</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Answer a few questions and we'll suggest the correct request</p>
            <p dir="rtl" lang="ar" className="text-[11px] text-muted-foreground/60 mt-0.5" style={arabicFont}>جاوب على أسئلة بسيطة وبنقترح لك الطلب المناسب</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
            <ArrowRight className="h-3.5 w-3.5 text-accent" />
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
