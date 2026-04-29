"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Loader2, Smartphone, KeyRound, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "mobile" | "otp" | "verifying" | "consent" | "fetching";

// Random Indian names for dynamic user simulation
const mockNames = [
  "Ananya Deshmukh",
  "Vikram Patil",
  "Priya Iyer",
  "Arjun Mehta",
  "Sneha Kulkarni",
  "Rohan Joshi",
  "Kavitha Nair",
  "Amit Verma",
];

const mockLocations = [
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
];

export default function ConnectDigiLockerPage() {
  const router = useRouter();
  const { connectDigiLocker } = useUser();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (mobile.length >= 10) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length >= 4) {
      setStep("verifying");
    }
  };

  // Auto-advance from "verifying" to "consent" after 1s
  useEffect(() => {
    if (step === "verifying") {
      const timer = setTimeout(() => setStep("consent"), 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Auto-advance from "fetching" to redirect after 1.5s
  useEffect(() => {
    if (step === "fetching") {
      const timer = setTimeout(() => {
        connectDigiLocker();
        router.push("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, connectDigiLocker, router]);

  const handleConsent = () => {
    setStep("fetching");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full"
      >
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">DigiLocker</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Secure Document Access</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1 mb-8">
          {["mobile", "otp", "verifying", "consent", "fetching"].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ["mobile", "otp", "verifying", "consent", "fetching"].indexOf(step) >= i
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Mobile Input */}
          {step === "mobile" && (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Smartphone className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enter Mobile Number</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  We&apos;ll send an OTP to verify your identity
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2.5 rounded-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={mobile.length < 10}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Send OTP
              </button>
            </motion.div>
          )}

          {/* STEP 2: OTP Input */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <KeyRound className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enter OTP</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  OTP sent to +91 {mobile.slice(0, 2)}****{mobile.slice(-2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  One-Time Password
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter OTP (any value)"
                  className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2.5 text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length < 4}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Verify
              </button>
              <button
                onClick={() => setStep("mobile")}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Change Number
              </button>
            </motion.div>
          )}

          {/* STEP 3: Verifying Loader */}
          {step === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 space-y-4"
            >
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Verifying your credentials…
              </p>
            </motion.div>
          )}

          {/* STEP 4: Consent Screen */}
          {step === "consent" && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <FileCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Grant Access</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Chunaav wants access to your DigiLocker documents
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">The app will access:</p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Aadhaar Card
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Voter ID (EPIC)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Driving License
                  </li>
                </ul>
              </div>

              <button
                onClick={handleConsent}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Allow &amp; Continue
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Deny &amp; Go Back
              </button>
            </motion.div>
          )}

          {/* STEP 5: Fetching Loader */}
          {step === "fetching" && (
            <motion.div
              key="fetching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 space-y-4"
            >
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Fetching your documents…
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Securely retrieving from DigiLocker
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-[10px] text-gray-400 text-center mt-8 uppercase tracking-wider">
          {t.demoWarning}
        </p>
      </motion.div>
    </div>
  );
}
