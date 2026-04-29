"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MisinfoBuster = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-orange-500" />
        {(t as any).misinfoBuster}
      </h3>

      <div className="space-y-3">
        {((t as any).misinfoQA || []).map((qa: any, index: number) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
            >
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {qa.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white dark:bg-gray-800"
                >
                  <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                    {qa.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
