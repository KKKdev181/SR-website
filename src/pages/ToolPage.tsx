import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Layers3, Route, WandSparkles } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";
import "@/styles/tool-localization.css";

type ToolType = "checklist" | "finder" | "match";

interface ToolPageProps {
  tool: ToolType;
}

const ToolPage = ({ tool }: ToolPageProps) => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const toolRootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const collapsedCard = toolRootRef.current?.querySelector<HTMLElement>(".premium-tool-card");
    collapsedCard?.click();
  }, [tool]);

  const title = tool === "checklist" ? copy.navigation.projectJourneyChecklist : tool === "finder" ? copy.tools.finderTitle : copy.tools.matchTitle;
  const description = tool === "checklist" ? copy.tools.checklistDescription : tool === "finder" ? copy.tools.finderDescription : copy.tools.matchDescription;
  const ToolIcon = tool === "checklist" ? Layers3 : tool === "finder" ? Route : WandSparkles;
  const badges = tool === "checklist"
    ? [copy.common.allDetailsPreserved, copy.common.directJiraLinks, copy.common.expandablePhases]
    : [copy.common.guidedExperience, copy.common.liveRequestData, copy.common.directJiraLinks];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link to="/" className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30">
          <BackIcon className="h-4 w-4" />
          {copy.common.backToServices}
        </Link>

        <section className="mb-6 overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_1px_2px_rgba(9,30,66,0.08)]">
          <div className="grid gap-5 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#0c66e4]"><ToolIcon className="h-6 w-6" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0c66e4]">{copy.common.technologyCenterTool}</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172b4d] sm:text-3xl">{title}</h1>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#5e6c84] sm:text-[15px]">{description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
              {badges.map((label) => (
                <span key={label} className="rounded-full border border-[#b6d7ff] bg-[#e9f2ff] px-3 py-1.5 text-xs font-semibold text-[#0747a6]">{label}</span>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={toolRootRef}
          id={tool === "checklist" ? "project-journey-checklist" : tool === "finder" ? "request-finder" : "quick-request-match"}
          className={tool === "checklist" ? "standalone-checklist" : "standalone-interactive-tool"}
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
