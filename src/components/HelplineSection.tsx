"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Phone, Mail, Shield } from "lucide-react";

export const HelplineSection = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-6 shadow-xl text-white">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-red-200" />
        {isHi ? "ईसीआई हेल्पलाइन" : "ECI Helpline"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="tel:1950"
          className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/25 transition-colors"
        >
          <div className="bg-white/20 p-3 rounded-lg">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-black">1950</p>
            <p className="text-xs text-red-100">
              {isHi ? "टोल-फ्री • अभी कॉल करें" : "Toll-Free • Call Now"}
            </p>
          </div>
        </a>
        <a
          href="mailto:complaints@eci.gov.in"
          className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/25 transition-colors"
        >
          <div className="bg-white/20 p-3 rounded-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">complaints@eci.gov.in</p>
            <p className="text-xs text-red-100">
              {isHi ? "शिकायत ईमेल" : "Complaint Email"}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};
