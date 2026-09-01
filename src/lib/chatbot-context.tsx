"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ChatbotContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [isOpen]
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used within a ChatbotProvider");
  return ctx;
}
