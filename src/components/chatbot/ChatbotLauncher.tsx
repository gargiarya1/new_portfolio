"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useChatbot } from "@/lib/chatbot-context";

export function ChatbotLauncher() {
  const { isOpen, toggle } = useChatbot();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          type="button"
          onClick={toggle}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open portfolio assistant"
          className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full text-black shadow-[0_18px_45px_-12px_rgba(124,108,240,0.65)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <span className="absolute inset-0 animate-glow rounded-full blur-md opacity-60" style={{ background: "var(--gradient-primary)" }} />
          <MessageCircle size={22} className="relative" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-cyan" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-cyan ring-2 ring-[var(--color-base)]" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
