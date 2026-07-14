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
  const description = sectionDescriptions[title];
  const icon = iconMap[sectionIcons[title]] ?? iconMap.Layers;

  const groups = requests.reduce<Record<string, ServiceRequest[]>>((result, request) => {
    const key = request.subSection || "_none";
    (result[key] ||= []).push(request);
    return result;
  }, {});

  const hasSubgroups = Object.keys(groups).length > 1 || !groups._none;

  return (
    <section className="mb-12" aria-labelledby={`section-${title}`}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-start shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition hover:border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </span>
        <h2 id={`section-${title}`} className="min-w-0 truncate text-base font-semibold text-slate-950">
          {title}
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          {requests.length}
        </span>
        {isOpen ? (
          <ChevronDown className="ms-auto h-4 w-4 text-slate-500" />
        ) : (
          <ChevronRight className="ms-auto h-4 w-4 text-slate-500 rtl:rotate-180" />
        )}
      </button>

      {isOpen && (
        <div>
          {description && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">{description.title}</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">{description.description}</p>
            </div>
          )}

          {hasSubgroups ? (
            Object.entries(groups).map(([subSection, sectionRequests]) => (
              <div key={subSection} className="mb-8">
                {subSection !== "_none" && (
                  <h3 className="mb-4 border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {subSection}
                  </h3>
                )}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {sectionRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RequestSection;
