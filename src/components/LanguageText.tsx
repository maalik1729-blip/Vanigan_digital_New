import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface LanguageTextProps {
  ta: string;
  en: string;
  className?: string;
  as?: React.ElementType;
}

export function LanguageText({ ta, en, className, as = "span" }: LanguageTextProps) {
  const { language, t } = useLanguage();
  const Component = as;
  
  return (
    <Component lang={language === "ta" ? "ta" : "en"} className={className}>
      {t(ta, en)}
    </Component>
  );
}
