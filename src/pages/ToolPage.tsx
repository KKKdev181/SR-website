import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers3,
  ListChecks,
  Rocket,
  Route,
  ServerCog,
  WandSparkles,
} from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";
import "@/styles/tool-localization.css";
import "@/styles/project-journey-redesign.css";

type ToolType = "checklist" | "finder" | "match";
type JourneyStageKey = "prepare" | "devqa" | "staging" | "deployment" | "publishing";

interface ToolPageProps {
  tool: ToolType;
}

interface JourneyStage {
  key: JourneyStageKey;
  targetId?: string;
  phaseNames?: string[];
  sectionNames?: string[];
  icon: typeof ListChecks;
  en: string;
  ar: string;
  descriptionEn: string;
  descriptionAr: string;
}

const normalizeText = (value: string): string =>
  value.replace(/[|\s\u200e\u200f]+/g, "").toLowerCase();

const ToolPage = ({ tool }: ToolPageProps) => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const toolRootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const collapsedCard = toolRootRef.current?.querySelector<HTMLElement>(".premium-tool-card");
    collapsedCard?.click();
  }, [tool]);

  const title = tool === "checklist"
    ? copy.navigation.projectJourneyChecklist
    : tool === "finder"
      ? copy.tools.finderTitle
      : copy.tools.matchTitle;

  const description = tool === "checklist"
    ? copy.tools.checklistDescription
    : tool === "finder"
      ? copy.tools.finderDescription
      : copy.tools.matchDescription;

  const ToolIcon = tool === "checklist" ? Layers3 : tool === "finder" ? Route : WandSparkles;
  const badges = tool === "checklist"
    ? [copy.common.allDetailsPreserved, copy.common.directJiraLinks, copy.common.expandablePhases]
    : [copy.common.guidedExperience, copy.common.liveRequestData, copy.common.directJiraLinks];

  const journeyStages: JourneyStage[] = [
    {
      key: "prepare",
      targetId: "prep-1",
      phaseNames: ["Preparation", "التحضير"],
      icon: ListChecks,
      en: "Prepare",
      ar: "التحضير",
      descriptionEn: "Create the project and confirm prerequisites.",
      descriptionAr: "أنشئ المشروع وتأكد من المتطلبات الأساسية.",
    },
    {
      key: "devqa",
      targetId: "devqa-1",
      phaseNames: ["Dev/QA (VMs)", "التطوير/الاختبار", "Dev/QA"],
      icon: ServerCog,
      en: "Build Dev/QA",
      ar: "تجهيز Dev/QA",
      descriptionEn: "Choose VM or OCP and prepare the development environment.",
      descriptionAr: "اختر VM أو OCP وجهّز بيئة Dev/QA.",
    },
    {
      key: "staging",
      targetId: "staging-prod-1",
      phaseNames: ["Staging and Production", "التجهيز والإنتاج", "Staging وProduction"],
      icon: Layers3,
      en: "Prepare Staging & Production",
      ar: "تجهيز Staging وProduction",
      descriptionEn: "Provision the target environments and complete readiness checks.",
      descriptionAr: "جهّز البيئات المستهدفة وأكمل متطلبات الجاهزية.",
    },
    {
      key: "deployment",
      sectionNames: ["Deployment", "التنفيذ", "Deployment التنفيذ"],
      icon: CheckCircle2,
      en: "Deploy",
      ar: "تنفيذ Deployment",
      descriptionEn: "Open the change, coordinate deployment, and complete handover.",
      descriptionAr: "افتح Change ونسّق Deployment وأكمل التسليم.",
    },
    {
      key: "publishing",
      sectionNames: ["Publishing", "النشر"],
      icon: Rocket,
      en: "Publish & Go Live",
      ar: "النشر والإطلاق",
      descriptionEn: "Choose internal or external publishing and complete approvals.",
      descriptionAr: "اختر النشر الداخلي أو الخارجي وأكمل الموافقات.",
    },
  ];

  const scrollElementIntoView = (element: HTMLElement, block: ScrollLogicalPosition = "start") => {
    element.scrollIntoView({ behavior: "smooth", block });
  };

  const findExactTextElement = (root: HTMLElement, names: string[]): HTMLElement | null => {
    const expected = new Set(names.map(normalizeText));
    const candidates = root.querySelectorAll<HTMLElement>(
      "h1, h2, h3, h4, h5, h6, [class*='font-semibold'], [class*='font-bold']",
    );

    return Array.from(candidates).find((element) => {
      const text = normalizeText(element.textContent ?? "");
      return expected.has(text);
    }) ?? null;
  };

  const openPhaseAndScroll = (stage: JourneyStage, root: HTMLElement) => {
    const scrollToTarget = () => {
      const target = stage.targetId ? document.getElementById(stage.targetId) : null;
      if (target) scrollElementIntoView(target, "center");
    };

    const existingTarget = stage.targetId ? document.getElementById(stage.targetId) : null;
    if (existingTarget) {
      scrollElementIntoView(existingTarget, "center");
      return;
    }

    const phaseLabel = findExactTextElement(root, stage.phaseNames ?? []);
    const trigger = phaseLabel?.closest<HTMLElement>("button[data-state], [role='button'][data-state]");

    if (trigger?.getAttribute("data-state") === "closed") trigger.click();
    window.setTimeout(scrollToTarget, 180);
  };

  const scrollToStandaloneSection = (stage: JourneyStage, root: HTMLElement) => {
    const heading = findExactTextElement(root, stage.sectionNames ?? []);
    if (!heading) return;

    const card = heading.closest<HTMLElement>(".overflow-hidden") ?? heading.closest<HTMLElement>("[class*='rounded']") ?? heading;
    scrollElementIntoView(card, "start");
  };

  const navigateToJourneyStage = (stage: JourneyStage) => {
    const root = toolRootRef.current;
    if (!root) return;

    if (stage.targetId) {
      openPhaseAndScroll(stage, root);
      return;
    }

    scrollToStandaloneSection(stage, root);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />
      <main className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/"
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30"
        >
          <BackIcon className="h-4 w-4" />
          {copy.common.backToServices}
        </Link>

        <section className={`mb-6 overflow-hidden rounded-2xl border border-[#dfe1e6] bg-white shadow-[0_1px_3px_rgba(9,30,66,0.1)] ${tool === "checklist" ? "journey-page-hero" : ""}`}>
          <div className="grid gap-5 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#0c66e4]">
                <ToolIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0c66e4]">{copy.common.technologyCenterTool}</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172b4d] sm:text-3xl">{title}</h1>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#5e6c84] sm:text-[15px]">{description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
              {badges.map((label) => (
                <span key={label} className="rounded-full border border-[#b6d7ff] bg-[#e9f2ff] px-3 py-1.5 text-xs font-semibold text-[#0747a6]">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {tool === "checklist" && (
          <section className="journey-overview mb-7" aria-label={isArabic ? "مراحل رحلة المشروع" : "Project journey stages"}>
            <div className="journey-overview-heading">
              <div>
                <span className="journey-overview-kicker">
                  {isArabic ? "مسار واضح من البداية إلى الإطلاق" : "A clear path from setup to go-live"}
                </span>
                <h2>{isArabic ? "اتبع المراحل بالترتيب" : "Follow the journey in order"}</h2>
                <p>
                  {isArabic
                    ? "ابدأ من التحضير، ثم جهّز البيئات، وأكمل Deployment والنشر. افتح كل مرحلة لمراجعة الطلبات والملاحظات والروابط المطلوبة."
                    : "Start with preparation, build the environments, then complete deployment and publishing. Open each stage to review its requests, notes, and links."}
                </p>
              </div>
            </div>

            <div className="journey-stage-grid">
              {journeyStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => navigateToJourneyStage(stage)}
                    className="journey-stage-card"
                    aria-label={isArabic ? `الانتقال إلى مرحلة ${stage.ar}` : `Go to ${stage.en} stage`}
                  >
                    <span className="journey-stage-number">{index + 1}</span>
                    <span className="journey-stage-icon"><Icon className="h-5 w-5" /></span>
                    <span className="journey-stage-copy">
                      <strong>{isArabic ? stage.ar : stage.en}</strong>
                      <small>{isArabic ? stage.descriptionAr : stage.descriptionEn}</small>
                    </span>
                    <ChevronRight className={`journey-stage-arrow h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section
          ref={toolRootRef}
          id={tool === "checklist" ? "project-journey-checklist" : tool === "finder" ? "request-finder" : "quick-request-match"}
          className={tool === "checklist" ? "standalone-checklist journey-redesign" : "standalone-interactive-tool"}
        >
          {tool === "checklist" && <ProjectJourneyChecklist />}
          {tool === "finder" && <ProjectJourneyGuide />}
          {tool === "match" && <GuidedWizard />}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ToolPage;
