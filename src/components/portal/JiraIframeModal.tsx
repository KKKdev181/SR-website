import { ExternalLink, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const isJiraUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.href);
    return url.hostname.toLowerCase() === "jira.elm.sa";
  } catch {
    return false;
  }
};

const JiraIframeModal = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [jiraUrl, setJiraUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setJiraUrl(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !isJiraUrl(anchor.href)) return;
      if (anchor.dataset.jiraOpen === "external") return;

      event.preventDefault();
      event.stopPropagation();
      setIsLoading(true);
      setJiraUrl(anchor.href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!jiraUrl) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [jiraUrl]);

  if (!jiraUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={isArabic ? "فتح طلب Jira" : "Open Jira request"}
      dir={isArabic ? "rtl" : "ltr"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div className="flex h-[92vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 px-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">
              {isArabic ? "طلب Jira" : "Jira Request"}
            </h2>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {isArabic
                ? "يمكنك تعبئة الطلب من داخل البوابة."
                : "Complete the request without leaving the portal."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={jiraUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-jira-open="external"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-[#0c66e4] transition hover:bg-blue-50"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isArabic ? "فتح في تبويب جديد" : "Open in new tab"}
              </span>
            </a>

            <button
              type="button"
              onClick={closeModal}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label={isArabic ? "إغلاق" : "Close"}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 bg-slate-100">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin text-[#0c66e4]" aria-hidden="true" />
                <span>{isArabic ? "جاري تحميل Jira..." : "Loading Jira..."}</span>
              </div>
            </div>
          )}

          <iframe
            key={jiraUrl}
            src={jiraUrl}
            title={isArabic ? "نموذج طلب Jira" : "Jira request form"}
            className="h-full w-full border-0 bg-white"
            onLoad={() => setIsLoading(false)}
            allow="clipboard-read; clipboard-write"
          />
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 sm:px-6">
          {isArabic
            ? "إذا لم يظهر Jira داخل النافذة، استخدم زر فتح في تبويب جديد؛ قد تمنع إعدادات Jira العرض داخل iframe."
            : "If Jira does not appear here, use Open in new tab; Jira security settings may block iframe display."}
        </footer>
      </div>
    </div>
  );
};

export default JiraIframeModal;
