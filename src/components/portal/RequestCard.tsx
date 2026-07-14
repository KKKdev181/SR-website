import { ArrowUpRight, Cloud, Database, Network, Server, ShieldCheck, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

interface RequestCardProps {
  request: ServiceRequest;
}

interface SectionVisual {
  icon: string;
  tag: string;
}

const sectionVisuals: Record<string, SectionVisual> = {
  "General Help": { icon: "bg-[#e9f2ff] text-[#0c66e4]", tag: "bg-[#e9f2ff] text-[#0c66e4]" },
  "Infrastructure & Hosting": { icon: "bg-[#f1f2f4] text-[#44546f]", tag: "bg-[#f1f2f4] text-[#44546f]" },
  "Storage & Backup": { icon: "bg-[#eae6ff] text-[#5243aa]", tag: "bg-[#eae6ff] text-[#403294]" },
  "Network & Connectivity": { icon: "bg-[#e6fcff] text-[#00a3bf]", tag: "bg-[#e6fcff] text-[#006d87]" },
  "Access & Privileges": { icon: "bg-[#deebff] text-[#0052cc]", tag: "bg-[#deebff] text-[#0747a6]" },
  "Platform & Cloud Services": { icon: "bg-[#e9f2ff] text-[#0c66e4]", tag: "bg-[#e9f2ff] text-[#0c66e4]" },
  "Application Lifecycle": { icon: "bg-[#fff0b3] text-[#974f0c]", tag: "bg-[#fff0b3] text-[#7f5f01]" },
  "Application & Database": { icon: "bg-[#e3fcef] text-[#00875a]", tag: "bg-[#e3fcef] text-[#006644]" },
  "DevOps & Software Delivery": { icon: "bg-[#eae6ff] text-[#6554c0]", tag: "bg-[#eae6ff] text-[#403294]" },
  "Jira & Amer": { icon: "bg-[#deebff] text-[#0052cc]", tag: "bg-[#deebff] text-[#0747a6]" },
  "BI, Analytics & Reporting": { icon: "bg-[#e6fcff] text-[#00a3bf]", tag: "bg-[#e6fcff] text-[#006d87]" },
  "UX, Web & Mobile": { icon: "bg-[#ffebe6] text-[#de350b]", tag: "bg-[#ffebe6] text-[#bf2600]" },
  "Business Operations": { icon: "bg-[#fff0b3] text-[#974f0c]", tag: "bg-[#fff0b3] text-[#7f5f01]" },
  "General Services": { icon: "bg-[#f1f2f4] text-[#44546f]", tag: "bg-[#f1f2f4] text-[#44546f]" },
};

const iconFor = (request: ServiceRequest) => {
  const value = `${request.section} ${request.category} ${request.title}`.toLowerCase();
  if (value.includes("storage") || value.includes("backup") || value.includes("database")) return Database;
  if (value.includes("network") || value.includes("dns") || value.includes("load balancer") || value.includes("domain")) return Network;
  if (value.includes("security") || value.includes("access") || value.includes("privilege") || value.includes("ssl")) return ShieldCheck;
  if (value.includes("cloud") || value.includes("openshift") || value.includes("iaas") || value.includes("gcp")) return Cloud;
  if (value.includes("server") || value.includes("hosting") || value.includes("infrastructure")) return Server;
  return Wrench;
};

const RequestCard = ({ request }: RequestCardProps) => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const hasUrl = Boolean(request.jiraUrl?.trim()) && !request.jiraUrl.includes("jira.example.com");
  const Icon = iconFor(request);
  const visual = sectionVisuals[request.section] ?? sectionVisuals["General Services"];

  return (
    <article className="flex min-h-[214px] flex-col overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_1px_2px_rgba(9,30,66,0.08)] transition hover:border-[#b3bac5] hover:shadow-[0_4px_12px_rgba(9,30,66,0.12)]">
      <div className="flex flex-1 flex-col p-4">
        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${visual.icon}`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#172b4d]" dir="auto">{request.title}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5e6c84]" dir="auto">{request.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${visual.tag}`} dir="auto">{request.section}</span>
          {request.environment && <span className="rounded-full bg-[#f4f5f7] px-2.5 py-1 text-[10px] font-medium text-[#5e6c84]" dir="ltr">{request.environment}</span>}
        </div>
      </div>

      <div className={`flex min-h-12 items-center border-t border-[#dfe1e6] px-4 ${isArabic ? "justify-start" : "justify-end"}`}>
        {hasUrl ? (
          <a href={request.jiraUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30">
            {copy.catalog.submitRequest}
            <ArrowUpRight className={`h-3.5 w-3.5 ${isArabic ? "-rotate-90" : ""}`} />
          </a>
        ) : (
          <span className="text-xs font-medium text-[#97a0af]">{copy.catalog.linkUnavailable}</span>
        )}
      </div>
    </article>
  );
};

export default RequestCard;
