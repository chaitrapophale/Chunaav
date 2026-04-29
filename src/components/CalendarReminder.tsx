"use client";

import { Calendar } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../hooks/useUser";

export const CalendarReminder = () => {
  const { t } = useLanguage();
  const { decisionState } = useUser();
  const handleAddReminder = () => {
    // Generate a Google Calendar event URL for election day (mock date: 2 weeks from now)
    const date = new Date();
    date.setDate(date.getDate() + 14);
    
    const startStr = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    date.setHours(date.getHours() + 1);
    const endStr = date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const isReady = decisionState.readinessScore >= 80;
    const title = isReady ? t.voteInElection : t.completeRegistration;
    const description = isReady ? t.electionReminderDescReady : t.electionReminderDescNotReady;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(description)}&location=Your+Local+Polling+Booth`;
    
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleAddReminder}
      className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm"
    >
      <Calendar className="h-5 w-5" />
      {t.calendarReminder}
    </button>
  );
};
