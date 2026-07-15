const arabicUiTerms: Record<string, string> = {
  Deployment: "Deployment",
  "Deployment Notes:": "ملاحظات Deployment:",
  "Before going live, make sure the deployment change is opened and tracked in Jira.":
    "قبل الإطلاق، تأكد من فتح Change Request ومتابعته في Jira.",
  "Open a Change Request in Jira before deployment.": "افتح Change Request في Jira قبل Deployment.",
  "Attach the MRF and required approvals if applicable.": "أرفق MRF والموافقات المطلوبة عند الحاجة.",
  "Coordinate the deployment with APP, DB, OPM, and CM teams.": "نسّق Deployment مع فرق APP وDB وOPM وCM.",
  "Track the deployment execution and closure through Jira.": "تابع تنفيذ Deployment وإغلاقه من خلال Jira.",
  "Open Change Request in Jira": "فتح Change Request في Jira",
  Publishing: "النشر",
  "Ask the user if they want to publish internally or externally.": "حدد ما إذا كان النشر داخلياً أو خارجياً.",
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
  Required: "إلزامي",
  Conditional: "حسب الحاجة",
  Optional: "اختياري",
  "Grant Access From": "طلب الصلاحية من",
  Owner: "الفريق المسؤول",
  Comment: "ملاحظة",
  "Supported Technologies": "التقنيات المدعومة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "تقنيات التطبيق",
  "Final Check Before Proceeding": "التحقق النهائي قبل المتابعة",
  "Before you move forward, make sure you have completed the checklist items below.":
    "قبل المتابعة، تأكد من إكمال جميع عناصر قائمة التحقق أدناه.",
  "Platform & Deployment Guidelines": "إرشادات Platform وDeployment",
  "Platform Runtime Support": "التقنيات المدعومة على Platform",
  "Infrastructure Requirements by Platform": "متطلبات Infrastructure حسب Platform",
  "Critical Requirement": "متطلب أساسي",
  "You MUST identify and specify the supporting technology for your project before submitting any requests.":
    "يجب تحديد التقنية الداعمة للمشروع قبل إرسال أي طلب.",
  'Refer to the "Supported Technologies" section above to choose the appropriate technology stack for your infrastructure and application needs.':
    "راجع قسم التقنيات المدعومة أعلاه لاختيار Technology Stack المناسب لاحتياج Infrastructure والتطبيق.",
  "MRF document can be found at: wiki.elm.sa": "يمكن العثور على مستند MRF في: wiki.elm.sa",
  "Always identify the supporting technology required before proceeding.": "حدد التقنية الداعمة المطلوبة دائماً قبل المتابعة.",
  "OpenShift (OCP) supported runtime technologies: Java, .NET, Node.js, Python":
    "تقنيات Runtime المدعومة على OpenShift (OCP): Java و.NET وNode.js وPython",
  "Virtual Machines (VMs) supported operating systems: Linux, Windows":
    "أنظمة التشغيل المدعومة على Virtual Machines (VMs): Linux وWindows",
  "For VMs: Load Balancer and Web Application Firewall (WAF) must be configured.":
    "لـ VMs: يجب إعداد Load Balancer وWeb Application Firewall (WAF).",
  "For OCP: No Load Balancer or WAF configuration is required.":
    "لـ OCP: لا يلزم إعداد Load Balancer أو WAF.",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Link": "فتح الرابط",
  Open: "فتح",
  "Service Name:": "اسم الخدمة:",
  "Important Notes:": "ملاحظات مهمة:",
  items: "عناصر",
  "Basic Project Access": "الوصول الأساسي للمشروع",
  "Source Code & Repository Setup": "إعداد Source Code وRepository",
  "Development Environment Access": "صلاحيات بيئة التطوير",
  "Deployment & CI/CD": "Deployment وCI/CD",
  "Database & Production Access": "صلاحيات Database وProduction",
  "Remote / Laptop Access": "صلاحيات Remote وLaptop",
};

const originalText = new WeakMap<Text, string>();
const originalDisplay = new WeakMap<HTMLElement, string>();

const rememberElement = (element: HTMLElement): void => {
  if (!originalDisplay.has(element)) originalDisplay.set(element, element.style.display);
};

const restoreDom = (root: HTMLElement): void => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const saved = originalText.get(textNode);
    if (saved !== undefined) textNode.nodeValue = saved;
    node = walker.nextNode();
  }

  root.querySelectorAll<HTMLElement>("*").forEach((element) => {
    const display = originalDisplay.get(element);
    if (display !== undefined) element.style.display = display;
  });
};

const getArabicBlocks = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>("[lang='ar'], [dir='rtl']"));

const hideEnglishPairForArabicBlock = (arabicElement: HTMLElement): void => {
  let sibling = arabicElement.previousElementSibling as HTMLElement | null;

  while (sibling && sibling.parentElement === arabicElement.parentElement) {
    if (sibling.matches("svg, button, a") || sibling.querySelector("button, a")) break;
    rememberElement(sibling);
    sibling.style.display = "none";
    sibling = sibling.previousElementSibling as HTMLElement | null;
  }
};

export const localizeProjectJourney = (root: HTMLElement, isArabic: boolean): void => {
  restoreDom(root);
  root.dataset.language = isArabic ? "ar" : "en";

  const arabicBlocks = getArabicBlocks(root);

  if (!isArabic) {
    arabicBlocks.forEach((element) => {
      rememberElement(element);
      element.style.display = "none";
    });
    return;
  }

  arabicBlocks.forEach((element) => {
    rememberElement(element);
    element.style.display = "";
    hideEnglishPairForArabicBlock(element);
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const value = textNode.nodeValue?.trim();
    const parent = textNode.parentElement;

    if (value && parent && !parent.closest("[lang='ar'], [dir='rtl']")) {
      if (!originalText.has(textNode)) originalText.set(textNode, textNode.nodeValue ?? "");
      const translated = arabicUiTerms[value];
      if (translated && !parent.querySelector("[lang='ar'], [dir='rtl']")) {
        textNode.nodeValue = textNode.nodeValue?.replace(value, translated) ?? translated;
      }
    }

    node = walker.nextNode();
  }
};
