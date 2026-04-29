"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TimelineItem {
  status: "completed" | "current" | "upcoming";
}

const getTimelineData = (isHi: boolean): (TimelineItem & { title: string; desc: string; date: string })[] => [
  {
    title: isHi ? "मतदाता पंजीकरण" : "Voter Registration",
    desc: isHi ? "मतदाता सूची में पंजीकरण करें" : "Register on the electoral roll",
    date: isHi ? "1 जनवरी - 31 मार्च 2026" : "Jan 1 – Mar 31, 2026",
    status: "completed",
  },
  {
    title: isHi ? "उम्मीदवार नामांकन" : "Candidate Nominations",
    desc: isHi ? "उम्मीदवार अपना नामांकन दाखिल करें" : "Candidates file their nominations",
    date: isHi ? "15 अप्रैल - 30 अप्रैल 2026" : "Apr 15 – Apr 30, 2026",
    status: "current",
  },
  {
    title: isHi ? "मतदान दिवस" : "Voting Day",
    desc: isHi ? "मतदान केंद्र पर अपना वोट डालें" : "Cast your vote at the polling booth",
    date: isHi ? "15 मई 2026" : "May 15, 2026",
    status: "upcoming",
  },
  {
    title: isHi ? "परिणाम घोषणा" : "Result Declaration",
    desc: isHi ? "चुनाव परिणाम घोषित" : "Election results announced",
    date: isHi ? "20 मई 2026" : "May 20, 2026",
    status: "upcoming",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-500",
    label: "Completed",
    labelHi: "पूर्ण",
    line: "bg-green-500",
  },
  current: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-500",
    label: "Current",
    labelHi: "वर्तमान",
    line: "bg-blue-500",
  },
  upcoming: {
    icon: Circle,
    color: "text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-700",
    border: "border-gray-300 dark:border-gray-600",
    label: "Upcoming",
    labelHi: "आगामी",
    line: "bg-gray-300 dark:bg-gray-600",
  },
};

export const ElectionTimeline = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const items = getTimelineData(isHi);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        {isHi ? "चुनाव समयरेखा" : "Election Timeline"}
      </h3>
      <div className="relative">
        {items.map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 pb-6 last:pb-0"
            >
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div className={`${config.bg} border-2 ${config.border} rounded-full p-1.5 z-10`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                {i < items.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1 ${config.line}`} />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    item.status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : item.status === "current"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}>
                    {isHi ? config.labelHi : config.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
