import { useEffect, useRef } from "react";
import { HelpCircle, X } from "lucide-react";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/request-finder-modal.css";

interface RequestFinderModalProps {
  open: boolean;
  onClose: () => void;
}

const RequestFinderModal = ({ open, onClose }: RequestFinderModalProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    const timer = window.setTimeout(() => {
      contentRef.current?.querySelector<HTMLElement>(".premium-tool-card")?.click();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#091e42]/55 p-3 backdrop-blur-[1px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-finder-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#dfe1e6] bg-white shadow-[0_28px_80px_rgba(9,30,66,0.32)]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#ebecf0] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="request-finder-modal-title" className="truncate text-base font-bold text-[#172b4d] sm:text-lg">
                {isArabic ? "معالج متطلبات المشروع" : "Project Requirements Wizard"}
              </h2>
              <p className="mt-0.5 text-xs text-[#5e6c84] sm:text-sm">
                {isArabic ? "أجب على أسئلة بسيطة واحصل على رحلة وطلبات مناسبة لمشروعك." : "Answer a few questions to get a recommended project journey and request list."}
              </p>
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

        <div ref={contentRef} className="request-finder-modal standalone-interactive-tool min-h-0 flex-1 overflow-y-auto bg-[#f7f8f9] p-4 sm:p-6">
          <ProjectJourneyGuide />
        </div>
      </div>
    </div>
  );
};

export default RequestFinderModal;
