import { useEffect } from "react";

const isJiraUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.href);
    return url.hostname.toLowerCase() === "jira.elm.sa";
  } catch {
    return false;
  }
};

const openJiraPopup = (url: string) => {
  const screenWidth = window.screen.availWidth || window.innerWidth;
  const screenHeight = window.screen.availHeight || window.innerHeight;
  const width = Math.min(1400, Math.max(900, Math.round(screenWidth * 0.88)));
  const height = Math.min(900, Math.max(650, Math.round(screenHeight * 0.88)));
  const left = Math.max(0, Math.round((screenWidth - width) / 2));
  const top = Math.max(0, Math.round((screenHeight - height) / 2));

  const features = [
    "popup=yes",
    "resizable=yes",
    "scrollbars=yes",
    "toolbar=no",
    "menubar=no",
    "location=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
  ].join(",");

  const popup = window.open(url, "elm-jira-request", features);

  if (popup) {
    popup.opener = null;
    popup.focus();
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

const JiraIframeModal = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !isJiraUrl(anchor.href)) return;

      event.preventDefault();
      event.stopPropagation();
      openJiraPopup(anchor.href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
};

export default JiraIframeModal;
