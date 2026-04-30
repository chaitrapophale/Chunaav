"use client";

import { useLanguage } from "@/context/LanguageContext";
import { PlayCircle } from "lucide-react";

export const ElectionVideo = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <PlayCircle className="h-6 w-6 text-red-600" />
        {t.electionGuideVideo || "Election Awareness Guide"}
      </h3>
      
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/Z0oYJ9B_36c" 
          title="ECI Awareness Video"
          aria-label="Election Awareness Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="border-none"
        ></iframe>
      </div>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center italic">
        {t.videoCourtesy || "Official Awareness Video by Election Commission of India"}
      </p>
    </div>
  );
};

