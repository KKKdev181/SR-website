import {
  Activity,
  AppWindow,
  ArrowUpRight,
  BarChart3,
  Bot,
  Boxes,
  Cable,
  ChartNoAxesCombined,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  FileChartColumn,
  FileKey2,
  FileText,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe2,
  HardDrive,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Mail,
  Network,
  Package,
  Palette,
  PanelTop,
  Plug,
  RefreshCw,
  Rocket,
  SearchCheck,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  TestTube2,
  UserCog,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNewProductStep, getPortalCategory } from "@/data/portalCategories";
import { localizeRequest } from "@/i18n/requestLocalization";
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

const containsAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword));

const iconFor = (request: ServiceRequest): LucideIcon => {
  const value = `${request.title} ${request.shortDescription} ${request.category} ${request.section}`.toLowerCase();

  if (containsAny(value, ["ux", "ui design", "figma", "usability"])) return Palette;
  if (containsAny(value, ["mobile app", "android", "ios"])) return Smartphone;
  if (containsAny(value, ["frontend", "portal development", "web page"])) return PanelTop;
  if (containsAny(value, ["dashboard", "power bi"])) return LayoutDashboard;
  if (containsAny(value, ["bi report", "report request", "reporting", "create report"])) return FileChartColumn;
  if (containsAny(value, ["analytics", "cost analysis", "boq costing"])) return ChartNoAxesCombined;
  if (containsAny(value, ["database", "sql", "oracle", "postgres", "couchbase"])) return Database;
  if (containsAny(value, ["backup", "restore", "storage", "shared storage"])) return HardDrive;
  if (containsAny(value, ["dns", "domain", "cname", "txt record"])) return Globe2;
  if (containsAny(value, ["load balancer", "waf", "firewall"])) return ShieldCheck;
  if (containsAny(value, ["network", "subnet", "vlan", "vpn", "connectivity", "nat"])) return Network;
  if (containsAny(value, ["ssl", "tls", "certificate"])) return FileKey2;
  if (containsAny(value, ["access", "privilege", "permission", "role", "account"])) return KeyRound;
  if (containsAny(value, ["password", "reset password"])) return LockKeyhole;
  if (containsAny(value, ["user management", "add user", "remove user"])) return UserCog;
  if (containsAny(value, ["server", "virtual machine", " vm ", "hosting"])) return Server;
  if (containsAny(value, ["openshift", "ocp", "kubernetes", "namespace", "container"])) return Boxes;
  if (containsAny(value, ["cloud", "gcp", "iaas"])) return Cloud;
  if (containsAny(value, ["pipeline", "ci/cd", "cicd"])) return Workflow;
  if (containsAny(value, ["source code", "repository", "git", "bitbucket"])) return GitBranch;
  if (containsAny(value, ["artifact", "nexus", "package"])) return Package;
  if (containsAny(value, ["devsecops", "scan", "vulnerability", "security test"])) return SearchCheck;
  if (containsAny(value, ["performance test", "load test"])) return Gauge;
  if (containsAny(value, ["test", "testing", "qa"])) return TestTube2;
  if (containsAny(value, ["publish", "publishing", "go live", "production release"])) return Rocket;
  if (containsAny(value, ["handover", "knowledge transfer", " kt "])) return Users;
  if (containsAny(value, ["captcha", "bot"])) return Bot;
  if (containsAny(value, ["email", "mailbox", "smtp"])) return Mail;
  if (containsAny(value, ["api", "integration", "webhook"])) return Plug;
  if (containsAny(value, ["application", "app service"])) return AppWindow;
  if (containsAny(value, ["code", "development"])) return Code2;
  if (containsAny(value, ["monitor", "health", "availability"])) return Activity;
  if (containsAny(value, ["troubleshoot", "support", "incident"])) return LifeBuoy;
  if (containsAny(value, ["jira", "workflow", "scrum board"])) return Settings;
  if (containsAny(value, ["document", "form", "request information"])) return FileText;
  if (containsAny(value, ["identity", "sso", "authentication"])) return Fingerprint;
  if (containsAny(value, ["refresh", "renewal", "renew"])) return RefreshCw;
  if (containsAny(value, ["status", "validation", "verification"])) return CheckCircle2;
  if (containsAny(value, ["laptop", "desktop", "device"])) return Laptop;
  if (containsAny(value, ["cable", "connection"])) return Cable;
  if (containsAny(value, ["chart", "metric"])) return BarChart3;

  return Wrench;
};

const RequestCard = ({ request }: RequestCardProps) => {
  const { language, copy } = useLanguage();
  const isArabic = language === "ar";
  const localized = localizeRequest(request, isArabic);
  const hasUrl = Boolean(request.jiraUrl?.trim()) && !request.jiraUrl.includes("jira.example.com");
  const step = getNewProductStep(request);
  const portalCategory = getPortalCategory(request);
  const Icon = iconFor(request);
  const visual = step
    ? { icon: "bg-[#ebe9ff] text-[#4c00ff]", tag: "bg-[#ebe9ff] text-[#4c00ff]" }
    : sectionVisuals[request.section] ?? sectionVisuals["General Services"];
  const categoryLabel = portalCategory ? (isArabic ? portalCategory.ar : portalCategory.en) : localized.section;

  return (
    <article
      className="flex min-h-[214px] flex-col overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_1px_2px_rgba(9,30,66,0.08)] transition hover:-translate-y-0.5 hover:border-[#b3bac5] hover:shadow-[0_6px_16px_rgba(9,30,66,0.12)]"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
    >
      <div className="flex flex-1 flex-col p-4">
        {step ? (
          <div className="mb-3 inline-flex h-9 min-w-9 w-fit items-center justify-center rounded-lg bg-[#e4e3ff] px-3 text-base font-bold text-[#4c00ff]">
            {step}
          </div>
        ) : (
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${visual.icon}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}

        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#172b4d]">{localized.title}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5e6c84]">{localized.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${visual.tag}`}>
            {categoryLabel}
          </span>
          {localized.environment && (
            <span className="rounded-full bg-[#f4f5f7] px-2.5 py-1 text-[10px] font-medium text-[#5e6c84]" dir="ltr">
              {localized.environment}
            </span>
          )}
        </div>
      </div>

      <div className={`flex min-h-12 items-center border-t border-[#dfe1e6] px-4 ${isArabic ? "justify-start" : "justify-end"}`}>
        {hasUrl ? (
          <a
            href={request.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-[#0c66e4] transition hover:bg-[#e9f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]/30"
          >
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
