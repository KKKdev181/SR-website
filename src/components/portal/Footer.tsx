import { Mail } from "lucide-react";

const arabicFont = {
  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-8 text-center sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Need help choosing the right request? Contact{" "}
            <a href="mailto:td@elm.sa" className="font-medium text-primary hover:underline">
              td@elm.sa
            </a>
          </p>
        </div>
        <p dir="rtl" lang="ar" className="text-xs text-muted-foreground/70" style={arabicFont}>
          تحتاج مساعدة في اختيار الطلب المناسب؟ تواصل مع{" "}
          <a href="mailto:td@elm.sa" className="font-medium text-primary hover:underline">
            td@elm.sa
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
