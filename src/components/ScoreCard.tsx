"use client";
import React, { memo } from "react";
import { useUser } from "../hooks/useUser";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle, ShieldX } from "lucide-react";

export const ScoreCard = memo(() => {
  const { decisionState, documents, updateDocuments } = useUser();
  const { t } = useLanguage();

  const toggleDocument = (doc: keyof typeof documents) => {
    updateDocuments({ [doc]: !documents[doc] });
  };

  const isNotEligible = decisionState.status === "not_eligible";

  const getScoreColor = (score: number) => {
    if (isNotEligible) return "text-red-500";
    if (score < 40) return "text-red-500";
    if (score < 80) return "text-yellow-500";
    return "text-green-500";
  };

  const docList = [
    { key: "aadhaar", label: (t as any).aadhaarLabel },
    { key: "voterId", label: (t as any).voterIdLabel },
    { key: "drivingLicense", label: "Driving License" },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        {t.voterReadyScore}
      </h3>

      <div className="flex flex-col items-center justify-center mb-8">
        <div 
          className="relative h-32 w-32 flex items-center justify-center"
          role="progressbar"
          aria-valuenow={decisionState.readinessScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.voterReadyScore}
        >
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="12"
            />
            <motion.circle
              initial={{ strokeDasharray: "0 1000" }}
              animate={{ strokeDasharray: `${(decisionState.readinessScore / 100) * 351} 1000` }}
              transition={{ duration: 1, ease: "easeOut" }}
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              className={`${getScoreColor(decisionState.readinessScore)} drop-shadow-md`}
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            {isNotEligible ? (
              <div className="flex flex-col items-center">
                <ShieldX className="h-6 w-6 text-red-500 mb-1" />
                <span className="text-xs font-bold text-red-500 uppercase">{(t as any).notEligible}</span>
              </div>
            ) : (
              <span className="text-3xl font-black text-gray-800 dark:text-white">
                {decisionState.readinessScore}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Document Checklist — hidden for under-18 */}
      {!isNotEligible && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.docChecklist}</h4>
          <div className="space-y-2">
            {docList.map(({ key, label }) => {
              const hasDoc = documents[key as keyof typeof documents];
              return (
                <div
                  key={key}
                  onClick={() => toggleDocument(key)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleDocument(key)}
                  role="checkbox"
                  aria-checked={hasDoc}
                  tabIndex={0}
                  aria-label={`Toggle ${label}`}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                    hasDoc
                      ? "bg-green-50/50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className={`text-sm ${hasDoc ? "text-green-800 dark:text-green-300 font-medium" : "text-gray-600 dark:text-gray-400"}`}>
                    {label}
                  </span>
                  {hasDoc ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isNotEligible && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 text-center" role="alert">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            {(t as any).underageMsg}
          </p>
          <p className="text-xs text-red-500 dark:text-red-400/70 mt-1">
            {(t as any).underageSubMsg}
          </p>
        </div>
      )}
    </div>
  );
});

ScoreCard.displayName = "ScoreCard";
