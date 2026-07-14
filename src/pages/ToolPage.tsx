import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, Route, WandSparkles } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";

type ToolType = "checklist" | "finder" | "match";

interface ToolPageProps {
  tool: ToolType;
}

const toolCopy = {
  checklist: {
    en: "Project Journey Checklist",
    ar: "قائمة رحلة المشروع",
    descriptionEn:
      "A complete, step-by-step view of the technology activities, required requests, approvals, access, deployment, publishing, and handover tasks for a project or product.",
    descriptionAr:
      "عرض متكامل خطوة بخطوة للأنشطة التقنية والطلبات والموافقات والصلاحيات والنشر والتسليم المطلوبة للمشروع أو المنتج.",
  },
  finder: {
    en: "Request Finder",
    ar: "موجّه الطلبات",
    descriptionEn: "Answer the guided questions to build the correct request journey for your project or product.",
    descriptionAr: "أجب عن الأسئلة الموجّهة لبناء مسار الطلبات الصحيح لمشروعك أو منتجك.",
  },
  match: {
    en: "Quick Request Match",
    ar: "المطابقة السريعة للطلب",
    descriptionEn: "Answer two quick questions and receive the most relevant service-request recommendations.",
    descriptionAr: "أجب عن سؤالين سريعين للحصول على أنسب طلبات الخدمات التقنية.",
  },
} as const;

const ToolPage = ({ tool }: ToolPageProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const copy = toolCopy[tool];
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const toolRootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const collapsedCard = toolRootRef.current?.querySelector<HTMLElement>(".premium-tool-card");
    collapsedCard?.click();
  }, [tool]);

  const ToolIcon = tool === "checklist" ? Layers3 : tool === "finder" ? Route : WandSparkles;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/"
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30"
        >
          <BackIcon className="h-4 w-4" />
          {isArabic ? "العودة إلى جميع الخدمات" : "Back to all services"}
        </Link>

        <section className="mb-6 overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_1px_2px_rgba(9,30,66,0.08)]">
          <div className="grid gap-5 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#0c66e4]">
                <ToolIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0c66e4]">
                  {isArabic ? "أداة مركز التقنية" : "Technology Center tool"}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172b4d] sm:text-3xl">
                  {isArabic ? copy.ar : copy.en}
                </h1>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#5e6c84] sm:text-[15px]">
                  {isArabic ? copy.descriptionAr : copy.descriptionEn}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
              {[
                isArabic ? "تجربة موجهة" : "Guided experience",
                isArabic ? "نتائج من بيانات الطلبات" : "Live request data",
                isArabic ? "روابط Jira مباشرة" : "Direct Jira links",
              ].map((label) => (
                <span key={label} className="rounded-full border border-[#b6d7ff] bg-[#e9f2ff] px-3 py-1.5 text-xs font-semibold text-[#0747a6]">
                  {label}
                </span>
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
