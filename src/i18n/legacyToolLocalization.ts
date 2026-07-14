const arabicText: Record<string, string> = {
  "Project Journey Checklist": "قائمة رحلة المشروع",
  "Project guide": "دليل المشروع",
  "Complete guide for project managers and technical teams": "دليل شامل لمديري المشاريع والفرق التقنية",
  "Close | إغلاق": "إغلاق",
  "Required if applicable | إلزامي عند الحاجة": "إلزامي عند الحاجة",
  "Parallel | بالتوازي": "بالتوازي",
  "Open in Jira": "فتح الطلب في Jira",
  "Open Change Request in Jira": "فتح Change Request في Jira",
  "Open publish request in Jira": "فتح طلب النشر في Jira",
  "Open Link": "فتح الرابط",
  "Open": "فتح",
  "Service Name:": "اسم الخدمة:",
  "Important Notes:": "ملاحظات مهمة:",
  "Deployment Notes:": "ملاحظات Deployment:",
  "Publishing": "النشر",
  "Ask the user if they want to publish internally or externally.": "اختر نوع النشر المطلوب: داخلي أو خارجي.",
  "Internal Publish": "نشر داخلي",
  "External Publish": "نشر خارجي",
  "External Publish Requirements:": "متطلبات النشر الخارجي:",
  "Parallel Actions": "الأنشطة المتوازية",
  "Developer Access Checklist": "قائمة صلاحيات المطور",
  "Before proceeding": "قبل البدء",
  "Final check before proceeding": "التحقق النهائي قبل المتابعة",
  "Required": "إلزامي",
  "Conditional": "حسب الحاجة",
  "Optional": "اختياري",
  "Supported Technologies": "التقنيات المدعومة",
  "Operating Systems": "أنظمة التشغيل",
  "Application Level": "مستوى التطبيق",
  "Databases": "قواعد البيانات",
  "Deployment Requirements": "متطلبات Deployment",
  "Execution": "التنفيذ",
  "Preparation": "التحضير",
  "Staging and Production": "Staging وProduction",
  "Publishing & Go-Live": "النشر والإطلاق",
  "Internal only": "داخلي فقط",
  "External (public)": "خارجي",
  "Both": "كلاهما",
  "Start over | إعادة": "إعادة البدء",
  "Before going live, make sure the deployment change is opened and tracked in Jira.": "قبل الإطلاق، تأكد من فتح Change Request ومتابعته في Jira.",
  "Open a Change Request in Jira before deployment": "افتح Change Request في Jira قبل Deployment.",
  "Attach the MRF and required approvals if applicable": "أرفق MRF والموافقات المطلوبة عند الحاجة.",
  "Coordinate the deployment with APP, DB, OPM, and CM teams": "نسّق Deployment مع فرق APP وDB وOPM وCM.",
  "Track the deployment execution and closure through Jira": "تابع تنفيذ Deployment وإغلاقه من خلال Jira.",
  "Approval from GRC team is mandatory through grc@elm.sa": "موافقة فريق GRC إلزامية عبر grc@elm.sa.",
  "Performance Test is required for external publish": "اختبار الأداء مطلوب للنشر الخارجي.",
  "Attach the approval and required evidence in the SR": "أرفق الموافقة والمستندات المطلوبة في SR.",
  "Before you move forward, make sure you have completed the checklist items below": "قبل المتابعة، تأكد من إكمال عناصر القائمة أدناه.",
  "Confirm that the domain is registered, if required": "تأكد من تسجيل النطاق إذا كان مطلوبًا.",
  "Confirm that the Developer Access Checklist is completed": "تأكد من إكمال قائمة صلاحيات المطور.",
  "Confirm that the SSL certificate is available from the client or Elm": "تأكد من توفر شهادة SSL من العميل أو Elm.",
  "Confirm that the RFC / Change Request is opened before deployment": "تأكد من فتح RFC / Change Request قبل Deployment.",
  "Confirm that the service type is Request For Change": "تأكد من أن نوع الطلب هو Request For Change.",
  "Confirm the required deployment checklist is completed": "تأكد من إكمال قائمة التحقق المطلوبة لـ Deployment.",
  "Confirm that the KT / Handover session is completed with APP, DB, OPM, and CM teams": "تأكد من إكمال جلسة KT / Handover مع فرق APP وDB وOPM وCM.",
  "Confirm that the MRF is submitted for release": "تأكد من تقديم MRF للإصدار.",
  "For external publish, confirm that GRC approval is obtained": "للنشر الخارجي، تأكد من الحصول على موافقة GRC.",
  "Confirm that GRC approval is attached in the Service Request": "تأكد من إرفاق موافقة GRC في Service Request.",
  "Domain registration is mandatory to enable CAPTCHA and Google Maps services.": "تسجيل Domain إلزامي لتفعيل خدمات CAPTCHA وGoogle Maps.",
  "Request Google CAPTCHA when the service requires CAPTCHA integration.": "اطلب Google CAPTCHA عند حاجة الخدمة إلى التكامل مع CAPTCHA.",
  "Request a performance test when the project/product needs load, stress, or performance validation.": "اطلب اختبار أداء عندما يحتاج المشروع/المنتج إلى التحقق من التحمل أو الضغط أو الأداء.",
  "Request Google Maps when the project/product requires Google Maps integration.": "اطلب Google Maps عندما يحتاج المشروع/المنتج إلى التكامل مع Google Maps.",
  "Create the project in Jira": "إنشاء المشروع في Jira",
  "Create the project in Jira to start the project journey.": "أنشئ المشروع في Jira لبدء رحلة المشروع.",
  "No matching requests found. Try starting over with different answers.": "لم يتم العثور على طلبات مطابقة. جرّب مرة أخرى بإجابات مختلفة."
};

