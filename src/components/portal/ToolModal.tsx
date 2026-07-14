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
import "@/styles/checklist-modal-layout.css";
import "@/styles/checklist-section-fixes.css";

export type PortalTool =
  | "project-journey-checklist"
  | "request-finder"
  | "quick-request-match";

interface ToolModalProps {
  tool: PortalTool | null;
  onClose: () => void;
}

const arabicChecklistTerms: Record<string, string> = {
  "Final Check Before Proceeding": "التحقق النهائي قبل المتابعة",
  "Before you move forward, make sure you have completed the checklist items below.":
    "قبل المتابعة، تأكد من إكمال جميع عناصر قائمة التحقق أدناه.",
  "Platform & Deployment Guidelines": "إرشادات Platform وDeployment",
  "Platform Runtime Support": "التقنيات المدعومة على Platform",
  "Infrastructure Requirements by Platform": "متطلبات Infrastructure حسب Platform",
  "Critical Requirement": "متطلب أساسي",
  "Important Notes": "ملاحظات مهمة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "تقنيات التطبيق",
  "Database": "Database",
  "Supported Technologies": "التقنيات المدعومة",
  "Developer Access Checklist": "قائمة صلاحيات المطور",
  "Required": "إلزامي",
  "Conditional": "حسب الحاجة",
  "Optional": "اختياري",
  "Grant Access From": "طلب الصلاحية من",
  "Owner": "الفريق المسؤول",
  "Comment": "ملاحظة",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Change Request in Jira": "فتح Change Request في Jira",
  "Open publish request in Jira": "فتح طلب النشر في Jira",
  "Open Service Design Change": "فتح Service Design Change",
  "Internal Publish": "نشر داخلي",
  "External Publish": "نشر خارجي",
  "Internal Publish Requirements:": "متطلبات النشر الداخلي:",
  "External Publish Requirements:": "متطلبات النشر الخارجي:",
  "Publishing": "النشر",
  "Parallel Actions": "الأنشطة المتوازية",
  "Deployment": "Deployment",
  "Deployment Notes:": "ملاحظات Deployment:",
  "You MUST identify and specify the supporting technology for your project before submitting any requests.":
    "يجب تحديد التقنية الداعمة للمشروع قبل إرسال أي طلب.",
  'Refer to the "Supported Technologies" section above to choose the appropriate technology stack for your infrastructure and application needs.':
    "راجع قسم التقنيات المدعومة أعلاه لاختيار Technology Stack المناسب لاحتياج Infrastructure والتطبيق.",
  "MRF document can be found at: wiki.elm.sa": "يمكن العثور على مستند MRF في: wiki.elm.sa",
  "Always identify the supporting technology required before proceeding":
    "حدد التقنية الداعمة المطلوبة دائماً قبل المتابعة.",
  "OpenShift (OCP) supported runtime technologies: Java, .NET, Node.js, Python":
    "تقنيات Runtime المدعومة على OpenShift (OCP): Java و.NET وNode.js وPython",
  "Virtual Machines (VMs) supported operating systems: Linux, Windows":
    "أنظمة التشغيل المدعومة على Virtual Machines (VMs): Linux وWindows",
  "For VMs: Load Balancer and Web Application Firewall (WAF) must be configured":
    "لـ VMs: يجب إعداد Load Balancer وWeb Application Firewall (WAF).",
  "For OCP: No Load Balancer or WAF configuration is required":
    "لـ OCP: لا يلزم إعداد Load Balancer أو WAF.",
};

const localizeChecklistContent = (root: HTMLElement, isArabic: boolean) => {
  root.dataset.language = isArabic ? "ar" : "en";
  if (!isArabic) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const original = node.nodeValue?.trim();
    if (!original) return;

    const translated = arabicChecklistTerms[original];
    if (translated) {
      node.nodeValue = node.nodeValue?.replace(original, translated) ?? translated;
    }
  });
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
        contentRef.current
          ?.querySelector<HTMLElement>(".premium-tool-card")
          ?.click();
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
    const applyLocalization = () => localizeChecklistContent(root, isArabic);
    applyLocalization();

    const observer = new MutationObserver(applyLocalization);
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [tool, isArabic]);

  if (!tool) return null;

  const config = {
    "project-journey-checklist": {
      title: copy.navigation.projectJourneyChecklist,
      description: isArabic
        ? "راجع رحلة المشروع كاملة، وافتح الطلبات والروابط المطلوبة لكل مرحلة."
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
        className={`tool-modal-shell flex max-h-[95vh] w-full ${config.width} flex-col overflow-hidden rounded-2xl border border-[#dfe1e6] bg-white shadow-[0_28px_80px_rgba(9,30,66,0.34)]`}
      >
        <div className="tool-modal-header flex shrink-0 items-center justify-between gap-4 border-b border-[#ebecf0] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2
                id="technology-tool-modal-title"
                className="truncate text-base font-bold text-[#172b4d] sm:text-lg"
              >
                {config.title}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-xs text-[#5e6c84] sm:text-sm">
                {config.description}
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

        <div
          ref={contentRef}
          className={`tool-modal-content tool-modal-${tool} min-h-0 flex-1 overflow-y-auto bg-[#f7f8f9] p-3 sm:p-5 ${
            tool === "project-journey-checklist"
              ? "standalone-checklist journey-redesign"
              : ""
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
