import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, ListChecks, Rocket, ServerCog } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProjectJourney } from "@/utils/projectJourneyLocalization";
import "@/styles/project-journey-page.css";
import "@/styles/project-journey-language.css";

const stages = [
  { id: "prep-1", en: "Preparation", ar: "التحضير", icon: ListChecks },
  { id: "devqa-1", en: "Dev/QA", ar: "Dev/QA", icon: ServerCog },
  { id: "staging-prod-1", en: "Staging & Production", ar: "Staging وProduction", icon: Layers3 },
  { label: "Deployment", en: "Deployment", ar: "Deployment", icon: CheckCircle2 },
  { label: "Publishing", en: "Publishing", ar: "النشر", icon: Rocket },
];

const normalizeText = (value: string): string => value.replace(/[|\s\u200e\u200f]+/g, "").toLowerCase();

const ProjectJourneyPage = () => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const collapsedCard = rootRef.current?.querySelector<HTMLElement>(".premium-tool-card");
    collapsedCard?.click();
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const applyEnhancements = () => {
      localizeProjectJourney(root, isArabic);

      root.querySelectorAll<HTMLElement>("[class*='rounded-full']").forEach((badge) => {
        const text = normalizeText(badge.textContent ?? "");
        if (text.includes("requiredifapplicable") || text.includes("إلزاميعندالحاجة")) {
          badge.style.display = "none";
        }
      });

      const cards = Array.from(root.querySelectorAll<HTMLElement>(":scope > div > div:nth-child(2) > div"));
      const stagingCard = cards.find((card) => normalizeText(card.textContent ?? "").includes("stagingandproduction"));
      const parallelCard = cards.find((card) => normalizeText(card.textContent ?? "").includes("parallelactions"));

      if (stagingCard && parallelCard && !stagingCard.contains(parallelCard)) {
        parallelCard.classList.add("journey-parallel-actions");
        const note = document.createElement("div");
        note.className = "journey-conditional-note";
        note.textContent = isArabic
          ? "ملاحظة: نفّذ هذه الطلبات فقط عند الحاجة حسب متطلبات المشروع/المنتج."
          : "Note: Complete these requests only when needed based on the project/product requirements.";
        parallelCard.insertBefore(note, parallelCard.firstChild);
        stagingCard.appendChild(parallelCard);
      }
    };

    applyEnhancements();
    const observer = new MutationObserver(applyEnhancements);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isArabic]);

  const navigateToStage = (stage: (typeof stages)[number]) => {
    if ("id" in stage && stage.id) {
      const target = document.getElementById(stage.id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    if (!("label" in stage) || !rootRef.current) return;
    const expected = normalizeText(stage.label);
    const heading = Array.from(rootRef.current.querySelectorAll<HTMLElement>("h2, h3, h4, h5, [class*='font-semibold'], [class*='font-bold']"))
      .find((element) => normalizeText(element.textContent ?? "") === expected);
    heading?.closest<HTMLElement>("[class*='rounded'], .overflow-hidden")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-[#102a43]" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/"
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#0057b8] transition hover:bg-[#eaf4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057b8]/30"
        >
          <BackIcon className="h-4 w-4" />
          {copy.common.backToServices}
        </Link>

        <section className="journey-page-hero">
          <div className="journey-page-hero-icon"><Layers3 className="h-6 w-6" /></div>
          <div>
            <p className="journey-page-eyebrow">{copy.common.technologyCenterTool}</p>
            <h1>{copy.navigation.projectJourneyChecklist}</h1>
            <p>
              {isArabic
                ? "رحلة مرئية وواضحة من التحضير إلى الإطلاق، مع تفاصيل كل مرحلة وطلبات Jira المرتبطة بها."
                : "A clear visual journey from preparation to go-live, with each stage's details and related Jira requests below."}
            </p>
          </div>
        </section>

        <section className="journey-page-overview" aria-label={isArabic ? "مراحل رحلة المشروع" : "Project journey stages"}>
          <div className="journey-page-overview-copy">
            <span>{isArabic ? "رحلة المشروع خطوة بخطوة" : "Project journey, step by step"}</span>
            <h2>{isArabic ? "ابدأ من التحضير واتبع المسار حتى الإطلاق" : "Start with preparation and follow the path to go-live"}</h2>
            <p>{isArabic ? "اضغط على أي مرحلة للانتقال مباشرة إلى تفاصيلها." : "Select any stage to jump directly to its detailed section."}</p>
          </div>
          <div className="journey-page-stage-grid">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <button key={stage.en} type="button" onClick={() => navigateToStage(stage)} className="journey-page-stage-card">
                  <span className="journey-page-stage-number">{index + 1}</span>
                  <Icon className="h-5 w-5" />
                  <strong>{isArabic ? stage.ar : stage.en}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <section ref={rootRef} data-language={language} className="project-journey-page-content" id="project-journey-checklist">
          <ProjectJourneyChecklist />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectJourneyPage;
