"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Download, BookOpen, ExternalLink, Search, CreditCard } from "lucide-react";

const formsData = [
  { id: "form6", color: "from-blue-500 to-indigo-600", icon: FileText },
  { id: "form7", color: "from-red-500 to-rose-600", icon: FileText },
  { id: "form8", color: "from-amber-500 to-orange-600", icon: FileText },
];

const formLabels: Record<string, { en: string; hi: string; desc_en: string; desc_hi: string }> = {
  form6: { en: "Form 6", hi: "फॉर्म 6", desc_en: "New Voter Registration", desc_hi: "नया मतदाता पंजीकरण" },
  form7: { en: "Form 7", hi: "फॉर्म 7", desc_en: "Deletion of Name", desc_hi: "नाम का विलोपन" },
  form8: { en: "Form 8", hi: "फॉर्म 8", desc_en: "Correction of Entries", desc_hi: "प्रविष्टियों में सुधार" },
};

export const ServicesSection = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-500" />
        {isHi ? "फॉर्म और सेवाएं" : "Forms & Services"}
      </h3>

      {/* Election Forms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {formsData.map((form, i) => {
          const label = formLabels[form.id];
          const Icon = form.icon;
          return (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className={`bg-gradient-to-br ${form.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{isHi ? label.hi : label.en}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{isHi ? label.desc_hi : label.desc_en}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { alert("Redirecting to official Election Commission portal..."); window.open("https://voters.eci.gov.in/", "_blank"); }}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  <ExternalLink className="h-3 w-3" />
                  {isHi ? "फॉर्म भरें" : "Fill Form"}
                </button>
                <button onClick={() => { alert("Redirecting to official Election Commission portal..."); window.open("https://voters.eci.gov.in/", "_blank"); }}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Download className="h-3 w-3" />
                  {isHi ? "डाउनलोड" : "Download"}
                </button>
                <button onClick={() => { alert("Redirecting to official Election Commission portal..."); window.open("https://voters.eci.gov.in/", "_blank"); }}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <BookOpen className="h-3 w-3" />
                  {isHi ? "दिशानिर्देश" : "Guidelines"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Document Services */}
      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-purple-500" />
        {isHi ? "दस्तावेज़ सेवाएं" : "Document Services"}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { en: "Download Electoral Roll", hi: "मतदाता सूची डाउनलोड करें", icon: Download, url: "https://electoralsearch.eci.gov.in/" },
          { en: "Download e-EPIC", hi: "e-EPIC डाउनलोड करें", icon: CreditCard, url: "https://voters.eci.gov.in/" },
          { en: "Track Application", hi: "आवेदन ट्रैक करें", icon: Search, url: "https://voters.eci.gov.in/" },
        ].map((svc, i) => {
          const Icon = svc.icon;
          return (
            <button key={i} onClick={() => { alert("Redirecting to official Election Commission portal..."); window.open(svc.url, "_blank"); }}
              className="w-full flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-left">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{isHi ? svc.hi : svc.en}</span>
              <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
