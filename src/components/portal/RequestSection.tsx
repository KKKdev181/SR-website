import { ChevronDown, ChevronRight, Rocket, Server, Settings, Globe, Archive, Users, GitBranch, Layers, ShieldCheck } from "lucide-react";
import { useState } from "react";
import RequestCard from "./RequestCard";
import { sectionDescriptions } from "@/data/requests";
import type { ReactNode } from "react";
import type { ServiceRequest } from "@/data/requests";

interface RequestSectionProps {
  title: string;
  requests: ServiceRequest[];
}

const iconMap: Record<string, ReactNode> = {
  Initiate: <Rocket className="h-4 w-4" />,
  "Environment Preparation": <Server className="h-4 w-4" />,
  Modify: <Settings className="h-4 w-4" />,
  Publishing: <Globe className="h-4 w-4" />,
  Retire: <Archive className="h-4 w-4" />,
  "User Access": <Users className="h-4 w-4" />,
  "DevOps Requests": <GitBranch className="h-4 w-4" />,
  "Platform Services": <Layers className="h-4 w-4" />,
  "IT Security Tools": <ShieldCheck className="h-4 w-4" />,
};

const sectionArabicNames: Record<string, string> = {
  Initiate: "البدء",
  "Environment Preparation": "تجهيز البيئة",
  Modify: "التعديل",
  Publishing: "النشر",
  Retire: "الإيقاف",
  "User Access": "إدارة الوصول",
  "DevOps Requests": "طلبات DevOps",
  "Platform Services": "خدمات المنصات",
  "IT Security Tools": "أدوات الأمن",
};

const sectionDescArabic: Record<string, { title: string; description: string }> = {
  "User Access": {
    title: "إدارة وصول المستخدمين",
    description: "إدارة طلبات الخدمة لأنواع الوصول المختلفة مثل الإنتاج والوصول عن بُعد والشركات والخارجي والمراقبة والأدوات.",
  },
  "DevOps Requests": {
    title: "خدمات منصة DevOps",
    description: "طلبات خدمات DevOps تمكّن فرق التطوير والأعمال من الحصول على خدمات DevOps متوافقة مع المعايير المؤسسية.",
  },
  "Platform Services": {
    title: "خدمات المنصات (Jira، HPSM، الخدمات السحابية)",
    description: "إدارة طلبات الخدمة المتعلقة بـ Jira وعمليات الحلول والخدمات السحابية ومدير الخدمات (HPSM).",
  },
  "IT Security Tools": {
    title: "أدوات الأمن",
    description: "إدارة طلبات الوصول الأمني وأمان البريد الإلكتروني واستكشاف الأخطاء.",
  },
};

const arabicFont = { fontFamily: "'Noto Sans Arabic', sans-serif" };

const RequestSection = ({ title, requests }: RequestSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const desc = sectionDescriptions[title];
  const descAr = sectionDescArabic[title];

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
        className="group mb-4 flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {iconMap[title]}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {sectionArabicNames[title] && (
          <span dir="rtl" lang="ar" className="text-sm text-muted-foreground" style={arabicFont}>
            {sectionArabicNames[title]}
          </span>
        )}
        <CountBadge count={requests.length} />
        {isOpen ? (
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="sm:ml-10">
          {desc && (
            <div className="mb-6 rounded-lg border border-border/60 bg-muted/50 p-4">
              <p className="mb-1 text-sm font-semibold text-foreground">{desc.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc.description}</p>
              {descAr && (
                <>
                  <p dir="rtl" lang="ar" className="text-sm font-semibold text-foreground/80 mt-2 mb-0.5" style={arabicFont}>{descAr.title}</p>
                  <p dir="rtl" lang="ar" className="text-[11px] text-muted-foreground/70 leading-relaxed" style={arabicFont}>{descAr.description}</p>
                </>
              )}
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
