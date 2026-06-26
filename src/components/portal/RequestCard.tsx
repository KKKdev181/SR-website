import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { KeyboardEvent } from "react";
import type { ServiceRequest } from "@/data/requests";

interface RequestCardProps {
  request: ServiceRequest;
}

const categoryColorMap: Record<string, string> = {
  "Access & Permissions": "bg-elm-green-light text-secondary",
  "Accounts & External Services": "bg-muted text-muted-foreground",
  "New Service Setup": "bg-elm-blue-light text-primary",
  "Environment / Server Provisioning": "bg-elm-blue-light text-primary",
  "Cloud / Platform": "bg-elm-green-light text-secondary",
  "Network / Connectivity": "bg-elm-green-light text-secondary",
  "DNS / Domain": "bg-elm-blue-light text-primary",
  "SSL / Certificate": "bg-elm-green-light text-secondary",
  "Load Balancer": "bg-elm-green-light text-secondary",
  "Security / Compliance": "bg-destructive/10 text-destructive",
  "Scale / Capacity": "bg-elm-blue-light text-primary",
  "Database / Storage / Backup": "bg-elm-blue-light text-primary",
  "DevOps / CI-CD": "bg-elm-blue-light text-primary",
  "Release / Lifecycle": "bg-secondary/10 text-secondary",
  "Monitoring / Troubleshooting": "bg-muted text-muted-foreground",
  "Jira / Service Management": "bg-muted text-muted-foreground",
  "Reporting / BI / Cost": "bg-elm-blue-light text-primary",
  "Business Operations": "bg-muted text-muted-foreground",
  "Mobile / UX / Contact Center": "bg-elm-green-light text-secondary",
};

const categoryAccentMap: Record<string, string> = {
  "Access & Permissions": "bg-secondary",
  "Accounts & External Services": "bg-muted-foreground",
  "New Service Setup": "bg-primary",
  "Environment / Server Provisioning": "bg-primary",
  "Cloud / Platform": "bg-secondary",
  "Network / Connectivity": "bg-secondary",
  "DNS / Domain": "bg-primary",
  "SSL / Certificate": "bg-secondary",
  "Load Balancer": "bg-secondary",
  "Security / Compliance": "bg-destructive",
  "Scale / Capacity": "bg-primary",
  "Database / Storage / Backup": "bg-primary",
  "DevOps / CI-CD": "bg-primary",
  "Release / Lifecycle": "bg-secondary",
  "Monitoring / Troubleshooting": "bg-muted-foreground",
  "Jira / Service Management": "bg-muted-foreground",
  "Reporting / BI / Cost": "bg-primary",
  "Business Operations": "bg-muted-foreground",
  "Mobile / UX / Contact Center": "bg-secondary",
};

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const RequestCard = ({ request }: RequestCardProps) => {
  const requestUrl =
    request.jiraUrl?.trim() && !request.jiraUrl.includes("jira.example.com")
      ? request.jiraUrl
      : "#";

  const openRequest = () => {
    if (requestUrl === "#") return;
    window.open(requestUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRequest();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openRequest}
      onKeyDown={handleKeyDown}
      className="card-hover group flex min-h-[14.5rem] cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
      aria-label={`Open ${request.title} in Jira`}
    >
      <div className={`h-1 w-full ${categoryAccentMap[request.category] || "bg-muted"}`} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase text-slate-500">
              {request.subSection || request.section}
            </p>
            <h3 className="overflow-hidden text-[15px] font-semibold leading-snug text-slate-950 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {request.title}
            </h3>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="overflow-hidden text-xs leading-6 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {request.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {request.environment && (
            <Badge
              variant="outline"
              className="rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {request.environment}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`rounded-full border-0 px-2.5 py-0.5 text-[10px] font-medium ${
              categoryColorMap[request.category] || "bg-muted text-muted-foreground"
            }`}
          >
            {request.category}
          </Badge>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          {request.deliveryTime ? (
            <span className="flex min-w-0 items-center gap-1 text-[10px] text-slate-500">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">{request.deliveryTime}</span>
            </span>
          ) : (
            <span aria-hidden="true" />
          )}

          <span className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm group-hover:bg-primary/90">
            Open
            <span dir="rtl" lang="ar" className="hidden sm:inline" style={arabicFont}>
              فتح
            </span>
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
