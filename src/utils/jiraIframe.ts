const JIRA_HOST = "jira.elm.sa";
const MODAL_ID = "jira-iframe-modal";

const isJiraUrl = (value: string): boolean => {
  try {
    return new URL(value, window.location.href).hostname === JIRA_HOST;
  } catch {
    return false;
  }
};

const closeJiraModal = () => {
  document.getElementById(MODAL_ID)?.remove();
  document.body.style.removeProperty("overflow");
};

const openJiraModal = (url: string) => {
  closeJiraModal();

  const overlay = document.createElement("div");
  overlay.id = MODAL_ID;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Jira request");
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:9999",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "padding:20px",
    "background:rgba(9,30,66,.68)",
    "backdrop-filter:blur(4px)",
  ].join(";");

  const panel = document.createElement("div");
  panel.style.cssText = [
    "width:min(1440px,96vw)",
    "height:min(900px,92vh)",
    "display:flex",
    "flex-direction:column",
    "overflow:hidden",
    "border:1px solid #dfe1e6",
    "border-radius:16px",
    "background:#fff",
    "box-shadow:0 24px 70px rgba(9,30,66,.35)",
  ].join(";");

  const header = document.createElement("div");
  header.style.cssText = [
    "min-height:56px",
    "display:flex",
    "align-items:center",
    "justify-content:space-between",
    "gap:16px",
    "padding:10px 14px 10px 18px",
    "border-bottom:1px solid #dfe1e6",
    "background:#fff",
  ].join(";");

  const title = document.createElement("strong");
  title.textContent = "Jira Request";
  title.style.cssText = "color:#172b4d;font:600 14px Inter,Arial,sans-serif";

  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;align-items:center;gap:8px";

  const externalLink = document.createElement("a");
  externalLink.href = url;
  externalLink.target = "_blank";
  externalLink.rel = "noopener noreferrer";
  externalLink.textContent = "Open in new tab";
  externalLink.style.cssText = [
    "display:inline-flex",
    "align-items:center",
    "min-height:36px",
    "padding:0 12px",
    "border:1px solid #b3d4ff",
    "border-radius:8px",
    "color:#0c66e4",
    "font:600 12px Inter,Arial,sans-serif",
    "text-decoration:none",
    "background:#f7faff",
  ].join(";");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close Jira window");
  closeButton.textContent = "×";
  closeButton.style.cssText = [
    "width:36px",
    "height:36px",
    "border:0",
    "border-radius:8px",
    "background:#f1f2f4",
    "color:#172b4d",
    "font:400 24px/1 Arial,sans-serif",
    "cursor:pointer",
  ].join(";");
  closeButton.addEventListener("click", closeJiraModal);

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = "Jira request";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.style.cssText = "width:100%;height:100%;border:0;background:#fff";

  actions.append(externalLink, closeButton);
  header.append(title, actions);
  panel.append(header, iframe);
  overlay.append(panel);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeJiraModal();
  });

  document.body.append(overlay);
  document.body.style.overflow = "hidden";
  closeButton.focus();
};

const handleJiraLinkClick = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!target || !isJiraUrl(target.href)) return;

  event.preventDefault();
  openJiraModal(target.href);
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeJiraModal();
};

document.addEventListener("click", handleJiraLinkClick);
document.addEventListener("keydown", handleEscape);
