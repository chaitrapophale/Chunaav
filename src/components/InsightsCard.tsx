"use client";

import { useUser } from "../hooks/useUser";
import { useLanguage } from "../context/LanguageContext";
import {
  Lightbulb,
  Clock,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export const InsightsCard = () => {
  const { profile, decisionState } = useUser();
  const { t } = useLanguage();



  // ── Under 18: Not Eligible state ──
  if (decisionState.status === "not_eligible") {
    return (
      <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-6 shadow-xl text-white">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-200" />
          {(t as any).notEligible}
        </h3>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20"
          >
            <p className="font-medium text-sm">
              {(t as any).underageMsg}
            </p>
            <p className="text-xs text-red-100 mt-2">
              {(t as any).underageSubMsg}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const stepsAway = 5 - decisionState.roadmapStep;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-xl text-white">
      <h3 className="font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-300" />
        {(t as any).yourInsights}
      </h3>

      <div className="space-y-4">
        {/* ── Voter ID Missing: Actionable Guidance ── */}
        {(decisionState.urgentAction === "applyVoterId") && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/15 rounded-lg p-4 backdrop-blur-sm border border-white/20 space-y-3"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wide">
                  {(t as any)[decisionState.urgentAction] || decisionState.urgentAction}
                </p>
                <p className="text-xs text-indigo-100">Action Required</p>
              </div>
            </div>

            <p className="text-white mb-6 font-medium leading-relaxed">
              {(t as any)[decisionState.nextBestAction || ""] || decisionState.nextBestAction}
            </p>

            {/* Step-by-step list */}
            <ol className="space-y-2 ml-1">
              {t.voterIdSteps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (i + 1) }}
                  className="flex items-start gap-2.5 text-xs"
                >
                  <span className="bg-white/20 text-white font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="text-indigo-50 leading-relaxed">{step}</span>
                </motion.li>
              ))}
            </ol>

            {/* Apply Now button */}
            <button
              onClick={() => { alert("Redirecting to official Election Commission portal..."); window.open("https://voters.eci.gov.in/", "_blank"); }}
              className="mt-3 inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {(t as any).applyVoterIdAction}
            </button>
          </motion.div>
        )}

        {/* Steps away indicator */}
        {stepsAway > 0 ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20 flex items-start gap-3"
          >
            <TrendingUp className="h-5 w-5 mt-0.5 text-indigo-200" />
            <div>
              <p className="font-medium text-sm">You&apos;re {stepsAway} steps away from voting</p>
              <p className="text-xs text-indigo-100 mt-1">Keep going! You&apos;re making great progress.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-500/20 rounded-lg p-3 backdrop-blur-sm border border-green-400/30 flex items-start gap-3"
          >
            <TrendingUp className="h-5 w-5 mt-0.5 text-green-300" />
            <div>
              <p className="font-medium text-sm">You&apos;re all set to vote!</p>
              <p className="text-xs text-green-100 mt-1">Make sure you know where your polling booth is.</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20 flex items-start gap-3"
        >
          <Clock className="h-5 w-5 mt-0.5 text-orange-200" />
          <div>
            <p className="font-medium text-sm">Registration deadline approaching</p>
            <p className="text-xs text-indigo-100 mt-1">Make sure to submit any missing documents soon.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
