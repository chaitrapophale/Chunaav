import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageGuard } from "@/components/LanguageGuard";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chunaav | AI Election Navigator",
  description: "Your personalized AI assistant to help you prepare for the upcoming elections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-900 min-h-screen`}>
        <LanguageProvider>
          <LanguageGuard>
            <UserProvider>
              {children}
            </UserProvider>
          </LanguageGuard>
        </LanguageProvider>
        <GoogleAnalytics gaId="G-CHUNAAV2026" />
      </body>
    </html>
  );
}
