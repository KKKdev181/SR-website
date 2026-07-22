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
  "External Publish Requirements:": "متطلبات النشر الخارجي:",
  "Internal Publish Requirements:": "متطلبات النشر الداخلي:",
  "Open publish request in Jira": "فتح طلب النشر في Jira",
  "Open Service Design Change": "فتح Service Design Change",
  "Parallel Actions": "الأنشطة المتوازية",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Link": "فتح الرابط",
  Open: "فتح",
  "Service Name:": "اسم الخدمة:",
  "Important Notes:": "ملاحظات مهمة:",
  "Final Check Before Proceeding": "التحقق النهائي قبل المتابعة",
  "Before you move forward, make sure you have completed the checklist items below.": "قبل المتابعة، تأكد من إكمال جميع عناصر قائمة التحقق أدناه.",
  "Developer Access Checklist": "قائمة وصول المطور",
  "Show more": "إظهار المزيد",
  "Hide list": "إخفاء القائمة",
  "Developer tools and access list are visible now. Click the button to hide the list.": "قائمة أدوات وصلاحيات المطور ظاهرة الآن. اضغط على الزر لإخفاء القائمة.",
  "Developer tools, access links, owners, and comments are hidden to keep the page clean. Click إظهار المزيد to view the full list.": "تم إخفاء أدوات المطور وروابط الوصول والجهات المسؤولة والملاحظات لتبقى الصفحة مرتبة. اضغط على إظهار المزيد لعرض القائمة كاملة.",
  Required: "إلزامي",
  Conditional: "حسب الحاجة",
  Optional: "اختياري",
  "Supported Technologies": "التقنيات المدعومة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "تقنيات التطبيق",
  Database: "قواعد البيانات",
  "Grant Access From": "مصدر منح الصلاحية",
  Owner: "الجهة المسؤولة",
  Comment: "ملاحظة",
  items: "عناصر",
  "Platform & Deployment Guidelines": "إرشادات Platform وDeployment",
  "Platform Runtime Support": "التقنيات المدعومة على Platform",
  "Infrastructure Requirements by Platform": "متطلبات Infrastructure حسب Platform",
  "Critical Requirement": "متطلب أساسي",
  "MRF document can be found at: wiki.elm.sa": "يمكن العثور على مستند MRF في: wiki.elm.sa",
  "Always identify the supporting technology required before proceeding.": "حدد التقنية الداعمة المطلوبة دائماً قبل المتابعة."
};

const originalText = new WeakMap<Text, string>();
const originalDisplay = new WeakMap<HTMLElement, string>();
const localizationObservers = new WeakMap<HTMLElement, MutationObserver>();

const normalizeText = (value: string): string =>
  value.replace(/[|\s\u200e\u200f]+/g, "").toLowerCase();

const normalizedTranslations = new Map(
  Object.entries(translations).map(([key, value]) => [normalizeText(key), value]),
);

const getTranslation = (value: string): string | undefined =>
  translations[value] ?? normalizedTranslations.get(normalizeText(value));

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

const hideElement = (element: HTMLElement) => {
  rememberDisplay(element);
  element.style.display = "none";
};

const observeLocalizationChanges = (root: HTMLElement) => {
  let observer = localizationObservers.get(root);

  if (!observer) {
    observer = new MutationObserver(() => {
      localizeProjectJourney(root, root.dataset.language === "ar");
    });
    localizationObservers.set(root, observer);
  }

  observer.observe(root, {
    childList: true,
    characterData: true,
    subtree: true,
  });
};

export const localizeProjectJourney = (root: HTMLElement, isArabic: boolean): void => {
  const observer = localizationObservers.get(root);
  observer?.disconnect();

  const targetLanguage = isArabic ? "ar" : "en";
  const previousLanguage = root.dataset.language;

  try {
    if (previousLanguage !== targetLanguage) restore(root);
    root.dataset.language = targetLanguage;

    const arabicBlocks = Array.from(root.querySelectorAll<HTMLElement>("[lang='ar'], [dir='rtl']"));

    arabicBlocks.forEach((element) => {
      if (isArabic) {
        const savedDisplay = originalDisplay.get(element);
        element.style.display = savedDisplay ?? "";
      } else {
        hideElement(element);
      }
    });

    if (!isArabic) return;

    arabicBlocks.forEach((arabicElement) => {
      let sibling = arabicElement.previousElementSibling as HTMLElement | null;
      while (sibling && sibling.parentElement === arabicElement.parentElement) {
        if (sibling.matches("button, a, svg") || sibling.querySelector("button, a")) break;
        hideElement(sibling);
        sibling = sibling.previousElementSibling as HTMLElement | null;
      }

      let nextSibling = arabicElement.nextElementSibling as HTMLElement | null;
      while (nextSibling && nextSibling.parentElement === arabicElement.parentElement) {
        if (nextSibling.matches("svg, button, a") || nextSibling.querySelector("button, a")) break;

        const nextText = (nextSibling.textContent ?? "").trim();
        if (nextText === "|" || Boolean(getTranslation(nextText))) {
          const followingSibling = nextSibling.nextElementSibling as HTMLElement | null;
          hideElement(nextSibling);
          nextSibling = followingSibling;
          continue;
        }

        break;
      }
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const text = node as Text;
      const value = text.nodeValue?.trim();
      const parent = text.parentElement;

      if (value && parent && !parent.closest("[lang='ar']")) {
        const translated = getTranslation(value);
        if (translated && value !== translated) {
          if (!originalText.has(text)) originalText.set(text, text.nodeValue ?? "");
          text.nodeValue = text.nodeValue?.replace(value, translated) ?? translated;
        }
      }

      node = walker.nextNode();
    }
  } finally {
    observeLocalizationChanges(root);
  }
};
