import type { ServiceRequest } from "@/data/requests";

const sectionAr: Record<string, string> = {
  "General Help": "مساعدة عامة",
  "Infrastructure & Hosting": "Infrastructure وHosting",
  "Storage & Backup": "Storage والنسخ الاحتياطي",
  "Network & Connectivity": "Network والاتصال",
  "Access & Privileges": "الصلاحيات والوصول",
  "Platform & Cloud Services": "Platform وخدمات Cloud",
  "Application Lifecycle": "دورة حياة Application",
  "Application & Database": "Application وDatabase",
  "DevOps & Software Delivery": "DevOps وتسليم البرمجيات",
  "Jira & Amer": "Jira وAmer",
  "BI, Analytics & Reporting": "BI والتحليلات والتقارير",
  "UX, Web & Mobile": "UX وWeb وMobile",
  "Business Operations": "عمليات الأعمال",
  "General Services": "خدمات عامة",
};

const categoryAr: Record<string, string> = {
  "Internal Technology Requests": "طلبات تقنية داخلية",
  "Products and Projects Requests": "طلبات المنتجات والمشاريع",
  "General IT Operations Services": "خدمات IT Operations العامة",
  "Platform services (Jira, HPSM, Cloud NativeServices)": "خدمات Platform",
  "Network & Security": "Network وSecurity",
  "User Access Management": "إدارة صلاحيات المستخدمين",
  BizOps: "BizOps",
  "BI Service Request": "طلبات BI",
  "DevOps Platform Services": "خدمات DevOps Platform",
  "Mobile App Requests": "طلبات Mobile App",
  "UXUI Request": "طلبات UX/UI",
};

const exactTitles: Record<string, string> = {
  "General Help Request": "طلب مساعدة عامة",
  "Create New Project OCP Environment (DEV/QA)": "إنشاء بيئة OCP جديدة للمشروع (Dev/QA)",
  "Create name space in IaaS (GCP)": "إنشاء Namespace في IaaS (GCP)",
  "Create new Project | Service in OpenShift": "إنشاء Project أو Service جديدة في OpenShift",
  "Create new Staging/Production Server for Project/Service": "إنشاء Server جديد لبيئة Staging/Production للمشروع أو الخدمة",
  "Create New DR Servers for Project/Service": "إنشاء DR Servers جديدة للمشروع أو الخدمة",
  "Scale Up: Add New Server": "Scale Up: إضافة Server جديد",
  "Scale Up: Add CPU, RAM, or Storage": "Scale Up: زيادة CPU أو RAM أو Storage",
  "Service Scale Down": "تقليل موارد الخدمة",
  "New DNS  (New | Update DNS)": "إنشاء أو تحديث DNS",
  "Register Domain": "تسجيل Domain",
  "New Load Balancer Configuration": "إنشاء إعداد Load Balancer جديد",
  "Load Balancer Configuration": "إعداد Load Balancer",
  "New VLAN Creation": "إنشاء VLAN جديد",
  "Order SSL Certificate": "طلب شهادة SSL",
  "CSR File Creation": "إنشاء ملف CSR",
  "Remote Access": "طلب Remote Access",
  "Production Access (DB/APP/Kibana)": "طلب صلاحية على Production (DB/APP/Kibana)",
  "Corporate (Dev, QA) Access": "طلب صلاحية على Dev/QA",
  "DevSecOps Access Requests": "طلبات صلاحيات DevSecOps",
  "New Service Name Adding": "إضافة اسم Service جديد",
  "New Service Publishing": "نشر Service جديدة",
  "Service Retirement": "إيقاف Service",
  "Service Renaming": "تغيير اسم Service",
  "Performance Test Request": "طلب اختبار الأداء",
  "Google Captcha": "طلب Google CAPTCHA",
  "DevOps Platform Access Management": "إدارة صلاحيات DevOps Platform",
  "Source Code Management": "إدارة Source Code",
  "Pipeline Management": "إدارة CI/CD Pipeline",
  "Artifact/Repository Management": "إدارة Artifacts وRepository",
  "DevOps Platform Support": "دعم DevOps Platform",
  "Jira Service Request": "طلب خدمة Jira",
  "Jira Troubleshooting Request": "طلب معالجة مشكلة في Jira",
  "New Project Request in Jira": "طلب إنشاء Project جديد في Jira",
  "BI Report": "طلب تقرير BI",
  "BI Report Request": "طلب تقرير BI",
  "BI Access Management": "إدارة صلاحيات BI",
  "BI Project Request": "طلب مشروع BI",
  "Power BI Report": "طلب تقرير Power BI",
  "Mobile App Development Request": "طلب تطوير Mobile App",
  "Testing a Mobile App": "طلب اختبار Mobile App",
  "UX/UI Design Request": "طلب تصميم UX/UI",
  "Frontend (portal) Development": "طلب تطوير Frontend للبوابة",
};

