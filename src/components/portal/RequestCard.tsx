import { Clock, ArrowUpRight, Link2Off } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { KeyboardEvent } from "react";
import type { ServiceRequest } from "@/data/requests";

interface RequestCardProps {
  request: ServiceRequest;
}

const categoryColorMap: Record<string, string> = {
  Servers: "bg-elm-blue-light text-primary",
  OpenShift: "bg-elm-green-light text-secondary",
  DNS: "bg-elm-blue-light text-primary",
  SSL: "bg-elm-green-light text-secondary",
  Security: "bg-destructive/10 text-destructive",
  Scaling: "bg-elm-blue-light text-primary",
  Networking: "bg-elm-green-light text-secondary",
  Storage: "bg-elm-blue-light text-primary",
  Compliance: "bg-muted text-muted-foreground",
  Access: "bg-elm-green-light text-secondary",
  Configuration: "bg-muted text-muted-foreground",
  Architecture: "bg-elm-blue-light text-primary",
  Accounts: "bg-muted text-muted-foreground",
  Publishing: "bg-secondary/10 text-secondary",
  Lifecycle: "bg-muted text-muted-foreground",
  Setup: "bg-elm-blue-light text-primary",
  DevOps: "bg-elm-blue-light text-primary",
  Platform: "bg-elm-green-light text-secondary",
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
      className={`card-hover group flex min-h-[13rem] flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm outline-none hover:shadow-md focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 ${
        hasJiraUrl ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label={hasJiraUrl ? `Open ${request.title} in Jira` : `${request.title} guide item`}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug text-foreground">
            {request.title}
          </h3>
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
              hasJiraUrl
                ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {hasJiraUrl ? <ArrowUpRight className="h-3.5 w-3.5" /> : <Link2Off className="h-3.5 w-3.5" />}
          </span>
        </div>

        <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
          {request.shortDescription}
        </p>

        {request.arabicDescription && (
          <p
            dir="rtl"
            lang="ar"
            className="mb-3 text-[11px] leading-relaxed text-muted-foreground/75"
            style={arabicFont}
          >
            {request.arabicDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className={`rounded-full border-0 px-2.5 py-0.5 text-[10px] font-medium ${
              categoryColorMap[request.category] || "bg-muted text-muted-foreground"
            }`}
          >
            {request.category}
          </Badge>
          {request.environment && (
            <Badge
              variant="outline"
              className="rounded-full border-0 bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {request.environment}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
        {request.deliveryTime ? (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{request.deliveryTime}</span>
            <span className="text-muted-foreground/45">|</span>
            <span dir="rtl" lang="ar" className="text-muted-foreground/70" style={arabicFont}>
              مدة التنفيذ
            </span>
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground/60">
            {hasJiraUrl ? "Available in Jira" : "Jira link to be added"}
          </span>
        )}

        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            hasJiraUrl ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {hasJiraUrl ? (
            <>
              <span dir="rtl" lang="ar" style={arabicFont}>
                فتح في Jira
              </span>
              <span className="text-muted-foreground/40">|</span>
              Open
              <ArrowUpRight className="h-3 w-3" />
            </>
          ) : (
            <>
              <span dir="rtl" lang="ar" style={arabicFont}>
                سيتم إضافة الرابط
              </span>
              <span className="text-muted-foreground/40">|</span>
              Link pending
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default RequestCard;
