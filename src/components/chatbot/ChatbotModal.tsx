"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Loader2, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { profile } from "@/data/portfolio";
import { useChatbot } from "@/lib/chatbot-context";
import { useResumeModal } from "@/lib/resume-modal-context";
import { getResponse, matchIntent, mainMenu, type QuickReply } from "@/lib/chatbot-knowledge";

type Message = {
  id: string;
  from: "bot" | "user";
  text?: string;
  quickReplies?: QuickReply[];
  isForm?: boolean;
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Renders `**bold**` spans and line breaks from the plain-text knowledge base. */
function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return (
          <span key={i} className="block">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold text-ink">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </span>
        );
      })}
    </>
  );
}

function InlineMessageForm({ onDone }: { onDone: (status: "sent" | "cancelled") => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      onDone("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass mt-2 flex flex-col gap-2 rounded-2xl p-3.5">
      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lavender-deep"
      />
      <input
        required
        type="email"
        placeholder="you@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lavender-deep"
      />
      <textarea
        required
        rows={3}
        placeholder="What's up?"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="resize-none rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lavender-deep"
      />
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-blush-deep">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      <div className="mt-1 flex gap-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-black disabled:opacity-70 cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          {status === "sending" ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          Send
        </button>
        <button
          type="button"
          onClick={() => onDone("cancelled")}
          className="rounded-full px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:text-ink cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ChatbotModal() {
  const { isOpen, close } = useChatbot();
  const { open: openResume } = useResumeModal();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true;
      const greeting = getResponse("greeting");
      setMessages([{ id: uid(), from: "bot", text: greeting.text, quickReplies: greeting.quickReplies }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  function pushBot(text: string, quickReplies?: QuickReply[], isForm?: boolean) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: uid(), from: "bot", text, quickReplies, isForm }]);
    }, 650);
  }

  function pushUser(text: string) {
    setMessages((prev) => [...prev, { id: uid(), from: "user", text }]);
  }

  function handleQuickReply(qr: QuickReply) {
    pushUser(qr.label);

    if (qr.kind === "topic") {
      const reply = getResponse(qr.id);
      pushBot(reply.text, reply.quickReplies);
      return;
    }

    switch (qr.id) {
      case "menu":
        pushBot("Sure thing — what would you like to know?", mainMenu());
        break;
      case "view-resume":
        openResume();
        pushBot("Opening the resume preview for you. ✨", [{ kind: "action", id: "menu", label: "Main menu" }]);
        break;
      case "download-resume": {
        const a = document.createElement("a");
        a.href = profile.resumeUrl;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
        pushBot("Downloading now — should hit your device in a second. 📄", [
          { kind: "action", id: "menu", label: "Main menu" },
        ]);
        break;
      }
      case "send-message":
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: uid(), from: "bot", text: "Sure — fill this in and I'll pass it straight to Gargi's inbox:", isForm: true },
          ]);
        }, 450);
        break;
    }
  }

  function handleFormDone(id: string, status: "sent" | "cancelled") {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isForm: false } : m)));
    if (status === "sent") {
      pushBot("Message sent — thank you! 🎉 Gargi usually replies within a day or two.", [
        { kind: "action", id: "menu", label: "Main menu" },
      ]);
    } else {
      pushBot("No problem, cancelled. Anything else I can help with?", mainMenu());
    }
  }

  function handleTextSubmit(e: FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    pushUser(value);
    setInput("");
    const topic = matchIntent(value);
    const reply = getResponse(topic);
    pushBot(reply.text, reply.quickReplies);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="glass-raised fixed bottom-5 right-5 z-[90] flex h-[min(640px,calc(100vh-2.5rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.75rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)]"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio assistant chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                <Image src="/profile.jpg" alt="" fill sizes="36px" className="object-cover" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  Gargi&apos;s Assistant <Sparkles size={12} className="text-rosegold-deep" />
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-ink-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  Ask me anything
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/10 hover:text-ink cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                {m.text && (
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-sm text-black"
                        : "glass rounded-bl-sm text-ink-soft"
                    }`}
                    style={m.from === "user" ? { background: "var(--gradient-primary)" } : undefined}
                  >
                    <RichText text={m.text} />
                  </div>
                )}

                {m.isForm && <div className="w-full"><InlineMessageForm onDone={(s) => handleFormDone(m.id, s)} /></div>}

                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.quickReplies.map((qr, i) => (
                      <button
                        key={`${qr.kind}-${"id" in qr ? qr.id : i}-${i}`}
                        type="button"
                        onClick={() => handleQuickReply(qr)}
                        className="rounded-full border border-lavender/25 bg-lavender/5 px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-lavender/45 hover:text-lavender-deep cursor-pointer"
                      >
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm glass w-fit px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ink-faint"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lavender-deep"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black transition-transform hover:-translate-y-0.5 cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Send size={15} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
