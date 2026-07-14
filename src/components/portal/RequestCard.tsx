import { ArrowUpRight, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { KeyboardEvent } from "react";
import type { ServiceRequest } from "@/data/requests";

interface RequestCardProps {
  request: ServiceRequest;
}

const categoryStyles: Record<string, string> = {
  "Access & Permissions": "bg-emerald-50 text-emerald-700",
  "Accounts & External Services": "bg-slate-100 text-slate-700",
  "New Service Setup": "bg-blue-50 text-blue-700",
  "Environment / Server Provisioning": "bg-blue-50 text-blue-700",
  "Cloud / Platform": "bg-cyan-50 text-cyan-700",
  "Network / Connectivity": "bg-teal-50 text-teal-700",
  "DNS / Domain": "bg-indigo-50 text-indigo-700",
  "SSL / Certificate": "bg-emerald-50 text-emerald-700",
  "Load Balancer": "bg-cyan-50 text-cyan-700",
  "Security / Compliance": "bg-rose-50 text-rose-700",
  "Scale / Capacity": "bg-lime-50 text-lime-700",
  "Database / Storage / Backup": "bg-emerald-50 text-emerald-700",
  "DevOps / CI-CD": "bg-violet-50 text-violet-700",
  "Release / Lifecycle": "bg-amber-50 text-amber-700",
  "Monitoring / Troubleshooting": "bg-slate-100 text-slate-700",
  "Jira / Service Management": "bg-blue-50 text-blue-700",
  "Reporting / BI / Cost": "bg-indigo-50 text-indigo-700",
  "Business Operations": "bg-orange-50 text-orange-700",
  "Mobile / UX / Contact Center": "bg-fuchsia-50 text-fuchsia-700",
};

const RequestCard = ({ request }: RequestCardProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const hasUrl = Boolean(request.jiraUrl?.trim()) && !request.jiraUrl.includes("jira.example.com");

  const openRequest = () => {
    if (hasUrl) window.open(request.jiraUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (hasUrl && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openRequest();
    }
  };

  return (
    <article
      role={hasUrl ? "link" : undefined}
      tabIndex={hasUrl ? 0 : undefined}
      onClick={openRequest}
      onKeyDown={handleKeyDown}
      aria-label={hasUrl ? `${isArabic ? "فتح" : "Open"} ${request.title} ${isArabic ? "في Jira" : "in Jira"}` : request.title}
      className={`group flex min-h-[17rem] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        hasUrl ? "cursor-pointer hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.09)]" : "opacity-80"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {request.subSection || request.section}
          </p>
          <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-6 text-slate-950">{request.title}</h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-700">
          {hasUrl ? <ArrowUpRight className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-xs leading-6 text-slate-600">{request.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className={`border-0 px-2.5 py-1 text-[10px] font-semibold ${categoryStyles[request.category] || "bg-slate-100 text-slate-700"}`}>
          {request.category}
        </Badge>
        {request.environment && (
          <Badge variant="outline" className="border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            {request.environment}
          </Badge>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        {request.deliveryTime ? (
          <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{request.deliveryTime}</span>
          </span>
        ) : (
          <span className="text-[10px] text-slate-400">{request.section}</span>
        )}

        <span className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3.5 text-xs font-semibold ${hasUrl ? "bg-slate-950 text-white group-hover:bg-blue-700" : "bg-slate-100 text-slate-400"}`}>
          {hasUrl ? (isArabic ? "فتح في Jira" : "Open in Jira") : isArabic ? "الرابط غير متوفر" : "Link unavailable"}
          {hasUrl && <ArrowUpRight className={`h-3.5 w-3.5 ${isArabic ? "rotate-[-90deg]" : ""}`} />}
        </span>
      </div>
    </article>
  );
};

export default RequestCard;
