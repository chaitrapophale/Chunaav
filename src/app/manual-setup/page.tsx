"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  UserCircle,
  MapPin,
  CreditCard,
  Vote,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const indianLocations = [
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Bhopal, Madhya Pradesh",
  "Chandigarh, Punjab",
];

export default function ManualSetupPage() {
  const router = useRouter();
  const { manualSetup } = useUser();
  const { t } = useLanguage();

  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [hasAadhaar, setHasAadhaar] = useState(false);
  const [hasVoterId, setHasVoterId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ age?: string; location?: string }>({});

  const validate = () => {
    const newErrors: { age?: string; location?: string } = {};
    const ageNum = parseInt(age);

    if (!age || isNaN(ageNum)) {
      newErrors.age = (t as any).errorAge || "Please enter a valid age";
    } else if (ageNum < 1 || ageNum > 120) {
      newErrors.age = (t as any).errorAge || "Please enter a realistic age";
    }

    if (!location.trim()) {
      newErrors.location = (t as any).errorLocation || "Please select or enter your location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    manualSetup({
      age: parseInt(age),
      location: location.trim(),
      hasAadhaar,
      hasVoterId,
    });

    // Redirect to dashboard
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 max-w-lg w-full"
      >
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {(t as any).backToDashboard}
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-2xl w-fit mx-auto mb-4">
            <UserCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {(t as any).manualSetupTitle}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
            {(t as any).manualSetupDesc}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UserCircle className="h-4 w-4 text-blue-500" />
              {(t as any).ageLabel}
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
              }}
              placeholder="e.g. 19"
              className={`w-full bg-gray-50 dark:bg-gray-700/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors ${
                errors.age
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
            />
            {errors.age && (
              <p className="text-xs text-red-500 mt-1.5">{errors.age}</p>
            )}
          </div>

          {/* Location Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              {(t as any).locationLabel}
            </label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location)
                  setErrors((prev) => ({ ...prev, location: undefined }));
              }}
              className={`w-full bg-gray-50 dark:bg-gray-700/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors appearance-none ${
                errors.location
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
            >
              <option value="">{(t as any).selectCity}</option>
              {indianLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-xs text-red-500 mt-1.5">{errors.location}</p>
            )}
          </div>

          {/* Document Toggles */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {(t as any).docStatusLabel}
            </p>

            {/* Aadhaar Toggle */}
            <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {(t as any).aadhaarLabel}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(t as any).aadhaarDesc}
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hasAadhaar}
                  onChange={(e) => setHasAadhaar(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    hasAadhaar
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                      hasAadhaar ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </label>

            {/* Voter ID Toggle */}
            <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Vote className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {(t as any).voterIdLabel}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(t as any).voterIdDesc}
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hasVoterId}
                  onChange={(e) => setHasVoterId(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    hasVoterId
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                      hasVoterId ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {(t as any).settingUpProfile}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                {(t as any).continueDashboard}
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-wider">
          {t.demoWarning}
        </p>
      </motion.div>
    </div>
  );
}
