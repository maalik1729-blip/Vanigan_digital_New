import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ta" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ta: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_lang");
      return (saved === "en" || saved === "ta") ? saved : "ta"; // Default to Tamil
    }
    return "ta";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (ta: string, en: string) => {
    return language === "ta" ? ta : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
