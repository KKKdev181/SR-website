import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { copy } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 text-center sm:flex-row sm:px-6 sm:text-start">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </span>
          <p>
            {copy.footer.help}{" "}
            <a href="mailto:td@elm.sa" className="font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              td@elm.sa
            </a>
          </p>
        </div>
        <p className="text-xs text-slate-400">{copy.footer.portal}</p>
      </div>
    </footer>
  );
};

export default Footer;
