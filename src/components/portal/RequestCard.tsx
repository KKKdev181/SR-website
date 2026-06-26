import { ArrowUpRight, CheckCircle2, Clock, Link2Off } from "lucide-react";
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
  const hasJiraUrl =
    Boolean(request.jiraUrl?.trim()) && !request.jiraUrl?.includes("jira.example.com");

  const openRequest = () => {
    if (!hasJiraUrl || !request.jiraUrl) return;
    window.open(request.jiraUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasJiraUrl) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRequest();
    }
  };

  return (
    <div
      role={hasJiraUrl ? "link" : "article"}
      tabIndex={hasJiraUrl ? 0 : undefined}
      onClick={openRequest}
      onKeyDown={handleKeyDown}
      className={`card-hover group flex min-h-[14rem] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 ${
        hasJiraUrl ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label={hasJiraUrl ? `Open ${request.title} in Jira` : `${request.title} guide item`}
    >
      <div className={`h-1 w-full ${categoryAccentMap[request.category] || "bg-muted"}`} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {request.subSection || request.section}
            </p>
            <h3 className="overflow-hidden text-sm font-semibold leading-snug text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {request.title}
            </h3>
          </div>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              hasJiraUrl
                ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {hasJiraUrl ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <Link2Off className="h-4 w-4" />
            )}
          </span>
        </div>

        <p className="overflow-hidden text-xs leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {request.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {request.environment && (
            <Badge
              variant="outline"
              className="rounded-full border-0 bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
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

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          {request.deliveryTime ? (
            <span className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">{request.deliveryTime}</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
                hasJiraUrl ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {hasJiraUrl ? <CheckCircle2 className="h-3 w-3" /> : <Link2Off className="h-3 w-3" />}
              {hasJiraUrl ? "Ready in Jira" : "Link pending"}
            </span>
          )}

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
              hasJiraUrl
                ? "bg-primary text-primary-foreground group-hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {hasJiraUrl ? (
              <>
                Open
                <span dir="rtl" lang="ar" className="hidden sm:inline" style={arabicFont}>
                  فتح
                </span>
                <ArrowUpRight className="h-3 w-3" />
              </>
            ) : (
              <>
                Pending
                <Link2Off className="h-3 w-3" />
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
