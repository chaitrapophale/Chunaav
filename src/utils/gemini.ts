import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockAiResponses } from "./mockData";
import { translations, LanguageCode } from "./translations";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
console.log("Gemini API Key:", apiKey ? "Present" : "Missing");

// Only initialize the API client if a key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const fallbackDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Language name mapping for system prompt
const languageNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  gu: "Gujarati",
  ml: "Malayalam",
  pa: "Punjabi",
};

const generateSmartFallback = (prompt: string, language: string, contextMessage: string) => {
  const msg = prompt.toLowerCase();
  const prefix = language !== "en" ? `[${languageNames[language] || language}] ` : "";

  if (msg.includes("registered") || msg.includes("status") || msg.includes("पंजीकृत") || msg.includes("स्थिति")) {
    return prefix + "You can check your voter registration status using the 'Check Status' feature on the dashboard, or visit /check-status. Enter your EPIC number to verify instantly.";
  }
  if (msg.includes("register") || msg.includes("form 6") || msg.includes("how to") || msg.includes("how do i vote")) {
    return prefix + "To vote, you need to register first: 1) Visit https://voters.eci.gov.in/ 2) Fill Form 6 (New Voter Registration) 3) Upload Aadhaar, address proof, and passport photo 4) Submit and note your reference number. Once registered, you will get an EPIC (Voter ID) to vote at your local booth.";
  }
  if (msg.includes("what is voter id") || msg.includes("epic")) {
    return prefix + "A Voter ID (also known as EPIC - Electors Photo Identity Card) is an official document issued by the Election Commission of India. It allows you to cast your vote and serves as a valid identity and address proof.";
  }
  if (msg.includes("aadhaar")) {
    return prefix + "Aadhaar is NOT mandatory for voting. You can use your Voter ID (EPIC), Passport, Driving License, or PAN Card as identity proof at the booth.";
  }
  if (msg.includes("booth") || msg.includes("where")) {
    return prefix + "Check the Map section below for your nearest polling booth. Click 'Get Directions' to open Google Maps navigation.";
  }
  if (msg.includes("age") || msg.includes("eligib") || msg.includes("18") || msg.includes("am i eligible")) {
    return prefix + "You must be an Indian citizen and 18+ years old on the qualifying date to vote. If you're under 18, you cannot vote yet, but you can pre-register once you turn 17 by filling Form 6 on the NVSP portal.";
  }

  return prefix + "That's a great question about the election process. For specific details on this, I recommend checking the official ECI website or asking about voter registration, ID cards, or eligibility, and I'll guide you step-by-step!";
};

export const getGeminiResponse = async (
  prompt: string,
  contextMessage: string,
  language: string
): Promise<string> => {
  const langCode = (language as LanguageCode) || "en";
  const t = (translations[langCode] || translations.en) as typeof translations.en;
  
  const voterIdResponse = `${(t as any).voterIdStepsHeader}:\n\n${t.voterIdSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${(t as any).voterIdFooter}`;

  // Localized AI fallbacks
  const localizedMockResponses = {
    missingVoterId: (t as any).missingVoterId || mockAiResponses.missingVoterId,
    underage: (t as any).underage || mockAiResponses.underage,
    ready: (t as any).ready || mockAiResponses.ready,
    fallback: (t as any).fallbackAi || mockAiResponses.fallback
  };

  // ── Demo Mode (no API key) ──
  if (!apiKey || !genAI) {
    await fallbackDelay(800);
    return generateSmartFallback(prompt, language, contextMessage);
  }

  // ── Real Gemini API ──
  try {
    const langName = languageNames[language] || "English";
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are a smart election assistant for Indian voters.

You must:
- Answer ANY question about voting, elections, ID cards
- Be clear, helpful, and simple
- Stay neutral (no political bias)
- Guide users step-by-step
- Use context if available, but DO NOT depend on it
- Respond ONLY in ${langName} (${language})

USER CONTEXT: ${contextMessage || "No context provided"}

USER QUESTION: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful fallback to demo mode on error
    return generateSmartFallback(prompt, language, contextMessage);
  }
};
