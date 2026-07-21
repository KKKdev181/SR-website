import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers3,
  ListChecks,
  Rocket,
  ServerCog,
} from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProjectJourney } from "@/utils/projectJourneyLocalization";
import "@/styles/project-journey-page.css";
import "@/styles/project-journey-language.css";

const stages = [
  { id: "prep-1", en: "Preparation", ar: "التحضير", description: "Set up the project and confirm prerequisites.", descriptionAr: "تهيئة المشروع والتأكد من المتطلبات الأساسية.", icon: ListChecks },
  { id: "devqa-1", en: "Dev/QA", ar: "Dev/QA", description: "Prepare development and testing environments.", descriptionAr: "تجهيز بيئات التطوير والاختبار.", icon: ServerCog },
  { id: "staging-prod-1", en: "Staging & Production", ar: "Staging وProduction", description: "Provision environments and complete readiness actions.", descriptionAr: "توفير البيئات واستكمال متطلبات الجاهزية.", icon: Layers3 },
  { label: "Deployment", en: "Deployment", ar: "Deployment", description: "Complete change, release, and handover activities.", descriptionAr: "استكمال أنشطة التغيير والإطلاق والتسليم.", icon: CheckCircle2 },
  { label: "Publishing", en: "Publishing", ar: "النشر", description: "Choose the publishing path and complete approvals.", descriptionAr: "اختيار مسار النشر واستكمال الموافقات.", icon: Rocket },
] as const;

const normalizeText = (value: string): string =>
  value.replace(/[|\s\u200e\u200f]+/g, "").toLowerCase();

