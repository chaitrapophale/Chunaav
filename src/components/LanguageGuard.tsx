"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageCode } from "@/utils/translations";
import { logger } from "@/utils/logger";


const languages: { code: LanguageCode; name: string; local: string }[] = [
  { code: "en", name: "English", local: "English" },
  { code: "hi", name: "Hindi", local: "हिंदी" },
  { code: "mr", name: "Marathi", local: "मराठी" },
  { code: "bn", name: "Bengali", local: "বাংলা" },
  { code: "ta", name: "Tamil", local: "தமிழ்" },
  { code: "te", name: "Telugu", local: "తెలుగు" },
  { code: "kn", name: "Kannada", local: "ಕನ್ನಡ" },
  { code: "gu", name: "Gujarati", local: "ગુજરાતી" },
  { code: "ml", name: "Malayalam", local: "മലയാളം" },
  { code: "pa", name: "Punjabi", local: "ਪੰਜਾਬੀ" },
];

export const LanguageGuard = ({ children }: { children: React.ReactNode }) => {
  const { hasSelectedLanguage, setLanguage } = useLanguage();

  if (hasSelectedLanguage) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-10">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Choose your language
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select a language to get started with Chunaav
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                logger.event("LANGUAGE_SELECTED", { lang: lang.code });
                setLanguage(lang.code);
              }}
              aria-label={`Select ${lang.name}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 hover:bg-blue-50 dark:bg-gray-800/50 dark:hover:bg-blue-900/20 transition-all group"
            >

              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                {lang.local}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {lang.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