const exactDescriptions: Record<string, string> = {
  "Request general help/support.": "اطلب مساعدة أو دعماً عاماً.",
  "Provides a project DevOps pipeline and required cloud-native infrastructure for developing and testing applications.": "يوفر DevOps Pipeline وCloud-native Infrastructure المطلوبة لتطوير التطبيقات واختبارها.",
  "Creates a new namespace/project in IaaS self-service. Users can create VMs through iaas.elm.sa self-service; VMs will be created in Google Cloud.": "ينشئ Namespace أو Project جديداً في IaaS Self Service، ويمكن إنشاء VMs من خلال iaas.elm.sa على Google Cloud.",
  "Provision new servers in DR site. Requires sharing sizing sheet with detailed requirements.": "يوفر Servers جديدة في موقع DR، ويتطلب إرفاق Sizing Sheet بالتفاصيل.",
  "Request to add new server(s) to the environment, such as staging or production.": "اطلب إضافة Server جديد إلى Environment مثل Staging أو Production.",
  "Increase CPU, RAM, or storage resources for existing servers in the environment.": "زيادة CPU أو RAM أو Storage للـ Servers الحالية في Environment.",
  "Request SSL certificate to secure websites or applications.": "اطلب شهادة SSL لتأمين الموقع أو Application.",
  "Request to publish a new service.": "اطلب نشر Service جديدة.",
  "Request to retire/decommission an existing service.": "اطلب إيقاف أو Decommission لـ Service موجودة.",
  "Request performance testing execution.": "اطلب تنفيذ Performance Test.",
};

const titleRules: Array<[RegExp, string]> = [
  [/^Create New /i, "إنشاء "], [/^Create /i, "إنشاء "], [/^New /i, "إنشاء "],
  [/^Request for /i, "طلب "], [/^Request /i, "طلب "], [/^Order /i, "طلب "],
  [/^Update /i, "تحديث "], [/^Manage /i, "إدارة "], [/^Provide /i, "توفير "],
  [/ Support Services$/i, " - خدمات دعم"], [/ Services Request$/i, " - طلب خدمات"],
  [/ Troubleshooting Requests?$/i, " - معالجة مشكلات"], [/ Access Requests?$/i, " - طلب صلاحيات"],
];

const descriptionRules: Array<[RegExp, string]> = [
  [/^Request to /i, "اطلب "], [/^Request /i, "طلب "], [/^Provide /i, "توفير "],
  [/^Create /i, "إنشاء "], [/^Grant access /i, "منح صلاحية "], [/^Support /i, "دعم "],
  [/^Manage /i, "إدارة "], [/^Used to /i, "يُستخدم لـ "],
];

const applyRules = (value: string, rules: Array<[RegExp, string]>): string => {
  for (const [pattern, replacement] of rules) {
    if (pattern.test(value)) return value.replace(pattern, replacement);
  }
  return value;
};

export interface LocalizedRequestContent {
  title: string;
  description: string;
  section: string;
  category: string;
  environment?: string;
}

export const localizeRequest = (request: ServiceRequest, isArabic: boolean): LocalizedRequestContent => {
  if (!isArabic) {
    return {
      title: request.title,
      description: request.shortDescription,
      section: request.section,
      category: request.category,
      environment: request.environment,
    };
  }

  return {
    title: exactTitles[request.title] ?? applyRules(request.title, titleRules),
    description: exactDescriptions[request.shortDescription] ?? applyRules(request.shortDescription, descriptionRules),
    section: sectionAr[request.section] ?? request.section,
    category: categoryAr[request.category] ?? request.category,
    environment: request.environment,
  };
};