import { useState } from "react";
import { CheckCircle, ExternalLink, Info, Layers, ChevronDown, ChevronUp, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const arabicFont = { fontFamily: "'Noto Sans Arabic', sans-serif" };

interface ChecklistItem {
  id: string;
  title: string;
  titleAr?: string;
  instruction: string;
  instructionAr?: string;
  serviceName?: string;
  required: boolean;
  parallel: boolean;
  jiraUrl?: string;
  extraLinks?: { label: string; url: string }[];
  requirementNote?: string;
  requirementNoteAr?: string;
  notes?: string[];
  notesAr?: string[];
}

interface Phase {
  name: string;
  nameAr: string;
  items: ChecklistItem[];
  beforeNotes?: string[];
  beforeNotesAr?: string[];
  beforeLinks?: { label: string; labelAr?: string; url: string }[];
}

const phases: Phase[] = [
  {
    name: "Preparation",
    nameAr: "التحضير",
    items: [
      {
        id: "prep-1",
        title: "Create the project in Jira",
        titleAr: "إنشاء المشروع في Jira",
        instruction: "Create the project in Jira to start the project journey.",
        instructionAr: "أنشئ المشروع في Jira لبدء رحلة المشروع.",
        serviceName: "New Service Name Adding",
        required: true,
        parallel: false,
        requirementNote: "Required when starting a new project/product or creating a new service name.",
        requirementNoteAr: "إلزامي عند بدء مشروع/منتج جديد أو إنشاء اسم خدمة جديد.",
        jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/299",
        notes: [
          "For changing the service name, use the related Jira request.",
          "By default, when the new service name is created, the below are also created:",
          "  1. Bitbucket",
          "  2. Wiki"
        ],
        notesAr: [
          "لتغيير اسم الخدمة، استخدم طلب Jira ذي الصلة.",
          "افتراضياً، عند إنشاء اسم الخدمة الجديد، يتم إنشاء ما يلي أيضاً:",
          "  1. Bitbucket",
          "  2. Wiki"
        ]
      }
    ],
    beforeNotes: [
      "Confirm that the domain is registered, if required.",
      "Confirm that the Developer Access Checklist is completed.",
      "Confirm that the SSL certificate is available from the client or Elm."
    ],
    beforeNotesAr: [
      "تأكد من تسجيل النطاق إذا كان مطلوباً.",
      "تأكد من إكمال قائمة وصول المطور.",
      "تأكد من توفر شهادة SSL من العميل أو Elm."
    ]
  },
  {
    name: "Dev/QA (VMs)",
    nameAr: "التطوير/الاختبار",
    items: [
      {
        id: "devqa-1",
        title: "Create your name space in IaaS (GCP)",
        titleAr: "لإنشاء مساحة عمل في IaaS (GCP)",
instruction:
    "Request a namespace only if your project/service does not already have one. After the namespace is created, the required Dev/QA servers can be provisioned directly through IaaS Self Service.",
  instructionAr:
    "اطلب إنشاء Namespace فقط إذا لم يكن لدى المشروع/الخدمة Namespace موجود مسبقاً. بعد إنشاء الـ Namespace، يمكن توفير خوادم Dev/QA المطلوبة بشكل ذاتي من خلال IaaS Self Service.",
        serviceName: "Dev/QA",
        required: true,
        parallel: false,
        requirementNote: "Required only if Dev/QA VM servers are needed and the project/product does not already have a namespace.",
        requirementNoteAr: "إلزامي فقط إذا كانت خوادم Dev/QA بنظام VM مطلوبة ولم يكن لدى المشروع/المنتج Namespace موجود مسبقاً.",
        extraLinks: [
          {
            label: "Create Namespace",
            url: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/405"
          },
          {
            label: "Open IaaS Self Service",
            url: "https://iaas.elm.sa"
          },
          {
            label: "Open IaaS Guide",
            url: "https://wiki.elm.sa/spaces/TAKS/pages/177490468/ELM+IAAS#tab-IaaS+Overview"
          }
        ],
        notes: [
          "First, create the namespace if it does not already exist.",
          "If the namespace already exists, the required VMs can be provisioned through IaaS Self Service.",
          "CI/CD pipeline is created by default with the Dev/QA environment.",
          "Any modification to the existing CI/CD pipeline, such as version change or OCP to VM migration, requires a separate request."
        ],
        notesAr: [
          "أولاً، قم بإنشاء الـ Namespace إذا لم يكن موجوداً مسبقاً.",
          "إذا كان الـ Namespace موجوداً مسبقاً، يمكن توفير الـ VMs المطلوبة من خلال خدمة IaaS الذاتية.",
          "يتم إنشاء خط أنابيب CI/CD افتراضياً مع بيئة Dev/QA.",
          "أي تعديل على خط الأنابيب CI/CD الموجود، مثل تغيير الإصدار أو ترحيل OCP إلى VM، يتطلب طلباً منفصلاً."
        ]
      },
      {
        id: "devqa-2",
        title: "Create OCP / Container Based Environment",
        titleAr: "إنشاء بيئة OCP / قائمة على الحاويات",
        instruction: "Use this request to create the IaaS space and the OCP namespace for the project/product. It can be used for Dev/QA and continues with the same request path when the project/product is ready to move to Staging or Production.",
        instructionAr: "استخدم هذا الطلب لإنشاء مساحة IaaS و Namespace في OCP للمشروع/المنتج. يمكن استخدامه لبيئة Dev/QA، ويتم الاستمرار على نفس مسار الطلب عندما يكون المشروع/المنتج جاهزاً للانتقال إلى Staging أو Production.",
        serviceName: "OCP Environment",
        required: true,
        parallel: false,
        requirementNote: "Required only if the project/product needs an OCP / container-based environment.",
        requirementNoteAr: "إلزامي فقط إذا كان المشروع/المنتج يحتاج بيئة OCP / قائمة على الحاويات.",
        jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/257",
        extraLinks: [
          {
            label: "Open IaaS Self Service",
            url: "https://iaas.elm.sa"
          },
          {
            label: "Open IaaS Guide",
            url: "https://wiki.elm.sa/spaces/TAKS/pages/177490468/ELM+IAAS#tab-IaaS+Overview"
          }
        ],
        notes: [
          "This request is used to create the IaaS space and the OCP namespace for the project/product.",
          "If Dev/QA is created on OCP, the same request path should continue when moving to Staging or Production.",
          "If a database is needed, request it separately through IaaS Self Service after the namespace is created."
        ],
        notesAr: [
          "يستخدم هذا الطلب لإنشاء مساحة IaaS و Namespace في OCP للمشروع/المنتج.",
          "إذا تم إنشاء Dev/QA على OCP، يتم الاستمرار على نفس مسار الطلب عند الانتقال إلى Staging أو Production.",
          "إذا كانت قاعدة البيانات مطلوبة، يتم طلبها بشكل منفصل وذاتي من خلال IaaS Self Service بعد إنشاء الـ Namespace."
        ]
      },
      
    ]
  },
  {
    name: "Staging and Production",
    nameAr: "التجهيز والإنتاج",
    items: [
      {
        id: "staging-prod-1",
        title: "Create Staging / Production VM Based request",
        titleAr: "إنشاء طلب خوادم لبيئة التجهيز / الإنتاج",
        instruction: "Create the Staging and Production environment and provision VM-based servers for the project/service.",
        instructionAr: "إنشاء بيئة التجهيز والإنتاج وتوفير الخوادم القائمة على VM للمشروع/الخدمة.",
        serviceName: "Staging and Production",
        required: true,
        parallel: false,
        requirementNote: "Required only if Staging / Production VM-based environment is needed.",
        requirementNoteAr: "إلزامي فقط إذا كانت بيئة Staging / Production القائمة على VM مطلوبة.",
        jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/405",
        notes: [
          "Use this request to create or provision the required Staging / Production VM-based environment.",
          "Supported VM operating systems: RedHat / Windows.",
          "GRC assessment is required if the service will be published externally.",
          "CAPTCHA is needed if required.",
          "Google Maps is needed if required.",
          "Shared services such as RMQ / RDS should be considered if needed."
        ],
        notesAr: [
          "استخدم هذا الطلب لإنشاء أو توفير بيئة Staging / Production القائمة على VM.",
          "أنظمة التشغيل المدعومة للـ VM: RedHat / Windows.",
          "تقييم GRC مطلوب إذا كانت الخدمة ستُنشر خارجياً.",
          "CAPTCHA مطلوب إذا لزم الأمر.",
          "Google Maps مطلوب إذا لزم الأمر.",
          "يجب مراعاة الخدمات المشتركة مثل RMQ / RDS إذا لزم الأمر."
        ]
      }
,
      {
        id: "staging-prod-ocp",
        title: "OCP Staging / Production Continuation",
        titleAr: "استكمال OCP لبيئة Staging / Production",
        instruction:
          "If the project/product was already created on OCP for Dev/QA, you do not need to open a separate OCP Production request. Continue using the same OCP request/path when moving to Staging or Production.",
        instructionAr:
          "إذا تم إنشاء المشروع/المنتج مسبقاً على OCP لبيئة Dev/QA، لا تحتاج إلى فتح طلب OCP Production منفصل. يتم الاستمرار على نفس طلب/مسار OCP عند الانتقال إلى Staging أو Production.",
        serviceName: "OCP Environment",
        required: false,
        parallel: false,
        notes: [
          "This note applies only to OCP / container-based environments.",
          "For VM-based Staging / Production, use the VM Based request above.",
          "Keep the deployment path consistent from Dev/QA to Staging and Production."
        ],
        notesAr: [
          "هذه الملاحظة خاصة ببيئات OCP / الحاويات فقط.",
          "لبيئة Staging / Production القائمة على VM، استخدم طلب VM Based أعلاه.",
          "حافظ على نفس مسار النشر من Dev/QA إلى Staging و Production."
        ]
      },
    ],
    beforeNotes: [
      "Confirm that the RFC / Change Request is opened before deployment.",
      "Confirm that the service type is Request For Change.",
      "Confirm the required deployment checklist is completed.",
      "Confirm that the KT / Handover session is completed with APP, DB, OPM, and CM teams.",
      "Confirm that the MRF is submitted for release.",
      "For external publish, confirm that GRC approval is obtained.",
      "Confirm that GRC approval is attached in the Service Request."
    ],
    beforeNotesAr: [
      "تأكد من فتح RFC / طلب التغيير قبل النشر.",
      "تأكد أن نوع الخدمة هو طلب تغيير.",
      "تأكد من إكمال قائمة التحقق المطلوبة للنشر.",
      "تأكد من إكمال جلسة KT / التسليم مع فرق APP و DB و OPM و CM.",
      "تأكد من تقديم MRF للإصدار.",
      "للنشر الخارجي، تأكد من الحصول على موافقة فريق GRC.",
      "تأكد من إرفاق موافقة GRC في طلب الخدمة."
    ]
  }
];

const parallelActions = [
  {
    title: "Register Domain",
    titleAr: "تسجيل النطاق",
    jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/708",
    notes: ["Domain registration is mandatory to enable CAPTCHA and Google Maps services."]
  },
  {
    title: "Issue SSL Certificate",
    titleAr: "إصدار شهادة SSL",
    jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/709"
  },
  {
    title: "Google CAPTCHA",
    titleAr: "Google CAPTCHA",
    jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/829",
    notes: ["Request Google CAPTCHA when the service requires CAPTCHA integration."]
  },
  {
    title: "Performance Test Request",
    titleAr: "طلب اختبار الأداء",
    jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/735",
    notes: ["Request a performance test when the project/product needs load, stress, or performance validation."]
  },
  {
    title: "Google Maps",
    titleAr: "خرائط Google",
    jiraUrl: "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/710",
    notes: ["Request Google Maps when the project/product requires Google Maps integration."]
  },
  {
    title: "Handover with Application Team and Operation Project Manager",
    titleAr: "التسليم مع فريق التطبيقات ومدير عمليات المشروع",
    notes: [
      "Complete the KT / handover session with the Application Team and Operation Project Manager before deployment or production readiness."
    ],
    notesAr: [
      "إكمال جلسة KT / التسليم مع فريق التطبيقات ومدير عمليات المشروع قبل النشر أو جاهزية الإنتاج."
    ]
  }
];

interface DeveloperTool {
  phase: string;
  name: string;
  purpose: string;
  required: "Required" | "Conditional" | "Optional";
  grantAccessFrom: string;
  linkToAccess: string;
  supportOwner: string;
  comment: string;
}

const developerOnboarding: DeveloperTool[] = [
  {
    "phase": "1. Basic Project Access",
    "name": "Jira",
    "purpose": "Raise SRs, RFCs, and track project/issues",
    "required": "Required",
    "grantAccessFrom": "None",
    "linkToAccess": "https://jira.elm.sa",
    "supportOwner": "DevOps",
    "comment": ""
  },
  {
    "phase": "1. Basic Project Access",
    "name": "Bitbucket",
    "purpose": "Code repository",
    "required": "Required",
    "grantAccessFrom": "Service name creation / DevOps request",
    "linkToAccess": "https://bitbucket.elm.sa",
    "supportOwner": "DevOps",
    "comment": "Created when service name adding is completed"
  },
  {
    "phase": "1. Basic Project Access",
    "name": "Wiki",
    "purpose": "Documentation space",
    "required": "Required",
    "grantAccessFrom": "Service name creation / DevOps request",
    "linkToAccess": "https://wiki.elm.sa",
    "supportOwner": "DevOps",
    "comment": "Created when service name adding is completed"
  },
  {
    "phase": "1. Basic Project Access",
    "name": "Bamboo",
    "purpose": "CI/CD pipeline tool",
    "required": "Required",
    "grantAccessFrom": "Service name creation / DevOps request",
    "linkToAccess": "https://bamboo.elm.sa",
    "supportOwner": "DevOps",
    "comment": "Created when service name adding is completed"
  },
  {
    "phase": "1. Basic Project Access",
    "name": "CloudBees",
    "purpose": "CI/CD pipeline tool",
    "required": "Optional",
    "grantAccessFrom": "DevOps request",
    "linkToAccess": "https://ci.devops.elm.sa",
    "supportOwner": "DevOps",
    "comment": "Use if the project pipeline is on CloudBees"
  },
  {
    "phase": "2. Source Code & Repository Setup",
    "name": "Repo Creation",
    "purpose": "Create repository to upload the code",
    "required": "Required",
    "grantAccessFrom": "DevOps",
    "linkToAccess": "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/784",
    "supportOwner": "DevOps",
    "comment": "Needed before code upload"
  },
  {
    "phase": "2. Source Code & Repository Setup",
    "name": "Access for the repo",
    "purpose": "Grant developer access to the repository",
    "required": "Required",
    "grantAccessFrom": "DevOps",
    "linkToAccess": "devops@elm.sa",
    "supportOwner": "DevOps",
    "comment": "devops@elm.sa"
  },
  {
    "phase": "2. Source Code & Repository Setup",
    "name": "Nexus",
    "purpose": "Repository manager for artifacts/packages",
    "required": "Conditional",
    "grantAccessFrom": "DevOps request",
    "linkToAccess": "https://nexus.elm.sa",
    "supportOwner": "DevOps",
    "comment": "Required if project uses artifact/package repository"
  },
  {
    "phase": "2. Source Code & Repository Setup",
    "name": "NexusIQ",
    "purpose": "Security code scanner",
    "required": "Conditional",
    "grantAccessFrom": "DevOps request",
    "linkToAccess": "https://nexusiq.elm.sa",
    "supportOwner": "DevOps / Security",
    "comment": "Required if security scan is needed"
  },
  {
    "phase": "3. Development Environment Access",
    "name": "Google QA Cloud Env",
    "purpose": "Access to QA cloud environment",
    "required": "Conditional",
    "grantAccessFrom": "Cloud request / access request",
    "linkToAccess": "https://iaas.elm.sa",
    "supportOwner": "Cloud / DevOps",
    "comment": "Required for GCP projects"
  },
  {
    "phase": "3. Development Environment Access",
    "name": "Dev/QA VM Servers (Application/DB) Access",
    "purpose": "Access to Dev/QA application or DB servers",
    "required": "Conditional",
    "grantAccessFrom": "Jira access request",
    "linkToAccess": "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/233",
    "supportOwner": "Infra / DevOps",
    "comment": "Required for VM-based projects"
  },

  {
    "phase": "3. Development Environment Access",
    "name": "Keycloak",
    "purpose": "ELM Single Sign-On",
    "required": "Conditional",
    "grantAccessFrom": "IAM / DevOps request",
    "linkToAccess": "https://idp.apps.devocp4.elm.sa/",
    "supportOwner": "IAM / DevOps",
    "comment": "Required if the application uses SSO"
  },
  {
    "phase": "3. Development Environment Access",
    "name": "3Scale Portal Access",
    "purpose": "ELM API Gateway",
    "required": "Conditional",
    "grantAccessFrom": "Access request",
    "linkToAccess": "https://3scale-admin.apps.devocp4.elm.sa/p/login",
    "supportOwner": "API Team",
    "comment": "Required if API Gateway is used"
  },
  {
    "phase": "3. Development Environment Access",
    "name": "Create User for domains (NIC, ELMST)",
    "purpose": "Access to different application environments",
    "required": "Conditional",
    "grantAccessFrom": "IAM request",
    "linkToAccess": "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/406",
    "supportOwner": "IAM / Support",
    "comment": "Required if domain user is needed"
  },
  {
    "phase": "4. Deployment & CI/CD",
    "name": "Create Dev/QA Pipeline CI/CD",
    "purpose": "Pipeline for Dev/QA deployment",
    "required": "Required",
    "grantAccessFrom": "Created by default when Dev/QA is created",
    "linkToAccess": "",
    "supportOwner": "DevOps",
    "comment": ""
  },
  {
    "phase": "4. Deployment & CI/CD",
    "name": "Bamboo / CloudBees",
    "purpose": "Build and deployment pipeline",
    "required": "Conditional",
    "grantAccessFrom": "DevOps request",
    "linkToAccess": "https://bamboo.elm.sa / https://ci.devops.elm.sa",
    "supportOwner": "DevOps",
    "comment": "Depends on the project pipeline"
  },
  {
    "phase": "4. Deployment & CI/CD",
    "name": "ArgoCD",
    "purpose": "Continuous deployment tool",
    "required": "Conditional",
    "grantAccessFrom": "DevOps request",
    "linkToAccess": "https://cd.devops.elm.sa/",
    "supportOwner": "DevOps",
    "comment": "Required for OCP deployment"
  },
  {
    "phase": "5. Database & Production Access",
    "name": "Production DB Access",
    "purpose": "Access to production database",
    "required": "Optional",
    "grantAccessFrom": "Jira access request",
    "linkToAccess": "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/406",
    "supportOwner": "DB Team",
    "comment": "Might not be required. Optional and should be approved"
  },
  {
    "phase": "6. Remote / Laptop Access",
    "name": "VPN Request",
    "purpose": "Access ELM resources remotely",
    "required": "Conditional",
    "grantAccessFrom": "Jira request",
    "linkToAccess": "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/750",
    "supportOwner": "Network / Security",
    "comment": "Needed for working from home or outside office"
  },
  {
    "phase": "6. Remote / Laptop Access",
    "name": "RSA Setup",
    "purpose": "MFA for VPN / secure access",
    "required": "Conditional",
    "grantAccessFrom": "Security request",
    "linkToAccess": "https://jira.elm.sa/plugins/servlet/desk/portal/14/create/750",
    "supportOwner": "Security",
    "comment": "Usually required with VPN"
  },
  {
    "phase": "6. Remote / Laptop Access",
    "name": "Devall Group",
    "purpose": "Default developer access group",
    "required": "Required",
    "grantAccessFrom": "Devops request",
    "linkToAccess": "devops@elm.sa",
    "supportOwner": "IAM",
    "comment": "Add user to Devall to get default access"
  },
  {
    "phase": "6. Remote / Laptop Access",
    "name": "Admin Access on User Laptop",
    "purpose": "Install development tools",
    "required": "Optional",
    "grantAccessFrom": "IT Support request",
    "linkToAccess": "800@elm.sa",
    "supportOwner": "IT Support",
    "comment": "Needed only if developer must install tools"
  }
];

const developerChecklistGuide = [
  {
    label: "Required",
    meaning: "Must be completed for most developers/projects.",
    action: "Raise or confirm the access before delivery starts."
  },
  {
    label: "Conditional",
    meaning: "Needed only if the project uses a specific technology or environment.",
    action: "Confirm with the technical team before raising."
  },
  {
    label: "Optional",
    meaning: "Not always needed and may require approval.",
    action: "Raise only when there is a clear justification."
  }
];

const supportedTech = {
  operatingSystems: ["Linux", "Windows"],
  applicationLevel: [
    "Tomcat",
    "JBoss",
    "3Scale",
    "Redis",
    "RabbitMQ",
    "ActiveMQ",
    "IIS",
    "Red Hat SSO",
    "NextGen Connect - Mirth Connect",
    "Kentico",
    "Node.js",
    "Spring",
    "Nginx",
    "Talend",
    "Hangfire",
    "OpenShift",
    "Camunda"
  ],
  databases: ["SQL Server", "PostgreSQL", "Oracle", "Couchbase"]
};

const platformNotes = [
  "OpenShift (OCP) supported runtime technologies: Java, .NET, Node.js, Python",
  "Virtual Machines (VMs) supported operating systems: Linux, Windows"
];

const deploymentRequirements = [
  "For VMs: Load Balancer and Web Application Firewall (WAF) must be configured.",
  "For OCP: No Load Balancer or WAF configuration is required."
];

const importantNotes = [
  "MRF document can be found at: wiki.elm.sa",
  "Always identify the supporting technology required before proceeding."
];

const ProjectJourneyChecklist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(phases.map(p => p.name)));
  const [publishType, setPublishType] = useState<'internal' | 'external' | null>(null);
  const [isDeveloperChecklistOpen, setIsDeveloperChecklistOpen] = useState(false);

  const beforeProceedingNotes = phases.flatMap((phase) => phase.beforeNotes ?? []);
  const beforeProceedingNotesAr = phases.flatMap((phase) => phase.beforeNotesAr ?? []);
  const beforeProceedingLinks = phases.flatMap((phase) => phase.beforeLinks ?? []);

  const developerPhases = Array.from(new Set(developerOnboarding.map((tool) => tool.phase)));
  const developerSummary = {
    required: developerOnboarding.filter((tool) => tool.required === "Required").length,
    conditional: developerOnboarding.filter((tool) => tool.required === "Conditional").length,
    optional: developerOnboarding.filter((tool) => tool.required === "Optional").length
  };

  const getRequirementBadgeVariant = (required: DeveloperTool["required"]) => {
    if (required === "Required") return "default";
    if (required === "Conditional") return "secondary";
    return "outline";
  };

  const renderDeveloperLink = (value: string) => {
    if (!value) return <span className="text-muted-foreground/50">—</span>;

    if (value.includes(" / ")) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.split(" / ").map((part) => (
            part.startsWith("http") ? (
              <a key={part} href={part} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Open
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            ) : (
              <span key={part} className="text-xs text-muted-foreground">{part}</span>
            )
          ))}
        </div>
      );
    }

    if (value.startsWith("http")) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Open Link
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </a>
      );
    }

    if (value.includes("@")) {
      return (
        <a href={`mailto:${value}`} className="text-primary hover:underline">
          {value}
        </a>
      );
    }

    return <span>{value}</span>;
  };

  const togglePhase = (phaseName: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseName)) {
      newExpanded.delete(phaseName);
    } else {
      newExpanded.add(phaseName);
    }
    setExpandedPhases(newExpanded);
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="mb-3 cursor-pointer rounded-lg border border-primary/15 bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Project Journey Checklist</h3>
            <p dir="rtl" lang="ar" className="text-xs text-primary/60 font-medium" style={arabicFont}>دليل رحلة المشروع</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Step-by-step guide for project managers and technical teams to ensure nothing is missed.
            </p>
            <p dir="rtl" lang="ar" className="hidden text-xs text-muted-foreground/60 mt-1 md:block" style={arabicFont}>
              دليل خطوة بخطوة لمديري المشاريع والفرق التقنية للتأكد من عدم نسيان أي شيء
            </p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-primary/15 rounded-xl shadow-sm mb-10 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/[0.06] to-secondary/[0.04] px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Project Journey Checklist</h3>
              <p dir="rtl" lang="ar" className="text-xs text-muted-foreground/70" style={arabicFont}>دليل رحلة المشروع</p>
              <p className="text-xs text-muted-foreground">Complete guide for project managers and technical teams</p>
              <p dir="rtl" lang="ar" className="text-[11px] text-muted-foreground/60" style={arabicFont}>دليل شامل لمديري المشاريع والفرق التقنية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 text-xs text-muted-foreground">
              Close | إغلاق
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {phases.map((phase) => (
          <Card key={phase.name} className="border-border">
            <Collapsible open={expandedPhases.has(phase.name)} onOpenChange={() => togglePhase(phase.name)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <span>{phase.name}</span>
                      <span className="text-muted-foreground/50">|</span>
                      <span dir="rtl" lang="ar" className="text-sm text-muted-foreground" style={arabicFont}>{phase.nameAr}</span>
                    </div>
                    {expandedPhases.has(phase.name) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {phase.items.map((item) => (
                      <div id={item.id} key={item.id} className="border border-border rounded-lg p-4 bg-background scroll-mt-28">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                              {item.titleAr && (
                                <span dir="rtl" lang="ar" className="text-xs text-muted-foreground" style={arabicFont}>{item.titleAr}</span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.required && (
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Required if applicable | إلزامي عند الحاجة
                                </Badge>
                              )}
                              {item.parallel && (
                                <Badge variant="secondary" className="text-xs">
                                  Parallel | بالتوازي
                                </Badge>
                              )}
                            </div>

                            {item.requirementNote && (
                              <div className="mb-3 rounded-md border border-blue-100 bg-blue-50/70 px-3 py-2">
                                <p className="text-xs font-medium text-blue-800">
                                  {item.requirementNote}
                                </p>
                                {item.requirementNoteAr && (
                                  <p dir="rtl" lang="ar" className="text-xs text-blue-700 mt-1" style={arabicFont}>
                                    {item.requirementNoteAr}
                                  </p>
                                )}
                              </div>
                            )}

                            <p className="text-sm text-muted-foreground mb-2">{item.instruction}</p>
                            {item.instructionAr && (
                              <p dir="rtl" lang="ar" className="text-xs text-muted-foreground/70 mb-2" style={arabicFont}>{item.instructionAr}</p>
                            )}

                            {item.serviceName && (
                              <p className="text-xs text-muted-foreground mb-2">
                                <strong>Service Name:</strong> {item.serviceName}
                              </p>
                            )}

                            {item.notes && (
                              <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                                <strong className="text-foreground">Important Notes:</strong>
                                <ul className="mt-1 space-y-1 text-muted-foreground">
                                  {item.notes.map((note, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span>•</span>
                                      <span>{note}</span>
                                    </li>
                                  ))}
                                </ul>
                                {item.notesAr && (
                                  <div dir="rtl" className="mt-2 text-muted-foreground/70" style={arabicFont}>
                                    <ul className="space-y-1">
                                      {item.notesAr.map((note, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <span>•</span>
                                          <span>{note}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {item.jiraUrl && (
                              <a href={item.jiraUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline" className="w-full">
                                  Open in Jira
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </a>
                            )}

                            {item.extraLinks?.map((link) => (
                              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline" className="w-full">
                                  {link.label}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </a>
                            ))}

                            {item.id === "staging-prod-ocp" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  document.getElementById("devqa-2")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                }}
                              >
                                Back to Dev/QA OCP Request
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}

        {/* Deployment */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Deployment</span>
              <span className="text-muted-foreground/50">|</span>
                      <span dir="rtl" lang="ar" className="text-sm text-muted-foreground" style={arabicFont}>التنفيذ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 flex-1">
                <p className="text-sm text-muted-foreground">
                  Before going live, make sure the deployment change is opened and tracked in Jira.
                </p>

                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <h5 className="text-sm font-semibold text-foreground mb-2">Deployment Notes:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>Open a Change Request in Jira before deployment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>Attach the MRF and required approvals if applicable.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>Coordinate the deployment with APP, DB, OPM, and CM teams.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>Track the deployment execution and closure through Jira.</span>
                    </li>
                  </ul>

                  <div dir="rtl" className="mt-3 text-xs text-muted-foreground space-y-1" style={arabicFont}>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>افتح طلب تغيير في Jira قبل تنفيذ النشر.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>أرفق MRF والموافقات المطلوبة إذا كانت مطلوبة.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>نسّق النشر مع فرق APP و DB و OPM و CM.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>تابع تنفيذ النشر وإغلاقه من خلال Jira.</span>
                    </div>
                  </div>
                </div>
              </div>

              <a href="https://jira.elm.sa/secure/CreateIssue!default.jspa" target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button size="sm" variant="outline" className="w-full lg:w-auto">
                  Open Change Request in Jira
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>




        {/* Publishing Decision */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Publishing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Ask the user if they want to publish internally or externally.</p>
            <div className="flex gap-4 mb-4">
              <Button
                variant={publishType === 'internal' ? 'default' : 'outline'}
                onClick={() => setPublishType('internal')}
              >
                Internal Publish
              </Button>
              <Button
                variant={publishType === 'external' ? 'default' : 'outline'}
                onClick={() => setPublishType('external')}
              >
                External Publish
              </Button>
            </div>

            {publishType === 'external' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="text-sm font-medium text-red-800 mb-2">External Publish Requirements:</h5>
                <ul className="text-xs text-red-700 space-y-1 mb-3">
                  <li>• Approval from GRC team is mandatory through grc@elm.sa.</li>
                  <li>• Performance Test is required for external publish.</li>
                  <li>• Attach the approval and required evidence in the SR.</li>
                </ul>
                <a href="https://jira.elm.sa/plugins/servlet/desk/portal/14/create/205" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    Open publish request in Jira
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            )}

            {publishType === 'internal' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-2">
                  Internal Publish Requirements:
                </h5>

                <ul className="text-xs text-blue-700 space-y-1 mb-3">
                  <li>• Request Service Design Change for Load Balancer configuration.</li>
                </ul>

                <a
                  href="https://jira.elm.sa/plugins/servlet/desk/portal/14/create/402"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    Open Service Design Change
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parallel Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>Parallel Actions</span>
              <span className="text-muted-foreground/50">|</span>
                      <span dir="rtl" lang="ar" className="text-sm text-muted-foreground" style={arabicFont}>الأنشطة المتوازية</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parallelActions.map((action, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                  <div>
                    <h5 className="text-sm font-medium">{action.title}</h5>
                    {action.titleAr && (
                      <span dir="rtl" lang="ar" className="text-xs text-muted-foreground" style={arabicFont}>{action.titleAr}</span>
                    )}
                    {action.notes && (
                      <ul className="text-xs text-muted-foreground mt-1">
                        {action.notes.map((note, j) => (
                          <li key={j}>• {note}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {action.jiraUrl && (
                    <a href={action.jiraUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        Open in Jira
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Developer Onboarding Checklist */}
        <Card className="border-border shadow-sm">
          <Collapsible open={isDeveloperChecklistOpen} onOpenChange={setIsDeveloperChecklistOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/40 transition-colors">
                <CardTitle className="flex items-center justify-between gap-4 text-base">
                  <div className="flex items-center gap-2">
                    <span>Developer Access Checklist</span>
                    <span className="text-muted-foreground/50">|</span>
                      <span dir="rtl" lang="ar" className="text-sm text-muted-foreground" style={arabicFont}>قائمة وصول المطور</span>
                  </div>

                  <div className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                    <span dir="rtl" lang="ar" style={arabicFont}>
                      {isDeveloperChecklistOpen ? "إخفاء القائمة" : "إظهار المزيد"}
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>{isDeveloperChecklistOpen ? "Hide list" : "Show more"}</span>
                    {isDeveloperChecklistOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  {isDeveloperChecklistOpen
                    ? "Developer tools and access list are visible now. Click the button to hide the list."
                    : "Developer tools, access links, owners, and comments are hidden to keep the page clean. Click إظهار المزيد to view the full list."}
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
          <CardContent>
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Required</p>
                  <p className="text-xl font-semibold text-foreground">{developerSummary.required}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Conditional</p>
                  <p className="text-xl font-semibold text-foreground">{developerSummary.conditional}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Optional</p>
                  <p className="text-xl font-semibold text-foreground">{developerSummary.optional}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {developerChecklistGuide.map((guide) => (
                  <div key={guide.label} className="rounded-lg border border-border bg-muted/30 p-3">
                    <Badge variant={getRequirementBadgeVariant(guide.label as DeveloperTool["required"])} className="mb-2 text-xs">
                      {guide.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground leading-relaxed">{guide.meaning}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">{guide.action}</p>
                  </div>
                ))}
              </div>

              {developerPhases.map((phase) => {
                const phaseTools = developerOnboarding.filter((tool) => tool.phase === phase);

                return (
                  <div key={phase} className="rounded-lg border border-border bg-background overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between gap-3">
                      <h5 className="text-sm font-semibold text-foreground">{phase}</h5>
                      <Badge variant="outline" className="text-xs">{phaseTools.length} items</Badge>
                    </div>

                    <div className="divide-y divide-border">
                      {phaseTools.map((tool) => (
                        <div key={`${phase}-${tool.name}`} className="p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h6 className="text-sm font-semibold text-foreground">{tool.name}</h6>
                                <Badge variant={getRequirementBadgeVariant(tool.required)} className="text-xs">
                                  {tool.required}
                                </Badge>
                              </div>

                              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tool.purpose}</p>

                              <div className="grid gap-3 md:grid-cols-3">
                                <div>
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Grant Access From</p>
                                  <div className="text-xs text-foreground mt-1">{renderDeveloperLink(tool.grantAccessFrom)}</div>
                                </div>
                                <div>
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Owner</p>
                                  <p className="text-xs text-foreground mt-1">{tool.supportOwner || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Comment</p>
                                  <p className="text-xs text-muted-foreground mt-1">{tool.comment || "—"}</p>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 lg:w-36">
                              {renderDeveloperLink(tool.linkToAccess)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Supported Technologies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Operating Systems</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  {supportedTech.operatingSystems.map((os) => (
                    <li key={os} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{os}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Application Level</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  {supportedTech.applicationLevel.map((tech) => (
                    <li key={tech} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Database</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  {supportedTech.databases.map((db) => (
                    <li key={db} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{db}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {beforeProceedingNotes.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-900">
                <Info className="h-4 w-4" />
                <span>Final Check Before Proceeding</span>
                <span className="text-amber-500">|</span>
                <span dir="rtl" lang="ar" className="text-sm text-amber-700" style={arabicFont}>
                  التحقق النهائي قبل المتابعة
                </span>
              </CardTitle>
              <p className="text-xs text-amber-700">
                Before you move forward, make sure you have completed the checklist items below.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  {beforeProceedingNotes.map((note, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md border border-amber-200 bg-white/70 p-2"
                    >
                      <CheckCircle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                      <span className="text-xs text-amber-900 leading-relaxed">{note}</span>
                    </div>
                  ))}
                </div>

                {beforeProceedingNotesAr.length > 0 && (
                  <div dir="rtl" className="space-y-2" style={arabicFont}>
                    {beforeProceedingNotesAr.map((note, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-md border border-amber-200 bg-white/70 p-2"
                      >
                        <CheckCircle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                        <span className="text-xs text-amber-900 leading-relaxed">{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {beforeProceedingLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {beforeProceedingLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Technical Notes & Important Reminders */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Platform & Deployment Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Platform Support */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Platform Runtime Support</h5>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3 pl-4">
                  {platformNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deployment Requirements */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Infrastructure Requirements by Platform</h5>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3 pl-4">
                  {deploymentRequirements.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Reminder */}
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <h5 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span>⚠️ Critical Requirement</span>
                </h5>
                <p className="text-xs text-red-700 font-medium mb-2">
                  You MUST identify and specify the supporting technology for your project before submitting any requests.
                </p>
                <p className="text-xs text-red-600">
                  Refer to the "Supported Technologies" section above to choose the appropriate technology stack for your infrastructure and application needs.
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Important Notes</h5>
                <ul className="text-xs text-muted-foreground space-y-1 pl-4">
                  {importantNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectJourneyChecklist;
