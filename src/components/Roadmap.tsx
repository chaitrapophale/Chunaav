"use client";

import { useUser } from "../hooks/useUser";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "../context/LanguageContext";

export const Roadmap = () => {
  const { decisionState, documents } = useUser();
  const { t } = useLanguage();
  const [expandedStep, setExpandedStep] = useState<number | null>(decisionState.roadmapStep);

  const steps = [
    { id: 1, title: t.roadmap.checkEligibility.title, description: t.roadmap.checkEligibility.desc },
    { id: 2, title: t.roadmap.applyVoterId.title, description: t.roadmap.applyVoterId.desc },
    { id: 3, title: t.roadmap.verifyDetails.title, description: t.roadmap.verifyDetails.desc },
    { id: 4, title: t.roadmap.findPollingBooth.title, description: t.roadmap.findPollingBooth.desc },
    { id: 5, title: t.roadmap.vote.title, description: t.roadmap.vote.desc },
  ];

  // Under 18: show blocked roadmap
  const isNotEligible = decisionState.status === "not_eligible";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6">{t.yourVotingJourney}</h3>

      {isNotEligible && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 mb-6 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            {(t as any).underageRoadmap}
          </p>
        </div>
      )}
      
      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6">
        {steps.map((step) => {
          const isCompleted = !isNotEligible && step.id < decisionState.roadmapStep;
          const isCurrent = !isNotEligible && step.id === decisionState.roadmapStep;
          const isExpanded = expandedStep === step.id || (isCurrent && expandedStep === null);
          const isBlocked = isNotEligible;

          // Mark "Apply for Voter ID" as pending when voterId is missing
          const isPendingVoterId = step.id === 2 && !documents.voterId && !isNotEligible && decisionState.roadmapStep <= 2;

          return (
            <div key={step.id} className={`relative pl-6 ${isBlocked ? "opacity-50" : ""}`}>
              {/* Timeline dot */}
              <div
                className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white dark:bg-gray-800 ${
                  isCompleted
                    ? "border-green-500 bg-green-500"
                    : isCurrent
                    ? "border-blue-500 animate-pulse"
                    : isPendingVoterId
                    ? "border-orange-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500 absolute -top-0.5 -left-0.5 bg-white dark:bg-gray-800 rounded-full" />}
              </div>

              <div
                className={`cursor-pointer rounded-lg p-3 transition-all ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30"
                    : isPendingVoterId
                    ? "bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => !isBlocked && setExpandedStep(isExpanded ? null : step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-medium ${
                        isCompleted
                          ? "text-gray-500 line-through"
                          : isCurrent
                          ? "text-blue-700 dark:text-blue-400 font-bold"
                          : isPendingVoterId
                          ? "text-orange-700 dark:text-orange-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isPendingVoterId && (
                      <span className="text-[10px] bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-semibold uppercase">
                        {(t as any).pendingStatus}
                      </span>
                    )}
                  </div>
                  {!isBlocked && (
                    isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && !isBlocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {step.description}
                      </p>
                      {isCurrent && (
                        <button className="mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors">
                          {(t as any).takeAction}
                        </button>
                      )}
                      {isPendingVoterId && !isCurrent && (
                        <button
                          onClick={() => { alert("Redirecting to official Election Commission portal..."); window.open("https://voters.eci.gov.in/", "_blank"); }}
                          className="mt-3 inline-block text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md transition-colors"
                        >
                          {(t as any).applyOnNvsp}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
