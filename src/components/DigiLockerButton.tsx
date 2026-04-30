"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../hooks/useUser";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { logger } from "../utils/logger";

export const DigiLockerButton = () => {
  const { profile, disconnectDigiLocker } = useUser();
  const { t } = useLanguage();
  const router = useRouter();

  const handleConnect = () => {
    logger.event("DIGILOCKER_CONNECT_CLICK");
    router.push("/connect-digilocker");
  };

  const handleDisconnect = () => {
    logger.event("DIGILOCKER_DISCONNECT_CLICK");
    disconnectDigiLocker();
  };

  if (profile.isConnected) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-500 h-6 w-6" />
          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">{t.digilockerConnected}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.verifiedAs} {profile.name}</p>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          aria-label="Disconnect DigiLocker"
          className="text-xs text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          {t.disconnect}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md">
      <div className="text-center space-y-4">
        <ShieldCheck className="mx-auto h-10 w-10 text-blue-500" />
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{t.connectDigiLocker}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.connectLockerDesc}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
          aria-label="Connect with DigiLocker"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          {t.connectSimulated}
        </motion.button>
        <button
          onClick={() => {
            logger.event("MANUAL_SETUP_CLICK");
            router.push("/manual-setup");
          }}
          aria-label="Continue with manual setup"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2 block w-full transition-colors"
        >
          {t.continueWithout}
        </button>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-4">
          {t.demoWarning}
        </p>
      </div>
    </div>
  );
};