const hiddenElements = new Set<HTMLElement>();
const originalText = new WeakMap<Text, string>();
let scheduled = false;

const containsArabic = (value: string) => /[\u0600-\u06FF]/.test(value);

const restore = () => {
  hiddenElements.forEach((element) => element.style.removeProperty("display"));
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

const hidePairedSiblings = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>('[lang="ar"]').forEach((arabicElement) => {
    arabicElement.style.removeProperty("display");
    const previous = arabicElement.previousElementSibling;

    if (previous && !previous.hasAttribute("lang")) {
      const tagName = previous.tagName.toLowerCase();
      if (["p", "h3", "h4", "h5", "h6", "span", "ul"].includes(tagName)) hide(previous);
    }

    const separator = previous?.previousElementSibling;
    if (separator?.textContent?.trim() === "|") {
      hide(separator);
      hide(separator.previousElementSibling);
    }
  });
};

const hideDuplicateRowsAndColumns = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>("li, p, div").forEach((element) => {
    const text = element.textContent?.trim() ?? "";
    if (!containsArabic(text)) return;

    const previous = element.previousElementSibling as HTMLElement | null;
    if (!previous) return;
    const previousText = previous.textContent?.trim() ?? "";

    if (previousText && !containsArabic(previousText) && previousText.length > 8) {
      const sameTag = previous.tagName === element.tagName;
      const sameParent = previous.parentElement === element.parentElement;
      if (sameTag && sameParent) hide(previous);
    }
  });

  root.querySelectorAll<HTMLElement>("[class*='grid-cols-2']").forEach((grid) => {
    const children = Array.from(grid.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    if (children.length < 2 || children.length % 2 !== 0) return;

    for (let index = 0; index < children.length; index += 2) {
      const first = children[index];
      const second = children[index + 1];
      const firstArabic = containsArabic(first.textContent ?? "");
      const secondArabic = containsArabic(second.textContent ?? "");

      if (!firstArabic && secondArabic) hide(first);
      if (firstArabic && !secondArabic) hide(second);
    }
  });
};

const hideEnglishListsBeforeArabicLists = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>('div[dir="rtl"], ul[dir="rtl"]').forEach((arabicBlock) => {
    if (!containsArabic(arabicBlock.textContent ?? "")) return;
    const previous = arabicBlock.previousElementSibling;
    if (previous && !containsArabic(previous.textContent ?? "")) hide(previous);

    const heading = previous?.previousElementSibling;
    if (heading && !containsArabic(heading.textContent ?? "")) hide(heading);
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
      hidePairedSiblings(root);
      hideEnglishListsBeforeArabicLists(root);
      hideDuplicateRowsAndColumns(root);
      replaceTextNodes(root);
    } else {
      root.setAttribute("dir", "ltr");
      root.classList.remove("arabic-only-tool");
      root.querySelectorAll<HTMLElement>('[lang="ar"]').forEach(hide);
      root.querySelectorAll<HTMLElement>('[dir="rtl"]').forEach((element) => {
        if (containsArabic(element.textContent ?? "")) hide(element);
      });
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
    subtree: true
  });
  scheduleLocalization();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

export {};
