"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, LanguageCode } from "../utils/translations";

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof translations.en;
  hasSelectedLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Helper to deep merge translations so missing keys fallback to English
const mergeTranslations = (base: any, target: any): any => {
  if (typeof base !== "object" || base === null) return target ?? base;
  if (typeof target !== "object" || target === null) return base;
  
  const merged = { ...base };
  for (const key in target) {
    if (typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])) {
      merged[key] = mergeTranslations(base[key], target[key]);
    } else {
      merged[key] = target[key];
    }
  }
  return merged;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [mounted, setMounted] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("chunaav-lang") as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
      setHasSelectedLanguage(true);
    } else {
      // Default to English initially
      setLanguageState("en");
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setHasSelectedLanguage(true);
    localStorage.setItem("chunaav-lang", lang);
  };

  // Provide fallback to english using deep merge
  const t = mergeTranslations(translations.en, translations[language]) as typeof translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, hasSelectedLanguage }}>
      <div style={{ visibility: mounted ? "visible" : "hidden", minHeight: "100vh" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
