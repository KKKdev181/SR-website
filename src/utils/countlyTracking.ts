declare global {
  interface Window {
    Countly?: {
      q?: unknown[][];
      track_pageview?: (page: string) => void;
    };
  }
}

const getCurrentPage = () => window.location.pathname + window.location.hash;

const trackCurrentPage = () => {
  const page = getCurrentPage();

  if (window.Countly?.track_pageview) {
    window.Countly.track_pageview(page);
    return;
  }

  window.Countly = window.Countly || {};
  window.Countly.q = window.Countly.q || [];
  window.Countly.q.push(["track_pageview", page]);
};

window.addEventListener("hashchange", trackCurrentPage);
