declare global {
  interface Window {
    Countly?: {
      q?: unknown[][];
      track_pageview?: (page: string) => void;
      add_event?: (event: {
        key: string;
        count?: number;
        segmentation?: Record<string, string | number | boolean>;
      }) => void;
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


export const trackCountlyEvent = (
  key: string,
  segmentation?: Record<string, string | number | boolean>,
) => {
  const event = {
    key,
    count: 1,
    ...(segmentation ? { segmentation } : {}),
  };

  if (window.Countly?.add_event) {
    window.Countly.add_event(event);
    return;
  }

  window.Countly = window.Countly || {};
  window.Countly.q = window.Countly.q || [];
  window.Countly.q.push(["add_event", event]);
};
