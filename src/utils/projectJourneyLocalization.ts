const translations: Record<string, string> = {
  "Deployment Notes:": "ملاحظات Deployment:",
  "Before going live, make sure the deployment change is opened and tracked in Jira.": "قبل الإطلاق، تأكد من فتح Change Request ومتابعته في Jira.",
  "Open a Change Request in Jira before deployment.": "افتح Change Request في Jira قبل Deployment.",
  "Attach the MRF and required approvals if applicable.": "أرفق MRF والموافقات المطلوبة عند الحاجة.",
  "Coordinate the deployment with APP, DB, OPM, and CM teams.": "نسّق Deployment مع فرق APP وDB وOPM وCM.",
  "Track the deployment execution and closure through Jira.": "تابع تنفيذ Deployment وإغلاقه من خلال Jira.",
  "Open Change Request in Jira": "فتح Change Request في Jira",
  Publishing: "النشر",
  "Ask the user if they want to publish internally or externally.": "حدد ما إذا كان النشر داخلياً أو خارجياً.",
  "Internal Publish": "نشر داخلي",
  "External Publish": "نشر خارجي",
  "Parallel Actions": "الأنشطة المتوازية",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Link": "فتح الرابط",
  Open: "فتح",
  "Service Name:": "اسم الخدمة:",
  "Important Notes:": "ملاحظات مهمة:",
  "Final Check Before Proceeding": "التحقق النهائي قبل المتابعة",
  "Before you move forward, make sure you have completed the checklist items below.": "قبل المتابعة، تأكد من إكمال جميع عناصر قائمة التحقق أدناه.",
  "Developer Access Checklist": "قائمة صلاحيات المطور",
  "Show more": "عرض المزيد",
  "Hide list": "إخفاء القائمة",
  Required: "إلزامي",
  Conditional: "حسب الحاجة",
  Optional: "اختياري",
  "Supported Technologies": "التقنيات المدعومة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "تقنيات التطبيق",
  "Platform & Deployment Guidelines": "إرشادات Platform وDeployment",
  "Platform Runtime Support": "التقنيات المدعومة على Platform",
  "Infrastructure Requirements by Platform": "متطلبات Infrastructure حسب Platform",
  "Critical Requirement": "متطلب أساسي",
  "MRF document can be found at: wiki.elm.sa": "يمكن العثور على مستند MRF في: wiki.elm.sa",
  "Always identify the supporting technology required before proceeding.": "حدد التقنية الداعمة المطلوبة دائماً قبل المتابعة."
};

const originalText = new WeakMap<Text, string>();
const originalDisplay = new WeakMap<HTMLElement, string>();

const restore = (root: HTMLElement) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    const saved = originalText.get(text);
    if (saved !== undefined) text.nodeValue = saved;
    node = walker.nextNode();
  }
  root.querySelectorAll<HTMLElement>("*").forEach((element) => {
    const display = originalDisplay.get(element);
    if (display !== undefined) element.style.display = display;
  });
};

const rememberDisplay = (element: HTMLElement) => {
  if (!originalDisplay.has(element)) originalDisplay.set(element, element.style.display);
};

export const localizeProjectJourney = (root: HTMLElement, isArabic: boolean): void => {
  restore(root);
  root.dataset.language = isArabic ? "ar" : "en";

  const arabicBlocks = Array.from(root.querySelectorAll<HTMLElement>("[lang='ar'], [dir='rtl']"));
  arabicBlocks.forEach((element) => {
    rememberDisplay(element);
    element.style.display = isArabic ? "" : "none";
  });

  if (!isArabic) return;

  arabicBlocks.forEach((arabicElement) => {
    let sibling = arabicElement.previousElementSibling as HTMLElement | null;
    while (sibling && sibling.parentElement === arabicElement.parentElement) {
      if (sibling.matches("button, a, svg") || sibling.querySelector("button, a")) break;
      rememberDisplay(sibling);
      sibling.style.display = "none";
      sibling = sibling.previousElementSibling as HTMLElement | null;
    }
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    const value = text.nodeValue?.trim();
    const parent = text.parentElement;
    if (value && parent && !parent.closest("[lang='ar']")) {
      const translated = translations[value];
      if (translated) {
        if (!originalText.has(text)) originalText.set(text, text.nodeValue ?? "");
        text.nodeValue = text.nodeValue?.replace(value, translated) ?? translated;
      }
    }
    node = walker.nextNode();
  }
};
