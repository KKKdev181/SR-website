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
      <div className="mb-5 flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl shadow-black/15 backdrop-blur">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/15">
          <Star className="h-4 w-4 fill-emerald-200 text-emerald-200" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white">Popular Requests</h2>
          <p dir="rtl" lang="ar" className="text-xs text-cyan-100/70" style={arabicFont}>
            &#1575;&#1604;&#1591;&#1604;&#1576;&#1575;&#1578; &#1575;&#1604;&#1571;&#1603;&#1579;&#1585; &#1575;&#1587;&#1578;&#1582;&#1583;&#1575;&#1605;&#1575;
          </p>
        </div>
        <span className="ml-auto rounded-full bg-emerald-300/15 px-2.5 py-1 text-[10px] font-medium text-emerald-100">
          Quick access | &#1608;&#1589;&#1608;&#1604; &#1587;&#1585;&#1610;&#1593;
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
