import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BreadcrumbItem {
  label: string;
  labelTa: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { language, t } = useLanguage();

  return (
    <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Home className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sr-only">{t("முகப்பு", "Home")}</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
          {item.to ? (
            <Link
              to={item.to}
              className="hover:text-primary transition-colors"
            >
              {language === "ta" ? item.labelTa : item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-medium">
              {language === "ta" ? item.labelTa : item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
