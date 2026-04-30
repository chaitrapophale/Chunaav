"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Search, ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { logger } from "@/utils/logger";

const mockResults: Record<string, { name: string; constituency: string; status: "registered" }> = {
  "ABC1234567": { name: "Ananya Deshmukh", constituency: "Mumbai North", status: "registered" },
  "XYZ9876543": { name: "Vikram Patil", constituency: "Pune Central", status: "registered" },
  "DEF4567890": { name: "Priya Iyer", constituency: "Chennai South", status: "registered" },
};

export default function CheckStatusPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const isHi = language === "hi";

  const [epic, setEpic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { name: string; constituency: string; status: string }>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = useCallback(async () => {
    if (!epic.trim()) return;
    
    logger.event("EPIC_STATUS_CHECK", { epic: epic.trim().toUpperCase() });
    setLoading(true);
    setResult(null);
    setChecked(false);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1500));

    const found = mockResults[epic.trim().toUpperCase()];
    if (found) {
      setResult(found);
    } else {
      // Generate mock result for any input
      setResult({
        name: isHi ? "मतदाता" : "Voter",
        constituency: isHi ? "अज्ञात" : "Unknown",
        status: "not_registered",
      });
    }
    setChecked(true);
    setLoading(false);
  }, [epic, isHi]);

  const handleRegisterNow = useCallback(() => {
    logger.event("REGISTER_NOW_CLICK");
    window.open("https://voters.eci.gov.in/", "_blank");
  }, []);

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={handleBack}
            aria-label="Back to home"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {isHi ? "पंजीकरण स्थिति जांचें" : "Check Registration Status"}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isHi ? "क्या मैं पंजीकृत हूं?" : "Am I Registered?"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {isHi
                ? "अपना EPIC नंबर दर्ज करके अपनी मतदाता पंजीकरण स्थिति जांचें"
                : "Enter your EPIC number to verify your voter registration status"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="epic-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isHi ? "EPIC नंबर" : "EPIC Number"}
              </label>
              <input
                id="epic-input"
                type="text"
                value={epic}
                onChange={(e) => setEpic(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder={isHi ? "उदा. ABC1234567" : "e.g. ABC1234567"}
                aria-label="EPIC Number input"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg tracking-wider font-mono"
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={!epic.trim() || loading}
              aria-label="Check registration status"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isHi ? "जांच हो रही है..." : "Checking..."}
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  {isHi ? "पंजीकरण जांचें" : "Check Registration"}
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {checked && result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 rounded-xl p-6 border ${
                result.status === "registered"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {result.status === "registered" ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <span className={`text-lg font-bold ${
                  result.status === "registered"
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}>
                  {result.status === "registered"
                    ? (isHi ? "पंजीकृत ✅" : "Registered ✅")
                    : (isHi ? "पंजीकृत नहीं ❌" : "Not Registered ❌")}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{isHi ? "नाम" : "Name"}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{result.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{isHi ? "निर्वाचन क्षेत्र" : "Constituency"}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{result.constituency}</span>
                </div>
              </div>
              {result.status !== "registered" && (
                <button
                  onClick={handleRegisterNow}
                  aria-label="Register Now on ECI portal"
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isHi ? "अभी पंजीकरण करें →" : "Register Now →"}
                </button>
              )}
            </motion.div>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
            {isHi
              ? "डेमो मोड: यह एक मॉक लुकअप है। कृपया eci.gov.in पर सत्यापित करें।"
              : "Demo mode: This is a mock lookup. Please verify at eci.gov.in."}
          </p>
        </motion.div>
      </main>
    </div>
  );
}

