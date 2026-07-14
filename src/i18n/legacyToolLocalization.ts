const arabicText: Record<string, string> = {
  "Project Journey Checklist": "قائمة رحلة المشروع",
  "Project guide": "دليل المشروع",
  "Complete guide for project managers and technical teams": "دليل شامل لمديري المشاريع والفرق التقنية",
  "Close | إغلاق": "إغلاق",
  "Required if applicable | إلزامي عند الحاجة": "إلزامي عند الحاجة",
  "Parallel | بالتوازي": "بالتوازي",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Link": "فتح الرابط",
  "Open": "فتح",
  "Service Name:": "اسم الخدمة:",
  "Important Notes:": "ملاحظات مهمة:",
  "Publishing": "النشر",
  "Ask the user if they want to publish internally or externally.": "اختر نوع النشر المطلوب: داخلي أو خارجي.",
  "Internal Publish": "نشر داخلي",
  "External Publish": "نشر خارجي",
  "Parallel Actions": "الأنشطة المتوازية",
  "Developer Access Checklist": "قائمة صلاحيات المطور",
  "Before proceeding": "قبل البدء",
  "Required": "إلزامي",
  "Conditional": "حسب الحاجة",
  "Optional": "اختياري",
  "Supported Technologies": "التقنيات المدعومة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "مستوى التطبيق",
  "Databases": "قواعد البيانات",
  "Deployment Requirements": "متطلبات Deployment",
  "Domain registration is mandatory to enable CAPTCHA and Google Maps services.": "تسجيل Domain إلزامي لتفعيل خدمات CAPTCHA وGoogle Maps.",
  "Request Google CAPTCHA when the service requires CAPTCHA integration.": "اطلب Google CAPTCHA عند حاجة الخدمة إلى التكامل مع CAPTCHA.",
  "Request a performance test when the project/product needs load, stress, or performance validation.": "اطلب اختبار أداء عندما يحتاج المشروع/المنتج إلى التحقق من التحمل أو الضغط أو الأداء.",
  "Request Google Maps when the project/product requires Google Maps integration.": "اطلب Google Maps عندما يحتاج المشروع/المنتج إلى التكامل مع Google Maps.",
  "Create the project in Jira": "إنشاء المشروع في Jira",
  "Create the project in Jira to start the project journey.": "أنشئ المشروع في Jira لبدء رحلة المشروع.",
  "Preparation": "التحضير",
  "Staging and Production": "Staging وProduction",
  "Publishing & Go-Live": "النشر والإطلاق",
  "Internal only": "داخلي فقط",
  "External (public)": "خارجي",
  "Both": "كلاهما",
  "Start over | إعادة": "إعادة البدء",
  "No matching requests found. Try starting over with different answers.": "لم يتم العثور على طلبات مطابقة. جرّب مرة أخرى بإجابات مختلفة.",
};

const hiddenElements = new Set<HTMLElement>();
const originalText = new WeakMap<Text, string>();
let scheduled = false;

const restore = () => {
  hiddenElements.forEach((element) => {
    element.style.removeProperty("display");
  });
  hiddenElements.clear();

  document.querySelectorAll<HTMLElement>(".standalone-checklist, .standalone-interactive-tool").forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const textNode = node as Text;
      const saved = originalText.get(textNode);
      if (saved !== undefined) textNode.nodeValue = saved;
      node = walker.nextNode();
    }
  });
};

const hide = (element: Element | null) => {
  if (!(element instanceof HTMLElement)) return;
  element.style.setProperty("display", "none", "important");
  hiddenElements.add(element);
};

const replaceTextNodes = (root: HTMLElement) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const value = textNode.nodeValue ?? "";
    const trimmed = value.trim();
    const replacement = arabicText[trimmed];

    if (replacement) {
      if (!originalText.has(textNode)) originalText.set(textNode, value);
      const leading = value.match(/^\s*/)?.[0] ?? "";
      const trailing = value.match(/\s*$/)?.[0] ?? "";
      textNode.nodeValue = `${leading}${replacement}${trailing}`;
    }

    node = walker.nextNode();
  }
};

const hidePairedEnglishContent = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>('[lang="ar"]').forEach((arabicElement) => {
    arabicElement.style.removeProperty("display");
    const previous = arabicElement.previousElementSibling;

    if (previous && !previous.hasAttribute("lang")) {
      const tagName = previous.tagName.toLowerCase();
      if (["p", "h3", "h4", "h5", "h6", "span", "ul"].includes(tagName)) hide(previous);
    }

    const separator = previous?.previousElementSibling;
    if (separator?.textContent?.trim() === "|") hide(separator);
  });

  root.querySelectorAll<HTMLElement>('div[dir="rtl"]').forEach((arabicBlock) => {
    if (!arabicBlock.querySelector("ul")) return;
    const previousList = arabicBlock.previousElementSibling;
    if (previousList?.tagName.toLowerCase() === "ul") hide(previousList);
    const heading = previousList?.previousElementSibling;
    if (heading?.tagName.toLowerCase() === "strong") hide(heading);
  });
};

const applyLocalization = () => {
  scheduled = false;
  restore();

  const roots = document.querySelectorAll<HTMLElement>(".standalone-checklist, .standalone-interactive-tool");
  const isArabic = document.documentElement.lang === "ar";

  roots.forEach((root) => {
    if (isArabic) {
      root.setAttribute("dir", "rtl");
      root.classList.add("arabic-only-tool");
      hidePairedEnglishContent(root);
      replaceTextNodes(root);
    } else {
      root.setAttribute("dir", "ltr");
      root.classList.remove("arabic-only-tool");
      root.querySelectorAll<HTMLElement>('[lang="ar"]').forEach(hide);
    }
  });
};

const scheduleLocalization = () => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(applyLocalization);
};

const start = () => {
  const observer = new MutationObserver(scheduleLocalization);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "dir"],
    childList: true,
    subtree: true,
  });
  scheduleLocalization();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
