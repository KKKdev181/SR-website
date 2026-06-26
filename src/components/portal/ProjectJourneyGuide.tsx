import { useState } from "react";
import { Compass, ChevronDown, ChevronUp, Check, ArrowRight, RotateCcw, ExternalLink, Zap, Info, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import { cn } from "@/lib/utils";

const arabicFont = { fontFamily: "'Noto Sans Arabic', sans-serif" };

interface JourneyStep {
  step: number;
  phase: string;
  phaseAr: string;
  title: string;
  explanation: string;
  required: boolean;
  parallel: boolean;
  requestId?: string;
  jiraUrl?: string;
}

interface WizardAnswers {
  isNewService: boolean | null;
  needDevQA: boolean | null;
  platform: "vm" | "openshift" | "both" | null;
  needStagingProd: boolean | null;
  publishType: "internal" | "external" | "both" | null;
  needDomainSSL: boolean | null;
  needSharedServices: boolean | null;
}

const initialAnswers: WizardAnswers = {
  isNewService: null,
  needDevQA: null,
  platform: null,
  needStagingProd: null,
  publishType: null,
  needDomainSSL: null,
  needSharedServices: null,
};

const questions = [
  {
    key: "isNewService" as const,
    question: "Are you starting a new service or project?",
    questionAr: "هل تبدأ خدمة أو مشروع جديد؟",
    options: [
      { label: "Yes, it's a brand new service", labelAr: "نعم، خدمة جديدة بالكامل", value: true },
      { label: "No, I'm modifying an existing one", labelAr: "لا، أعدّل على خدمة موجودة", value: false },
    ],
  },
  {
    key: "needDevQA" as const,
    question: "Do you need a Dev/QA environment first?",
    questionAr: "هل تحتاج بيئة تطوير/اختبار أولاً؟",
    options: [
      { label: "Yes, I need Dev/QA", labelAr: "نعم، أحتاج بيئة تطوير/اختبار", value: true },
      { label: "No, skip Dev/QA", labelAr: "لا، تخطَّ هذه الخطوة", value: false },
    ],
  },
  {
    key: "platform" as const,
    question: "What platform will the service run on?",
    questionAr: "على أي منصة ستعمل الخدمة؟",
    options: [
      { label: "Containers (OpenShift)", labelAr: "حاويات (OpenShift)", value: "openshift" as const },
      { label: "Virtual Machines (VMs)", labelAr: "أجهزة افتراضية (VMs)", value: "vm" as const },
      { label: "Both", labelAr: "كلاهما", value: "both" as const },
    ],
  },
  {
    key: "needStagingProd" as const,
    question: "Will you need Staging or Production environments?",
    questionAr: "هل تحتاج بيئة تجهيز أو إنتاج؟",
    options: [
      { label: "Yes", labelAr: "نعم", value: true },
      { label: "Not yet", labelAr: "ليس بعد", value: false },
    ],
  },
  {
    key: "publishType" as const,
    question: "Will the service be published internally or externally?",
    questionAr: "هل سيتم نشر الخدمة داخلياً أم خارجياً؟",
    options: [
      { label: "Internal only", labelAr: "داخلي فقط", value: "internal" as const },
      { label: "External (public)", labelAr: "خارجي (عام)", value: "external" as const },
      { label: "Both", labelAr: "كلاهما", value: "both" as const },
    ],
  },
  {
    key: "needDomainSSL" as const,
    question: "Do you need domain registration, SSL, DNS, or load balancer?",
    questionAr: "هل تحتاج تسجيل نطاق أو SSL أو DNS أو موزع حمل؟",
    options: [
      { label: "Yes", labelAr: "نعم", value: true },
      { label: "No", labelAr: "لا", value: false },
    ],
  },
  {
    key: "needSharedServices" as const,
    question: "Do you need shared services (Google Maps, CAPTCHA)?",
    questionAr: "هل تحتاج خدمات مشتركة (Google Maps، CAPTCHA)؟",
    options: [
      { label: "Yes", labelAr: "نعم", value: true },
      { label: "No", labelAr: "لا", value: false },
    ],
  },
];

function findRequest(titlePartial: string) {
  return requests.find((r) => r.title.toLowerCase().includes(titlePartial.toLowerCase()));
}

function buildJourney(answers: WizardAnswers): JourneyStep[] {
  const steps: JourneyStep[] = [];
  let stepNum = 1;

  const add = (phase: string, phaseAr: string, title: string, explanation: string, required: boolean, parallel: boolean, titleSearch?: string) => {
    const req = titleSearch ? findRequest(titleSearch) : undefined;
    steps.push({ step: stepNum++, phase, phaseAr, title, explanation, required, parallel, requestId: req?.id, jiraUrl: req?.jiraUrl });
  };

  if (answers.isNewService) {
    add("Preparation", "التحضير", "New Service Name Adding", "Register your new service name in the system before anything else.", true, false, "New Service Name Adding");
  }

  if (answers.needDevQA) {
    if (answers.platform === "openshift" || answers.platform === "both") {
      add("Dev/QA Setup", "إعداد التطوير/الاختبار", "Create OCP Project Environment (Dev/QA)", "Set up an OpenShift container project for your development and testing.", true, false, "Create New Project OCP Environment (DEV/QA)");
    }
    if (answers.platform === "vm" || answers.platform === "both") {
      add("Dev/QA Setup", "إعداد التطوير/الاختبار", "Create New Dev/QA Servers", "Provision virtual machines for your Dev/QA environments.", true, false, "Create New Dev/QA Servers");
    }
  }

  if (answers.needStagingProd) {
    add("Staging & Production", "التجهيز والإنتاج", "Create Staging/Production Servers", "Set up your staging and production infrastructure.", true, false, "Create New Staging/Production Servers");
    if (answers.platform === "openshift" || answers.platform === "both") {
      add("Staging & Production", "التجهيز والإنتاج", "Create OCP Project (Staging/Prod)", "Provision OpenShift project for staging/production.", true, false, "Create New Project OCP Environment (Staging");
    }
  }

  if (answers.needDomainSSL) {
    add("Parallel Activities", "أنشطة بالتوازي", "Register Domain", "Register your service domain name — can be done in parallel.", false, true, "Register Domain");
    add("Parallel Activities", "أنشطة بالتوازي", "Purchase SSL Certificate", "Secure your service with an SSL certificate.", false, true, "Purchase SSL");
    add("Parallel Activities", "أنشطة بالتوازي", "New DNS Record", "Create DNS records for your service.", false, true, "New DNS");
    add("Parallel Activities", "أنشطة بالتوازي", "Load Balancer Configuration", "Set up load balancing for traffic distribution.", false, true, "Load Balancer");
  }

  if (answers.needSharedServices) {
    add("Shared Services", "الخدمات المشتركة", "Google Maps Account", "Procure a Google Maps API account if needed.", false, false, "Google MAP");
    add("Shared Services", "الخدمات المشتركة", "CAPTCHA Setup", "CAPTCHA services.", false, false, "");
  }

 if (answers.publishType) {
  add("Publishing", "النشر", "RFC / Change Request", "Submit a change request before deployment.", true, false, "RFC");
  if (answers.publishType === "internal" || answers.publishType === "both") {
    add("Publishing", "النشر", "Publish Service (Internal)", "Internal publishing requires a Service Design Change request. No GRC approval is needed.", true, false, "Service Design Change");
  }
}

  return steps;
}

const fullJourneyPhases = [
  {
    phase: "Preparation",
    phaseAr: "التحضير",
    steps: ["New Service Name Adding", "Kickoff / preparation review"],
    stepsAr: ["إضافة اسم الخدمة الجديدة", "مراجعة الانطلاق والتحضير"],
  },
  {
    phase: "Dev/QA Environment",
    phaseAr: "بيئة التطوير/الاختبار",
    steps: ["Create OCP Project Environment (if container-based)", "Create New Servers (if VM-based)", "Configure Dev/QA firewalls and access"],
    stepsAr: ["إنشاء بيئة مشروع OCP (إذا كانت حاويات)", "إنشاء خوادم جديدة (إذا كانت أجهزة افتراضية)", "إعداد جدران الحماية والوصول"],
  },
  {
    phase: "Staging & Production",
    phaseAr: "التجهيز والإنتاج",
    steps: ["Create Staging/Production Servers or OCP Project", "GRC / CAPTCHA setup if needed", "Google Maps account if needed", "Shared storage if needed"],
    stepsAr: ["إنشاء خوادم التجهيز/الإنتاج", "إعداد GRC / CAPTCHA عند الحاجة", "حساب Google Maps عند الحاجة", "التخزين المشترك عند الحاجة"],
  },
  {
    phase: "Parallel Activities",
    phaseAr: "أنشطة بالتوازي",
    steps: ["Register Domain", "Purchase SSL Certificate", "CSR Creation", "New DNS records", "Load Balancer configuration", "External certifications if applicable"],
    stepsAr: ["تسجيل النطاق", "شراء شهادة SSL", "إنشاء CSR", "سجلات DNS جديدة", "إعداد موزع الحمل", "الشهادات الخارجية إن لزم"],
  },
  {
    phase: "Publishing & Go-Live",
    phaseAr: "النشر والإطلاق",
    steps: ["RFC / Change Request submission", "Publish internally or externally", "Post-deployment verification"],
    stepsAr: ["تقديم طلب التغيير RFC", "النشر داخلياً أو خارجياً", "التحقق بعد النشر"],
  },
];

const phaseColors: Record<string, string> = {
  "Preparation": "bg-primary/10 text-primary border-primary/20",
  "Dev/QA Setup": "bg-blue-50 text-blue-700 border-blue-200",
  "Staging & Production": "bg-amber-50 text-amber-700 border-amber-200",
  "Parallel Activities": "bg-violet-50 text-violet-700 border-violet-200",
  "Shared Services": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Publishing": "bg-secondary/10 text-secondary border-secondary/20",
};

const ProjectJourneyGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [showFullJourney, setShowFullJourney] = useState(false);

  const handleAnswer = (key: string, value: any) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers(initialAnswers);
    setShowResults(false);
    setShowFullJourney(false);
  };

  const journey = showResults ? buildJourney(answers) : [];
  const phases = [...new Set(journey.map((s) => s.phase))];

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="relative overflow-hidden bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-accent/[0.06] border border-primary/20 rounded-xl p-6 cursor-pointer group hover:shadow-lg hover:border-primary/30 transition-all duration-300 mb-6"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/[0.04] rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="flex items-center gap-5 relative">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all shadow-sm">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground tracking-tight">Request Finder</h3>
            <p dir="rtl" lang="ar" className="text-sm text-primary/60 font-medium" style={arabicFont}>موجّه الطلبات</p>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Not sure where to start? We'll guide you step by step to the right request.
            </p>
            <p dir="rtl" lang="ar" className="text-xs text-muted-foreground/60 mt-1" style={arabicFont}>
              ما تعرف من وين تبدأ؟ بنوجّهك خطوة بخطوة للطلب المناسب
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-primary/15 rounded-xl shadow-sm mb-10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/[0.06] to-secondary/[0.04] px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Compass className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Request Finder | <span dir="rtl" lang="ar" style={arabicFont}>موجّه الطلبات</span></h3>
              <p className="text-xs text-muted-foreground">Answer questions to get your personalized journey</p>
              <p dir="rtl" lang="ar" className="text-[11px] text-muted-foreground/60" style={arabicFont}>جاوب على الأسئلة وبنعطيك الخطوات المناسبة لمشروعك</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showResults && (
              <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs gap-1 text-muted-foreground">
                <RotateCcw className="h-3 w-3" /> Start over | إعادة
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { reset(); setIsOpen(false); }} className="h-7 text-xs text-muted-foreground">
              Close | إغلاق
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        {!showResults && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{currentQuestion + 1}/{questions.length}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Wizard Questions */}
        {!showResults && (
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {questions[currentQuestion].question}
            </p>
            <p dir="rtl" lang="ar" className="text-xs text-muted-foreground mb-4" style={arabicFont}>
              {questions[currentQuestion].questionAr}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {questions[currentQuestion].options.map((opt) => (
                <Button
                  key={String(opt.value)}
                  variant="outline"
                  className="h-auto py-3.5 px-4 text-xs text-left justify-start rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-start gap-0.5"
                  onClick={() => handleAnswer(questions[currentQuestion].key, opt.value)}
                >
                  <span>{opt.label}</span>
                  <span dir="rtl" lang="ar" className="text-[10px] text-muted-foreground/60" style={arabicFont}>{opt.labelAr}</span>
                </Button>
              ))}
            </div>
            {currentQuestion > 0 && (
              <Button variant="ghost" size="sm" className="mt-3 text-xs text-muted-foreground" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                ← Back | رجوع
              </Button>
            )}
          </div>
        )}

        {/* Journey Results */}
        {showResults && journey.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Your Recommended Journey — {journey.length} steps
              </p>
              <span dir="rtl" lang="ar" className="text-xs text-muted-foreground/70" style={arabicFont}>رحلتك المقترحة — {journey.length} خطوات</span>
            </div>

            <div className="space-y-0">
              {phases.map((phase) => {
                const phaseSteps = journey.filter((s) => s.phase === phase);
                const phaseAr = phaseSteps[0]?.phaseAr || "";
                const colorClass = phaseColors[phase] || "bg-muted text-muted-foreground border-border";
                return (
                  <div key={phase} className="mb-6 last:mb-0">
                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-3", colorClass)}>
                      {phase}
                      {phaseAr && <span dir="rtl" lang="ar" className="opacity-70" style={arabicFont}> | {phaseAr}</span>}
                    </div>
                    <div className="relative ml-4 border-l-2 border-border pl-6 space-y-4">
                      {phaseSteps.map((step) => (
                        <div key={step.step} className="relative">
                          <div className={cn(
                            "absolute -left-[31px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                            step.required
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-card border-border text-muted-foreground"
                          )}>
                            {step.step}
                          </div>

                          <div className="bg-background border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                                  {step.required ? (
                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                                      <Check className="h-2.5 w-2.5" /> Required | إلزامي
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                                      Optional | اختياري
                                    </span>
                                  )}
                                  {step.parallel && (
                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-medium">
                                      <Zap className="h-2.5 w-2.5" /> Parallel | بالتوازي
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{step.explanation}</p>
                              </div>
                              {step.jiraUrl && (
                                <a
                                  href={step.jiraUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0"
                                >
                                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                    فتح في Jira | Open <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showResults && journey.length === 0 && (
          <div>
            <p className="text-sm text-muted-foreground">No journey steps match your selections. Try starting over with different answers.</p>
            <p dir="rtl" lang="ar" className="text-xs text-muted-foreground/70 mt-1" style={arabicFont}>لا توجد خطوات تتطابق مع اختياراتك. جرّب الإعادة بإجابات مختلفة.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectJourneyGuide;