const ProjectJourneyPage = () => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const rootRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const collapsedCard = rootRef.current?.querySelector<HTMLElement>(".premium-tool-card");
    collapsedCard?.click();
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const applyEnhancements = () => {
      localizeProjectJourney(root, isArabic);

      root.querySelectorAll<HTMLElement>("span").forEach((element) => {
        const rawText = (element.textContent ?? "").trim();
        const text = normalizeText(rawText);
        if (
          rawText === "|" ||
          text.includes("requiredifapplicable") ||
          text.includes("إلزاميعندالحاجة")
        ) {
          element.style.display = "none";
        }
      });

      const contentGrid = root.querySelector<HTMLElement>(":scope > div > div:nth-child(2)");
      const topLevelCards = contentGrid
        ? Array.from(contentGrid.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
        : [];

      topLevelCards.forEach((card, index) => {
        card.classList.add("journey-section-card");
        card.dataset.sectionIndex = String(index);
      });

      const stagingCard = topLevelCards.find((card) =>
        normalizeText(card.textContent ?? "").includes("stagingandproduction"),
      );
      const parallelCard = topLevelCards.find((card) =>
        normalizeText(card.textContent ?? "").includes("parallelactions"),
      );
      const developerCard = topLevelCards.find((card) =>
        normalizeText(card.textContent ?? "").includes("developeraccesschecklist"),
      );
      const deploymentCard = topLevelCards.find((card) =>
        normalizeText(card.textContent ?? "").startsWith("deployment"),
      );
      const publishingCard = topLevelCards.find((card) =>
        normalizeText(card.textContent ?? "").startsWith("publishing"),
      );

      stagingCard?.classList.add("journey-staging-card");
      developerCard?.classList.add("journey-developer-card");
      deploymentCard?.classList.add("journey-deployment-card");
      publishingCard?.classList.add("journey-publishing-card");

      const stagingItem = root.querySelector<HTMLElement>("#staging-prod-1");
      const stagingItemsContainer = stagingItem?.parentElement;

      if (stagingItemsContainer && parallelCard && !stagingItemsContainer.contains(parallelCard)) {
        parallelCard.classList.add("journey-parallel-actions");

        if (!parallelCard.querySelector(".journey-conditional-note")) {
          const note = document.createElement("div");
          note.className = "journey-conditional-note";
          note.textContent = isArabic
            ? "هذه الطلبات تُنفّذ فقط عند الحاجة حسب متطلبات المشروع أو المنتج."
            : "Complete these requests only when needed based on the project or product requirements.";
          parallelCard.insertBefore(note, parallelCard.firstChild);
        }

        stagingItemsContainer.appendChild(parallelCard);
      }

      if (developerCard) {
        developerCard.querySelectorAll<HTMLElement>("[class*='rounded-lg']").forEach((element) => {
          element.classList.add("journey-developer-panel");
        });
      }
    };

    applyEnhancements();
    const observer = new MutationObserver(applyEnhancements);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isArabic]);

  const navigateToStage = (stage: (typeof stages)[number], index: number) => {
    setActiveStage(index);

    if ("id" in stage && stage.id) {
      const target = document.getElementById(stage.id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    if (!("label" in stage) || !rootRef.current) return;
    const expected = normalizeText(stage.label);
    const heading = Array.from(
      rootRef.current.querySelectorAll<HTMLElement>(
        "h2, h3, h4, h5, [class*='font-semibold'], [class*='font-bold']",
      ),
    ).find((element) => normalizeText(element.textContent ?? "") === expected);

    heading?.closest<HTMLElement>("[class*='rounded'], .overflow-hidden")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="journey-shell" dir={isArabic ? "rtl" : "ltr"}>
      <Header />

      <main className="journey-main">
        <Link to="/" className="journey-back-link">
          <BackIcon className="h-4 w-4" />
          {copy.common.backToServices}
        </Link>

        <section className="journey-hero">
          <div className="journey-hero-copy">
            <span className="journey-eyebrow">{copy.common.technologyCenterTool}</span>
            <h1>{copy.navigation.projectJourneyChecklist}</h1>
            <p>
              {isArabic
                ? "مسار موحّد يوضح ما يجب تنفيذه من بداية المشروع وحتى النشر، مع طلبات Jira والملاحظات المطلوبة لكل مرحلة."
                : "A structured path from project setup to publishing, with the required Jira requests, actions, and guidance for every stage."}
            </p>
          </div>
          <div className="journey-hero-badge">
            <Layers3 className="h-7 w-7" />
            <span>{isArabic ? "5 مراحل" : "5 stages"}</span>
          </div>
        </section>

        <section className="journey-roadmap" aria-label={isArabic ? "مراحل رحلة المشروع" : "Project journey stages"}>
          <div className="journey-roadmap-heading">
            <div>
              <span>{isArabic ? "المسار" : "Journey map"}</span>
              <h2>{isArabic ? "اتبع المراحل بالترتيب" : "Follow the stages in order"}</h2>
            </div>
            <p>{isArabic ? "اضغط على المرحلة للانتقال إلى تفاصيلها." : "Select a stage to jump to its details."}</p>
          </div>

          <div className="journey-stage-track">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = activeStage === index;
              return (
                <button
                  key={stage.en}
                  type="button"
                  onClick={() => navigateToStage(stage, index)}
                  className={`journey-stage ${isActive ? "is-active" : ""}`}
                >
                  <span className="journey-stage-index">{index + 1}</span>
                  <span className="journey-stage-icon"><Icon className="h-5 w-5" /></span>
                  <span className="journey-stage-copy">
                    <strong>{isArabic ? stage.ar : stage.en}</strong>
                    <small>{isArabic ? stage.descriptionAr : stage.description}</small>
                  </span>
                  <ChevronRight className="journey-stage-arrow h-4 w-4" />
                </button>
              );
            })}
          </div>
        </section>

        <div className="journey-layout">
          <aside className="journey-side-nav" aria-label={isArabic ? "التنقل بين المراحل" : "Journey navigation"}>
            <div className="journey-side-nav-card">
              <span>{isArabic ? "التنقل السريع" : "Quick navigation"}</span>
              <nav>
                {stages.map((stage, index) => {
                  const Icon = stage.icon;
                  return (
                    <button
                      key={stage.en}
                      type="button"
                      onClick={() => navigateToStage(stage, index)}
                      className={activeStage === index ? "is-active" : ""}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{isArabic ? stage.ar : stage.en}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <section
            ref={rootRef}
            data-language={language}
            className="project-journey-page-content"
            id="project-journey-checklist"
          >
            <ProjectJourneyChecklist />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectJourneyPage;
