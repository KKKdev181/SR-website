import { SearchX } from "lucide-react";

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
      <SearchX className="h-8 w-8 text-muted-foreground/50" />
    </div>
    <h3 className="mb-1.5 text-base font-semibold text-foreground">No exact match found</h3>
    <p
      dir="rtl"
      lang="ar"
      className="mb-2 text-sm text-muted-foreground/70"
      style={arabicFont}
    >
      لم يتم العثور على نتيجة مطابقة
    </p>
    <p className="max-w-md text-sm text-muted-foreground">
      Try a different keyword, remove a filter, or browse the service sections below.
    </p>
    <p
      dir="rtl"
      lang="ar"
      className="mt-1 max-w-md text-xs text-muted-foreground/70"
      style={arabicFont}
    >
      جرّب كلمة مفتاحية مختلفة، أو احذف أحد الفلاتر، أو تصفح أقسام الخدمات أدناه.
    </p>
  </div>
);

export default EmptyState;
