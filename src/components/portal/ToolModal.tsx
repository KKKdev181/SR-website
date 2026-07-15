import { useEffect, useRef } from "react";
import { HelpCircle, Layers3, WandSparkles, X } from "lucide-react";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import CatalogRequestFinder from "@/components/portal/CatalogRequestFinder";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";
import "@/styles/tool-modal.css";
import "@/styles/project-journey-flow.css";

export type PortalTool =
  | "project-journey-checklist"
  | "request-finder"
  | "quick-request-match";

interface ToolModalProps {
  tool: PortalTool | null;
  onClose: () => void;
}

const arabicUiTerms: Record<string, string> = {
  "Deployment": "Deployment",
  "Deployment Notes:": "ملاحظات Deployment:",
  "Before going live, make sure the deployment change is opened and tracked in Jira.":
    "قبل الإطلاق، تأكد من فتح Change Request ومتابعته في Jira.",
  "Open a Change Request in Jira before deployment.": "افتح Change Request في Jira قبل Deployment.",
  "Attach the MRF and required approvals if applicable.": "أرفق MRF والموافقات المطلوبة عند الحاجة.",
  "Coordinate the deployment with APP, DB, OPM, and CM teams.":
    "نسّق Deployment مع فرق APP وDB وOPM وCM.",
  "Track the deployment execution and closure through Jira.": "تابع تنفيذ Deployment وإغلاقه من خلال Jira.",
  "Open Change Request in Jira": "فتح Change Request في Jira",
  "Publishing": "النشر",
  "Ask the user if they want to publish internally or externally.":
    "حدد ما إذا كان النشر داخلياً أو خارجياً.",
  "Internal Publish": "نشر داخلي",
  "External Publish": "نشر خارجي",
  "Internal Publish Requirements:": "متطلبات النشر الداخلي:",
  "External Publish Requirements:": "متطلبات النشر الخارجي:",
  "Open publish request in Jira": "فتح طلب النشر في Jira",
  "Open Service Design Change": "فتح Service Design Change",
  "Parallel Actions": "الأنشطة المتوازية",
  "Developer Access Checklist": "قائمة صلاحيات المطور",
  "Show more": "عرض المزيد",
  "Hide list": "إخفاء القائمة",
  "Required": "إلزامي",
  "Conditional": "حسب الحاجة",
  "Optional": "اختياري",
  "Grant Access From": "طلب الصلاحية من",
  "Owner": "الفريق المسؤول",
  "Comment": "ملاحظة",
  "Supported Technologies": "التقنيات المدعومة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "تقنيات التطبيق",
  "Database": "Database",
  "Final Check Before Proceeding": "التحقق النهائي قبل المتابعة",
  "Before you move forward, make sure you have completed the checklist items below.":
    "قبل المتابعة، تأكد من إكمال جميع عناصر قائمة التحقق أدناه.",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Link": "فتح الرابط",
  "Open": "فتح",
  "Service Name:": "اسم الخدمة:",
  "Important Notes:": "ملاحظات مهمة:",
};

const localizeLegacyChecklist = (root: HTMLElement, isArabic: boolean) => {
  root.dataset.language = isArabic ? "ar" : "en";
  if (!isArabic) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const value = textNode.nodeValue?.trim();
    const translated = value ? arabicUiTerms[value] : undefined;

    if (value && translated) {
      textNode.nodeValue = textNode.nodeValue?.replace(value, translated) ?? translated;
    }

    node = walker.nextNode();
  }
};

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

  useEffect(() => {
    if (tool !== "project-journey-checklist" || !contentRef.current) return;

    const root = contentRef.current;
    const apply = () => localizeLegacyChecklist(root, isArabic);
    apply();

    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [tool, isArabic]);

  if (!tool) return null;

  const config = {
    "project-journey-checklist": {
      title: copy.navigation.projectJourneyChecklist,
      description: isArabic
        ? "راجع رحلة المشروع كاملة وافتح الطلبات والروابط المطلوبة لكل مرحلة."
        : "Review the complete project journey and open the requests and links required for each stage.",
      icon: Layers3,
      width: "max-w-[1320px]",
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
      <div
        className={`tool-modal-shell flex max-h-[95vh] w-full ${config.width} flex-col overflow-hidden rounded-2xl border border-[#d8e2ec] bg-white shadow-[0_28px_80px_rgba(9,30,66,0.34)]`}
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

        <div
          ref={contentRef}
          data-language={language}
          className={`tool-modal-content tool-modal-${tool} min-h-0 flex-1 overflow-y-auto bg-[#f4f7fa] p-3 sm:p-5 ${
            tool === "project-journey-checklist" ? "project-journey-flow" : ""
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
