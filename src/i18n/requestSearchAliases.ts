import type { ServiceRequest } from "@/data/requests";

interface AliasRule {
  terms: string[];
  aliases: string[];
}

const aliasRules: AliasRule[] = [
  { terms: ["server", "servers", "hosting"], aliases: ["سيرفر", "سيرفرات", "خادم", "خوادم"] },
  { terms: ["storage", "disk", "nfs", "smb", "s3"], aliases: ["تخزين", "مساحة", "قرص", "اقراص"] },
  { terms: ["backup", "restore", "recovery"], aliases: ["نسخ احتياطي", "باك اب", "استعادة", "استرجاع"] },
  { terms: ["network", "connectivity", "vlan", "mpls", "vpn"], aliases: ["شبكة", "شبكات", "اتصال", "ربط"] },
  { terms: ["access", "privilege", "permission", "account"], aliases: ["صلاحية", "صلاحيات", "وصول", "حساب", "مستخدم"] },
  { terms: ["publish", "publishing", "release"], aliases: ["نشر", "اطلاق", "إطلاق"] },
  { terms: ["retire", "retirement", "decommission"], aliases: ["ايقاف", "إيقاف", "الغاء", "إلغاء", "تقاعد"] },
  { terms: ["database", " db ", "sql"], aliases: ["قاعدة بيانات", "قواعد بيانات", "داتا بيس"] },
  { terms: ["certificate", "ssl", "csr", "tls"], aliases: ["شهادة", "شهادات", "تشفير"] },
  { terms: ["load balancer", "waf", "firewall"], aliases: ["لود بالانسر", "فايروول", "حماية"] },
  { terms: ["dns", "domain"], aliases: ["دومين", "نطاق", "اسم نطاق"] },
  { terms: ["scale up", "increase cpu", "increase ram", "add cpu", "add ram"], aliases: ["زيادة الموارد", "زيادة الرام", "زيادة المعالج", "توسعة"] },
  { terms: ["scale down", "reduce infrastructure", "decrease"], aliases: ["تقليل الموارد", "تخفيض الموارد"] },
  { terms: ["dev/qa", "dev, qa", "development", "testing"], aliases: ["تطوير", "اختبار", "بيئة التطوير", "بيئة الاختبار"] },
  { terms: ["staging", "production"], aliases: ["تجهيز", "انتاج", "إنتاج", "بيئة الانتاج", "بيئة الإنتاج"] },
  { terms: ["dr", "disaster recovery"], aliases: ["تعافي من الكوارث", "موقع التعافي"] },
  { terms: ["application", "app"], aliases: ["تطبيق", "تطبيقات"] },
  { terms: ["report", "dashboard", "analytics", "bi"], aliases: ["تقرير", "تقارير", "لوحة معلومات", "تحليلات"] },
  { terms: ["support", "help", "troubleshoot"], aliases: ["مساعدة", "دعم", "مشكلة", "معالجة مشكلة"] },
  { terms: ["mobile", "frontend", "ux", "ui"], aliases: ["جوال", "واجهة", "تصميم", "تجربة المستخدم"] },
  { terms: ["jira", "service manager", "workflow"], aliases: ["جيرا", "سيرفس مانجر", "اجراء", "إجراء"] },
];

const requestText = (request: ServiceRequest): string =>
  [
    request.title,
    request.shortDescription,
    request.section,
    request.category,
    request.environment ?? "",
    request.subSection ?? "",
    ...request.keywords,
  ]
    .join(" ")
    .toLowerCase();

export const getArabicSearchAliases = (request: ServiceRequest): string[] => {
  const text = requestText(request);
  return aliasRules.flatMap((rule) =>
    rule.terms.some((term) => text.includes(term)) ? rule.aliases : [],
  );
};
