import { Star } from "lucide-react";
import RequestCard from "./RequestCard";
import type { ServiceRequest } from "@/data/requests";

interface PopularRequestsProps {
  requests: ServiceRequest[];
}

const arabicFont = { fontFamily: "'Noto Sans Arabic', sans-serif" };

const PopularRequests = ({ requests }: PopularRequestsProps) => {
  if (requests.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-5 flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
          <Star className="h-4 w-4 fill-secondary text-secondary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-950">Popular Requests</h2>
          <p dir="rtl" lang="ar" className="text-xs text-slate-500" style={arabicFont}>
            الطلبات الأكثر استخداما
          </p>
        </div>
        <span className="ml-auto rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-medium text-secondary">
          Quick access | وصول سريع
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requests.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}
      </div>
    </section>
  );
};

export default PopularRequests;
