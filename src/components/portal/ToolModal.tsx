import { useEffect, useRef } from "react";
import { HelpCircle, Layers3, WandSparkles, X } from "lucide-react";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import CatalogRequestFinder from "@/components/portal/CatalogRequestFinder";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";
import "@/styles/tool-localization.css";
import "@/styles/project-journey-redesign.css";
import "@/styles/tool-modal.css";

export type PortalTool = "project-journey-checklist" | "request-finder" | "quick-request-match";

interface ToolModalProps {
  tool: PortalTool | null;
  onClose: () => void;
}

const ToolModal = ({ tool, onClose }: ToolModalProps) => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tool) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    // The checklist still has a legacy collapsed launcher internally.
    const timer = window.setTimeout(() => {
      if (tool === "project-journey-checklist") {
        contentRef.current?.querySelector<HTMLElement>(".premium-tool-card")?.click();
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [tool, onClose]);

  if (!tool) return null;

  const config = {
    "project-journey-checklist": {
      title: copy.navigation.projectJourneyChecklist,
      description: isArabic
        ? "راجع رحلة المشروع كاملة، وافتح الطلبات والروابط المطلوبة لكل مرحلة."
        : "Review the complete project journey and open the requests and links required for each stage.",
      icon: Layers3,
      width: "max-w-[1540px]",
    },
    "request-finder": {
      title: isArabic ? "معالج متطلبات المشروع" : "Project Requirements Wizard",
      description: isArabic
        ? "أجب على أسئلة بسيطة واحصل على الطلبات الأنسب من كامل الكتالوج."
        : "Answer a few questions to find the best matches from the complete request catalog.",
      icon: HelpCircle,
      width: "max-w-6xl",
    },
    "quick-request-match": {
      title: copy.navigation.quickRequestMatch,
      description: isArabic
        ? "أجب عن سؤالين للوصول بسرعة إلى أنسب طلبات الخدمات التقنية."
        : "Answer two quick questions to find the most relevant technology requests.",
      icon: WandSparkles,
      width: "max-w-6xl",
    },
  }[tool];

  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#091e42]/55 p-2 backdrop-blur-[1px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="technology-tool-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`tool-modal-shell flex max-h-[95vh] w-full ${config.width} flex-col overflow-hidden rounded-2xl border border-[#dfe1e6] bg-white shadow-[0_28px_80px_rgba(9,30,66,0.34)]`}>
        <div className="tool-modal-header flex shrink-0 items-center justify-between gap-4 border-b border-[#ebecf0] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="technology-tool-modal-title" className="truncate text-base font-bold text-[#172b4d] sm:text-lg">
                {config.title}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-xs text-[#5e6c84] sm:text-sm">{config.description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#44546f] transition hover:bg-[#f1f2f4] hover:text-[#172b4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/40"
            aria-label={isArabic ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={contentRef}
          className={`tool-modal-content tool-modal-${tool} min-h-0 flex-1 overflow-y-auto bg-[#f7f8f9] p-3 sm:p-5 ${
            tool === "project-journey-checklist" ? "standalone-checklist journey-redesign" : ""
          }`}
        >
          {tool === "project-journey-checklist" && <ProjectJourneyChecklist />}
          {tool === "request-finder" && <CatalogRequestFinder />}
          {tool === "quick-request-match" && <GuidedWizard />}
        </div>
      </div>
    </div>
  );
};

export default ToolModal;
