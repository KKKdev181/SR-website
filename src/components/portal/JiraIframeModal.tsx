import { useEffect } from "react";

const isJiraUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.href);
    return url.hostname.toLowerCase() === "jira.elm.sa";
  } catch {
    return false;
  }
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
      window.location.assign(anchor.href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
};

export default JiraIframeModal;
