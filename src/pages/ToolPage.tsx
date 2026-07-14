import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";

type ToolType = "checklist" | "finder" | "match";

interface ToolPageProps {
  tool: ToolType;
}

const toolCopy = {
  checklist: {
    en: "Project Journey Checklist",
    ar: "قائمة رحلة المشروع",
    descriptionEn: "Review the complete technology journey and required requests before delivery.",
    descriptionAr: "راجع رحلة المشروع التقنية والطلبات المطلوبة قبل التسليم.",
  },
  finder: {
    en: "Request Finder",
    ar: "موجّه الطلبات",
    descriptionEn: "Follow the guided project journey to identify the requests you need.",
    descriptionAr: "اتبع رحلة المشروع الموجّهة لتحديد الطلبات التي تحتاجها.",
  },
  match: {
    en: "Quick Request Match",
    ar: "المطابقة السريعة للطلب",
    descriptionEn: "Answer a few questions to quickly find the most relevant request.",
    descriptionAr: "أجب عن أسئلة بسيطة للوصول بسرعة إلى الطلب الأنسب.",
  },
} as const;

const ToolPage = ({ tool }: ToolPageProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const copy = toolCopy[tool];
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]">
      <Header />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30"
        >
          <BackIcon className="h-4 w-4" />
          {isArabic ? "العودة إلى جميع الخدمات" : "Back to all services"}
        </Link>

        <div className="mb-6 rounded-xl border border-[#dfe1e6] bg-white px-5 py-5 shadow-sm sm:px-6">
          <h1 className="text-2xl font-bold text-[#172b4d]">{isArabic ? copy.ar : copy.en}</h1>
          <p className="mt-1 text-sm leading-6 text-[#5e6c84]">
            {isArabic ? copy.descriptionAr : copy.descriptionEn}
          </p>
        </div>

        <section id={tool === "checklist" ? "project-journey-checklist" : tool === "finder" ? "request-finder" : "quick-request-match"}>
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
