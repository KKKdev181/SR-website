const stageIds = [
  "journey-section-preparation",
  "journey-section-devqa",
  "journey-section-staging-production",
  "journey-section-deployment",
  "journey-section-publishing",
] as const;

const publishingTranslations: Record<string, string> = {
  Publishing: "النشر",
  "Ask the user if they want to publish internally or externally.":
    "حدد ما إذا كان نشر الخدمة داخلياً أو خارجياً.",
  "Internal Publish": "نشر داخلي",
  "External Publish": "نشر خارجي",
  "External Publish Requirements:": "متطلبات النشر الخارجي:",
  "• Approval from GRC team is mandatory through grc@elm.sa.":
    "• يجب الحصول على موافقة فريق GRC من خلال grc@elm.sa.",
  "• Performance Test is required for external publish.":
    "• يجب إكمال اختبار الأداء قبل النشر الخارجي.",
  "• Attach the approval and required evidence in the SR.":
    "• أرفق الموافقة والمستندات المطلوبة في طلب الخدمة.",
  "Open publish request in Jira": "فتح طلب النشر في Jira",
  "Internal Publish Requirements:": "متطلبات النشر الداخلي:",
  "• Request Service Design Change for Load Balancer configuration.":
    "• افتح طلب Service Design Change لإعداد Load Balancer.",
  "Open Service Design Change": "فتح طلب Service Design Change",
};

let frameId = 0;

const replaceVisibleText = (element: HTMLElement, value: string) => {
  const textNode = Array.from(element.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );

  if (textNode) {
    textNode.textContent = `${value} `;
  } else if (element.children.length === 0) {
    element.textContent = value;
  }
};

const updatePublishingSection = (page: HTMLElement) => {
  const content = page.querySelector<HTMLElement>(".project-journey-page-content");
  const isArabic = content?.dataset.language === "ar";

  const candidates = Array.from(
    page.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, p, li, button, a"),
  );

  candidates.forEach((element) => {
    const currentText = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const originalEnglish = element.dataset.journeyEnglish;
    const englishKey = originalEnglish ?? currentText;

    if (publishingTranslations[englishKey]) {
      element.dataset.journeyEnglish = englishKey;
      replaceVisibleText(element, isArabic ? publishingTranslations[englishKey] : englishKey);
    }

    if (
      englishKey === "Internal Publish" ||
      englishKey === "External Publish"
    ) {
      element.classList.add("journey-publish-option");
      element.setAttribute("aria-label", isArabic ? publishingTranslations[englishKey] : englishKey);
    }
  });

  const publishingHeading = candidates.find(
    (element) => element.dataset.journeyEnglish === "Publishing",
  );
  publishingHeading?.closest("[class*='Card']")?.classList.add("journey-publishing-card");
};

const updateJourneyNavigation = () => {
  frameId = 0;

  const page = document.querySelector<HTMLElement>(".journey-shell");
  if (!page) return;

  updatePublishingSection(page);

  const sections = stageIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section instanceof HTMLElement);

  if (sections.length === 0) return;

  const headerOffset = 150;
  let activeIndex = 0;

  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= headerOffset) {
      activeIndex = index;
    }
  });

  const nearPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
  if (nearPageBottom) activeIndex = sections.length - 1;

  const sideButtons = Array.from(
    page.querySelectorAll<HTMLButtonElement>(".journey-side-nav nav button"),
  );
  const roadmapButtons = Array.from(
    page.querySelectorAll<HTMLButtonElement>(".journey-stage-track .journey-stage"),
  );

  sideButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === activeIndex);
    if (index === activeIndex) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });

  roadmapButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === activeIndex);
    if (index === activeIndex) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
};

const scheduleJourneyNavigationUpdate = () => {
  if (frameId) return;
  frameId = window.requestAnimationFrame(updateJourneyNavigation);
};

window.addEventListener("scroll", scheduleJourneyNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleJourneyNavigationUpdate);

const observer = new MutationObserver(scheduleJourneyNavigationUpdate);
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-language", "class"],
  childList: true,
  subtree: true,
});

scheduleJourneyNavigationUpdate();
