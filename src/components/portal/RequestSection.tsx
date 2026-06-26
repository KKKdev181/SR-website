import {
  Activity,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Cloud,
  Database,
  GitBranch,
  Layers,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import RequestCard from "./RequestCard";
import { sectionDescriptions, sectionIcons } from "@/data/requests";
import type { ReactNode } from "react";
import type { ServiceRequest } from "@/data/requests";

interface RequestSectionProps {
  title: string;
  requests: ServiceRequest[];
}

const iconMap: Record<string, ReactNode> = {
  Activity: <Activity className="h-4 w-4" />,
  Briefcase: <Briefcase className="h-4 w-4" />,
  Cloud: <Cloud className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  GitBranch: <GitBranch className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  Rocket: <Rocket className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
};

const RequestSection = ({ title, requests }: RequestSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const desc = sectionDescriptions[title];
  const icon = iconMap[sectionIcons[title]] ?? iconMap.Layers;

  const subGroups = requests.reduce<Record<string, ServiceRequest[]>>((acc, req) => {
    const key = req.subSection || "_none";
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {});

  const hasSubGroups = Object.keys(subGroups).length > 1 || !subGroups["_none"];

  return (
    <section className="mb-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group mb-4 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white/85 px-4 py-3 text-left shadow-sm outline-none transition-colors hover:border-primary/25 hover:bg-white focus-visible:ring-2 focus-visible:ring-primary/25"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <CountBadge count={requests.length} />
        {isOpen ? (
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div>
          {desc && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
              <p className="mb-1 text-sm font-semibold text-foreground">{desc.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{desc.description}</p>
            </div>
          )}

          {hasSubGroups ? (
            Object.entries(subGroups).map(([subSection, reqs]) => (
              <div key={subSection} className="mb-6">
                {subSection !== "_none" && (
                  <h3 className="mb-3 border-b border-border/50 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {subSection}
                  </h3>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reqs.map((req) => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const CountBadge = ({ count }: { count: number }) => (
  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
    {count}
  </span>
);

export default RequestSection;
