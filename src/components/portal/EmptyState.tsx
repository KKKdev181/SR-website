import { SearchX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyState = () => {
  const { copy } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-foreground">{copy.empty.title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{copy.empty.description}</p>
    </div>
  );
};

export default EmptyState;
