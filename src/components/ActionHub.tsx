"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  UserPlus,
  Search,
  MapPin,
  FileText,
  Bell,
  Phone,
  X,
  Mail
} from "lucide-react";

export const ActionHub = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [showHelpline, setShowHelpline] = useState(false);

  // Deep merge fallback for missing keys in other languages
  const defaultHub = t.actionHub || {};
  const tHub = {
    title: defaultHub.title || "What would you like to do?",
    startRegistration: defaultHub.startRegistration || "Start Registration",
    startRegistrationDesc: defaultHub.startRegistrationDesc || "Apply for your voter ID",
    checkStatus: defaultHub.checkStatus || "Check My Status",
    checkStatusDesc: defaultHub.checkStatusDesc || "See if you are registered",
    locateBooth: defaultHub.locateBooth || "Locate My Booth",
    locateBoothDesc: defaultHub.locateBoothDesc || "Find your nearest polling station",
    documents: defaultHub.documents || "My Documents",
    documentsDesc: defaultHub.documentsDesc || "Check required documents",
    reminders: defaultHub.reminders || "My Reminders",
    remindersDesc: defaultHub.remindersDesc || "View election alerts",
    help: defaultHub.help || "Get Help",
    helpDesc: defaultHub.helpDesc || "Call support or get assistance"
  };

  const actions = [
    {
      key: "startRegistration",
      icon: UserPlus,
      color: "text-white",
      bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
      border: "border-emerald-100 dark:border-emerald-800",
      shadow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]",
      title: tHub.startRegistration,
      desc: tHub.startRegistrationDesc,
      action: () => window.open("https://voters.eci.gov.in/", "_blank"),
      span: "sm:col-span-2 lg:col-span-2",
    },
    {
      key: "checkStatus",
      icon: Search,
      color: "text-white",
      bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
      border: "border-blue-100 dark:border-blue-800",
      shadow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      title: tHub.checkStatus,
      desc: tHub.checkStatusDesc,
      action: () => router.push("/check-status"),
      span: "sm:col-span-1 lg:col-span-1",
    },
    {
      key: "locateBooth",
      icon: MapPin,
      color: "text-white",
      bg: "bg-gradient-to-r from-orange-400 to-red-500",
      border: "border-orange-100 dark:border-orange-800",
      shadow: "group-hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]",
      title: tHub.locateBooth,
      desc: tHub.locateBoothDesc,
      action: () =>
        document
          .getElementById("map-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      span: "sm:col-span-1 lg:col-span-1",
    },
    {
      key: "documents",
      icon: FileText,
      color: "text-white",
      bg: "bg-gradient-to-r from-purple-500 to-pink-600",
      border: "border-purple-100 dark:border-purple-800",
      shadow: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
      title: tHub.documents,
      desc: tHub.documentsDesc,
      action: () =>
        document
          .getElementById("doc-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      span: "sm:col-span-2 lg:col-span-1",
    },
    {
      key: "reminders",
      icon: Bell,
      color: "text-white",
      bg: "bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500",
      border: "border-pink-100 dark:border-pink-800",
      shadow: "group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]",
      title: tHub.reminders,
      desc: tHub.remindersDesc,
      action: () =>
        document
          .getElementById("calendar-section")
          ?.scrollIntoView({ behavior: "smooth" }),
      span: "sm:col-span-1 lg:col-span-2",
    },
    {
      key: "help",
      icon: Phone,
      color: "text-white",
      bg: "bg-gradient-to-r from-red-500 to-rose-600",
      border: "border-red-100 dark:border-red-800",
      shadow: "group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
      title: tHub.help,
      desc: tHub.helpDesc,
      action: () => setShowHelpline(true),
      span: "sm:col-span-1 lg:col-span-1",
    },
  ];

  return (
    <div className="mb-10">
      <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
        {tHub.title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              onClick={item.action}
              className={`group flex items-center text-left gap-4 p-5 h-full rounded-3xl border transition-all duration-300 ease-out shadow-sm hover:shadow-xl hover:scale-[1.03] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 ${item.border} hover:border-transparent`}
            >
              <div className={`p-3.5 rounded-2xl ${item.bg} transition-all duration-300 group-hover:scale-110 ${item.shadow}`}>
                <Icon className={`h-6 w-6 ${item.color}`} strokeWidth={2.5} />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 dark:group-hover:from-indigo-400 dark:group-hover:to-purple-400 transition-all">
                  {item.title}
                </h4>
                <p className="text-xs font-light text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Helpline Modal */}
      <AnimatePresence>
        {showHelpline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelpline(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tHub.help}
                </h3>
                <button
                  onClick={() => setShowHelpline(false)}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <a
                  href="tel:1950"
                  className="group flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800 transition-all"
                >
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      1950
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toll-Free Number
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:complaints@eci.gov.in"
                  className="group flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                >
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      complaints@eci.gov.in
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

