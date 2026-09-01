import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/data/portfolio";
import { BackgroundFX } from "@/components/three/BackgroundFX";
import { ResumeModalProvider } from "@/lib/resume-modal-context";
import { ResumeModal } from "@/components/ResumeModal";
import { ThemeAccentProvider } from "@/lib/theme-accent-context";
import { ThemePicker } from "@/components/ThemePicker";
import { ChatbotProvider } from "@/lib/chatbot-context";
import { ChatbotLauncher } from "@/components/chatbot/ChatbotLauncher";
import { ChatbotModal } from "@/components/chatbot/ChatbotModal";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  weight: "variable",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.heroDescription,
  keywords: [
    "Gargi Arya",
    "Software Developer",
    "Full Stack Developer",
    "Agentic AI",
    "ERP Developer",
    "React Developer",
    "Jaipur",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.heroDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-base text-ink font-sans overflow-x-hidden">
        <ThemeAccentProvider>
          <ResumeModalProvider>
            <ChatbotProvider>
              <BackgroundFX />
              {children}
              <ResumeModal />
              <ThemePicker />
              <ChatbotLauncher />
              <ChatbotModal />
            </ChatbotProvider>
          </ResumeModalProvider>
        </ThemeAccentProvider>
      </body>
    </html>
  );
}
