import { Star } from "lucide-react";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

interface PopularRequestsProps {
  requests: ServiceRequest[];
}

const PopularRequests = ({ requests }: PopularRequestsProps) => {
  const { isArabic } = useLanguage();

  if (requests.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="popular-requests-title">
      <div className="mb-5 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Star className="h-4 w-4 fill-current" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 id="popular-requests-title" className="text-base font-semibold text-slate-950">
            {isArabic ? "الطلبات الأكثر استخدامًا" : "Popular requests"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {isArabic ? "وصول سريع إلى الطلبات الشائعة" : "Quick access to frequently used requests"}
          </p>
        </div>
        <span className="ms-auto hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 sm:inline-flex">
          {isArabic ? "وصول سريع" : "Quick access"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </section>
  );
};

export default PopularRequests;
