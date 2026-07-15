import { useEffect } from "react";
import { HelpCircle, WandSparkles, X } from "lucide-react";
import CatalogRequestFinder from "@/components/portal/CatalogRequestFinder";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";
import "@/styles/tool-modal.css";

export type PortalTool = "request-finder" | "quick-request-match";

interface ToolModalProps {
  tool: PortalTool | null;
  onClose: () => void;
}

const ToolModal = ({ tool, onClose }: ToolModalProps) => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    if (!tool) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [tool, onClose]);

  if (!tool) return null;

  const config = tool === "request-finder"
    ? {
        title: isArabic ? "معالج متطلبات المشروع" : "Project Requirements Wizard",
        description: isArabic
          ? "أجب على أسئلة بسيطة واحصل على الطلبات الأنسب من كامل الكتالوج."
          : "Answer a few questions to find the best matches from the complete request catalog.",
        icon: HelpCircle,
      }
    : {
        title: copy.navigation.quickRequestMatch,
        description: isArabic
          ? "أجب عن سؤالين للوصول بسرعة إلى أنسب طلبات الخدمات التقنية."
          : "Answer two quick questions to find the most relevant technology requests.",
        icon: WandSparkles,
      };

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
      <div
        className="tool-modal-shell flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#d8e2ec] bg-white shadow-[0_28px_80px_rgba(9,30,66,0.34)]"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <header className="tool-modal-header flex shrink-0 items-center justify-between gap-4 border-b border-[#d8e2ec] bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#0057b8]">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="technology-tool-modal-title" className="truncate text-base font-bold text-[#102a43] sm:text-lg">
                {config.title}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-xs text-[#5f738c] sm:text-sm">
                {config.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#44546f] transition hover:bg-[#edf5ff] hover:text-[#0057b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057b8]/35"
            aria-label={isArabic ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className={`tool-modal-content tool-modal-${tool} min-h-0 flex-1 overflow-y-auto bg-[#f4f7fa] p-3 sm:p-5`}>
          {tool === "request-finder" ? <CatalogRequestFinder /> : <GuidedWizard />}
        </div>
      </div>
    </div>
  );
};

export default ToolModal;
