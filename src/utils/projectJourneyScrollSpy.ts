const stageIds = [
  "journey-section-preparation",
  "journey-section-devqa",
  "journey-section-staging-production",
  "journey-section-deployment",
  "journey-section-publishing",
] as const;

let frameId = 0;

const updateJourneyNavigation = () => {
  frameId = 0;

  const page = document.querySelector<HTMLElement>(".journey-shell");
  if (!page) return;

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
observer.observe(document.documentElement, { childList: true, subtree: true });

scheduleJourneyNavigationUpdate();
