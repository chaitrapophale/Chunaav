"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "../hooks/useUser";
import { useLanguage } from "../context/LanguageContext";
import { getGeminiResponse } from "../utils/gemini";
import { Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export const Chat = () => {
  const { decisionState, profile } = useUser();
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: t.assistantGreeting,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 Trigger ONLY once when DigiLocker connects
  const hasWelcomedRef = useRef(false);

  useEffect(() => {
    if (profile.isConnected && !hasWelcomedRef.current) {
      hasWelcomedRef.current = true;

      const greeting = profile.name && profile.name !== "Voter"
        ? ((t as any).aiGreetingConnected || "Hi {name} 👋").replace("{name}", profile.name.split(" ")[0])
        : ((t as any).aiGreetingManual || "Got it! 👋 Based on your details...");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: `${greeting} ${decisionState.aiContext}`,
        },
      ]);
    }
  }, [profile.isConnected, decisionState.aiContext, profile.name]);

  // Update initial greeting when language changes
  useEffect(() => {
    setMessages((prev) => [
      { id: "init", sender: "bot", text: t.assistantGreeting },
      ...prev.slice(1),
    ]);
  }, [language, t.assistantGreeting]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 🔥 Handle user input PROPERLY
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(
        userText,
        decisionState.aiContext,
        language
      );

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: responseText,
        },
      ]);
    } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: (t as any).errorGeneric || "Hmm, I couldn't process that. Try asking in a different way.",
          },
        ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">
            Chunaav AI
          </h3>
          <p className="text-blue-100 text-xs">
            {(t as any).aiSubtitle}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === "user"
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-blue-100 dark:bg-blue-900/50"
                }`}
            >
              {msg.sender === "user" ? (
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <div
              className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
                }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="p-3 bg-white rounded-2xl flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={(t as any).chatPlaceholder || "Ask about voting, eligibility, documents..."}
            className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
