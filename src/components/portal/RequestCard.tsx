import { ArrowUpRight, Cloud, Database, Network, Server, ShieldCheck, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

interface RequestCardProps {
  request: ServiceRequest;
}

const iconFor = (request: ServiceRequest) => {
  const value = `${request.section} ${request.category} ${request.title}`.toLowerCase();
  if (value.includes("storage") || value.includes("backup") || value.includes("database")) return Database;
  if (value.includes("network") || value.includes("dns") || value.includes("load balancer")) return Network;
  if (value.includes("security") || value.includes("access") || value.includes("privilege")) return ShieldCheck;
  if (value.includes("cloud") || value.includes("openshift") || value.includes("iaas") || value.includes("gcp")) return Cloud;
  if (value.includes("server") || value.includes("hosting") || value.includes("infrastructure")) return Server;
  return Wrench;
};

const tagStyle = (section: string) => {
  if (section.includes("Storage")) return "bg-[#eae6ff] text-[#403294]";
  if (section.includes("Network")) return "bg-[#e3fcef] text-[#006644]";
  if (section.includes("Access")) return "bg-[#deebff] text-[#0747a6]";
  if (section.includes("Security")) return "bg-[#ffebe6] text-[#bf2600]";
  return "bg-[#f1f2f4] text-[#44546f]";
};

const RequestCard = ({ request }: RequestCardProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const hasUrl = Boolean(request.jiraUrl?.trim()) && !request.jiraUrl.includes("jira.example.com");
  const Icon = iconFor(request);

  return (
    <article className="flex min-h-[214px] flex-col overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_1px_2px_rgba(9,30,66,0.08)] transition hover:border-[#b3bac5] hover:shadow-[0_4px_12px_rgba(9,30,66,0.12)]">
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f2f4] text-[#44546f]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#172b4d]">{request.title}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5e6c84]">{request.shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${tagStyle(request.section)}`}>
            {request.section}
          </span>
          {request.environment && (
            <span className="rounded-full bg-[#f4f5f7] px-2.5 py-1 text-[10px] font-medium text-[#5e6c84]">
              {request.environment}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-h-12 items-center justify-end border-t border-[#dfe1e6] px-4">
        {hasUrl ? (
          <a
            href={request.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30"
          >
            {isArabic ? "فتح الطلب" : "Submit Request"}
            <ArrowUpRight className={`h-3.5 w-3.5 ${isArabic ? "rotate-[-90deg]" : ""}`} />
          </a>
        ) : (
          <span className="text-xs font-medium text-[#97a0af]">{isArabic ? "الرابط غير متوفر" : "Link unavailable"}</span>
        )}
      </div>
    </article>
  );
};

export default RequestCard;
