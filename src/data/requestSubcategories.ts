import type { ServiceRequest } from "@/data/requests";

export interface RequestSubcategory {
  id: string;
  en: string;
  ar: string;
  matches: (request: ServiceRequest) => boolean;
}

const textOf = (request: ServiceRequest): string =>
  `${request.title} ${request.shortDescription} ${request.category} ${request.subSection ?? ""}`.toLowerCase();

const includesAny = (request: ServiceRequest, terms: string[]): boolean => {
  const text = textOf(request);
  return terms.some((term) => text.includes(term));
};

export const requestSubcategories: Record<string, RequestSubcategory[]> = {
  "Infrastructure & Hosting": [
    { id: "ocp-cloud", en: "OCP / Cloud", ar: "OCP / Cloud", matches: (r) => includesAny(r, ["openshift", "ocp", "cloud native", "kubernetes", "cloud group"]) },
    { id: "gcp-iaas", en: "GCP / IaaS", ar: "GCP / IaaS", matches: (r) => includesAny(r, ["gcp", "iaas", "namespace", "name space", "google cloud"]) },
    { id: "servers", en: "Servers", ar: "Servers", matches: (r) => includesAny(r, ["server", "hosting", "dco"]) },
    { id: "scale-up", en: "Scale Up", ar: "زيادة الموارد", matches: (r) => includesAny(r, ["scale up", "add cpu", "add ram", "add new server", "increase cpu", "increase ram"]) },
    { id: "scale-down", en: "Scale Down", ar: "تقليل الموارد", matches: (r) => includesAny(r, ["scale down", "decrease", "reduce infrastructure"]) },
    { id: "dr", en: "DR", ar: "DR", matches: (r) => includesAny(r, [" dr ", "dr site", "disaster recovery"]) },
    { id: "os", en: "Operating System", ar: "Operating System", matches: (r) => includesAny(r, ["operating system", "server patching", "patching exception", "cis compliance", "redhat", "windows", "linux"]) },
    { id: "security-agents", en: "Security Agents", ar: "Security Agents", matches: (r) => includesAny(r, ["siem", "edr", "antivirus", "request agents", "security agent"]) },
  ],
  "Storage & Backup": [
    { id: "storage", en: "Storage", ar: "Storage", matches: (r) => includesAny(r, ["storage", "disk", "nfs", "smb", "s3"]) },
    { id: "backup", en: "Backup & Restore", ar: "Backup وRestore", matches: (r) => includesAny(r, ["backup", "restore", "recovery"]) },
    { id: "archive", en: "Archive", ar: "Archive", matches: (r) => includesAny(r, ["archive"]) },
  ],
  "Network & Connectivity": [
    { id: "dns-domain", en: "DNS & Domain", ar: "DNS وDomain", matches: (r) => includesAny(r, ["dns", "domain"]) },
    { id: "lb-waf", en: "Load Balancer & WAF", ar: "Load Balancer وWAF", matches: (r) => includesAny(r, ["load balancer", " lb ", "waf", "service design change"]) },
    { id: "connectivity", en: "Connectivity & VPN", ar: "Connectivity وVPN", matches: (r) => includesAny(r, ["connectivity", "vpn", "mpls", "gsn", "site to site", "ipsec"]) },
    { id: "vlan", en: "VLAN", ar: "VLAN", matches: (r) => includesAny(r, ["vlan"]) },
    { id: "ssl", en: "SSL & Certificates", ar: "SSL وCertificates", matches: (r) => includesAny(r, ["ssl", "certificate", "csr"]) },
    { id: "security", en: "Network Security", ar: "Network Security", matches: (r) => includesAny(r, ["security", "firewall", "whitelist", "block domain"]) },
  ],
  "Access & Privileges": [
    { id: "devqa-access", en: "Dev/QA Access", ar: "صلاحيات Dev/QA", matches: (r) => includesAny(r, ["dev, qa", "dev/qa", "development environment"]) },
    { id: "prod-access", en: "Production Access", ar: "صلاحيات Production", matches: (r) => includesAny(r, ["production access", "db/app/kibana"]) },
    { id: "remote", en: "Remote & VPN", ar: "Remote وVPN", matches: (r) => includesAny(r, ["remote access", "vpn"]) },
    { id: "accounts", en: "Accounts & Users", ar: "Accounts وUsers", matches: (r) => includesAny(r, ["account", "user", "onboarding", "manage users", "portal access"]) },
    { id: "privileged", en: "Privileged Access", ar: "Privileged Access", matches: (r) => includesAny(r, ["privileged", "service account"]) },
    { id: "tools", en: "Tool Access", ar: "صلاحيات الأدوات", matches: (r) => includesAny(r, ["devsecops", "nextcloud", "monitoring", "ucmdb"]) },
  ],
  "Platform & Cloud Services": [
    { id: "paas", en: "PaaS", ar: "PaaS", matches: (r) => includesAny(r, ["paas", "redis", "kafka"]) },
    { id: "ai", en: "AI Platform", ar: "AI Platform", matches: (r) => includesAny(r, ["ai platform", "ai-driven"]) },
    { id: "monitoring", en: "Monitoring", ar: "Monitoring", matches: (r) => includesAny(r, ["monitoring"]) },
    { id: "iaas", en: "IaaS", ar: "IaaS", matches: (r) => includesAny(r, ["iaas"]) },
    { id: "support", en: "Platform Support", ar: "دعم Platform", matches: (r) => includesAny(r, ["platform infra", "solution operation", "support"]) },
  ],
  "Application Lifecycle": [
    { id: "service-name", en: "Service Name", ar: "اسم Service", matches: (r) => includesAny(r, ["service name", "renaming"]) },
    { id: "publish", en: "Publishing", ar: "النشر", matches: (r) => includesAny(r, ["publishing", "publish", "release", "minor change"]) },
    { id: "retire", en: "Retirement", ar: "إيقاف الخدمة", matches: (r) => includesAny(r, ["retirement", "retire", "decommission"]) },
    { id: "project", en: "Project Requests", ar: "طلبات المشاريع", matches: (r) => includesAny(r, ["technology project", "project request"]) },
  ],
  "Application & Database": [
    { id: "database", en: "Database", ar: "Database", matches: (r) => includesAny(r, ["database", " db "]) },
    { id: "application", en: "Application", ar: "Application", matches: (r) => includesAny(r, ["application service", "application management"]) },
    { id: "integration", en: "Integration & API", ar: "Integration وAPI", matches: (r) => includesAny(r, ["integration", "api"]) },
    { id: "performance", en: "Performance Test", ar: "اختبار الأداء", matches: (r) => includesAny(r, ["performance test"]) },
    { id: "logs", en: "Logs", ar: "Logs", matches: (r) => includesAny(r, ["log request", "transactional logs"]) },
  ],
  "DevOps & Software Delivery": [
    { id: "access", en: "Platform Access", ar: "صلاحيات Platform", matches: (r) => includesAny(r, ["access management", "access request"]) },
    { id: "source", en: "Source Code", ar: "Source Code", matches: (r) => includesAny(r, ["source code", "repository creation"]) },
    { id: "pipeline", en: "CI/CD Pipeline", ar: "CI/CD Pipeline", matches: (r) => includesAny(r, ["pipeline", "ci/cd"]) },
    { id: "artifact", en: "Artifacts & Repository", ar: "Artifacts وRepository", matches: (r) => includesAny(r, ["artifact", "repository management", "nexus"]) },
    { id: "devsecops", en: "DevSecOps", ar: "DevSecOps", matches: (r) => includesAny(r, ["devsecops", "sast", "sca", "secrets scanning"]) },
    { id: "support", en: "Support", ar: "الدعم", matches: (r) => includesAny(r, ["support", "troubleshoot", "report", "scan file"]) },
  ],
  "Jira & Amer": [
    { id: "jira-access", en: "Jira Access & Projects", ar: "صلاحيات ومشاريع Jira", matches: (r) => includesAny(r, ["jira service request", "new project request in jira"]) },
    { id: "jira-report", en: "Reports", ar: "التقارير", matches: (r) => includesAny(r, ["create report", "views & reports"]) },
    { id: "jira-support", en: "Troubleshooting", ar: "معالجة المشكلات", matches: (r) => includesAny(r, ["troubleshooting", "issues"]) },
    { id: "workflow", en: "Workflow & Process", ar: "Workflow وProcess", matches: (r) => includesAny(r, ["sr4sr", "workflow", "process requests"]) },
    { id: "service-manager", en: "Service Manager", ar: "Service Manager", matches: (r) => includesAny(r, ["service manager"]) },
  ],
  "BI, Analytics & Reporting": [
    { id: "reports", en: "Reports", ar: "التقارير", matches: (r) => includesAny(r, ["report"]) },
    { id: "access", en: "BI Access", ar: "صلاحيات BI", matches: (r) => includesAny(r, ["access management", "users", "passwords"]) },
    { id: "dashboard", en: "Dashboards", ar: "Dashboards", matches: (r) => includesAny(r, ["dashboard", "power bi"]) },
    { id: "cost", en: "Cost Analysis", ar: "تحليل التكلفة", matches: (r) => includesAny(r, ["cost", "boq"]) },
  ],
  "UX, Web & Mobile": [
    { id: "mobile-dev", en: "Mobile Development", ar: "تطوير Mobile", matches: (r) => includesAny(r, ["mobile app development", "frontend"]) },
    { id: "mobile-test", en: "Testing", ar: "الاختبار", matches: (r) => includesAny(r, ["testing", "usability test", "assessment"]) },
    { id: "design", en: "UX/UI Design", ar: "تصميم UX/UI", matches: (r) => includesAny(r, ["ux/ui design", "figma"]) },
    { id: "estimate", en: "Estimation", ar: "التقدير", matches: (r) => includesAny(r, ["estimation", "cost of mobile"]) },
  ],
};

export const getSectionSubcategories = (section: string): RequestSubcategory[] =>
  requestSubcategories[section] ?? [];
