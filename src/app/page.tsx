"use client";

import { DigiLockerButton } from "@/components/DigiLockerButton";
import { ScoreCard } from "@/components/ScoreCard";
import { InsightsCard } from "@/components/InsightsCard";
import { Roadmap } from "@/components/Roadmap";
import { MisinfoBuster } from "@/components/MisinfoBuster";
import { CalendarReminder } from "@/components/CalendarReminder";
import { ActionHub } from "@/components/ActionHub";
import { ElectionTimeline } from "@/components/ElectionTimeline";
import { ServicesSection } from "@/components/ServicesSection";
import { HelplineSection } from "@/components/HelplineSection";
import { ElectionVideo } from "@/components/ElectionVideo";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageCode } from "@/utils/translations";
import dynamic from "next/dynamic";

import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useState, useEffect } from "react";

// Lazy load heavy components
const Chat = dynamic(() => import("@/components/Chat").then(mod => mod.Chat), { 
  loading: () => <div className="h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
  ssr: false 
});

const MapView = dynamic(() => import("@/components/MapView").then(mod => mod.MapView), { 
  loading: () => <div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
  ssr: false 
});


export default function Dashboard() {
  const { language, setLanguage, t } = useLanguage();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Chunaav
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">
              {(t as any).electionNavigator}
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {(t as any).dashboardTitle}
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {(t as any).dashboardDesc}
          </p>
        </div>

        {isInitialLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <ActionHub />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (Main Journey) */}
              <div className="lg:col-span-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <DigiLockerButton />
                </motion.div>

                <div id="doc-section" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <ScoreCard />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <InsightsCard />
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Roadmap />
                </motion.div>

                <motion.div id="map-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <MapView />
                </motion.div>
                
                <motion.div id="calendar-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <CalendarReminder />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <ElectionTimeline />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                  <ServicesSection />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <ElectionVideo />
                </motion.div>
              </div>

              {/* Right Column (Assistant & Resources) */}
              <div className="lg:col-span-4 space-y-8">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="sticky top-24">
                  <Chat />
                  <div className="mt-8">
                    <MisinfoBuster />
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Helpline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <HelplineSection />
        </motion.div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {(t as any).footerDisclaimer}
        </p>
      </footer>
    </div>
  );
}
