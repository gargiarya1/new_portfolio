"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Loader2, AlertCircle, MessageSquareHeart } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DoodleCanvas } from "./DoodleCanvas";

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const ACCENTS = ["var(--color-lavender)", "var(--color-blush)", "var(--color-rosegold)", "var(--color-cyan)"];
// A small fixed set of tilt angles, cycled by index — deterministic between
// server and client render (avoids hydration mismatches from Math.random).
const TILTS = [-2.5, 1.8, -1.2, 2.6, -3, 0.9, 2, -1.8];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't post that — try again.");
      if (data.entry) setEntries((prev) => [data.entry, ...prev]);
      setForm({ name: "", message: "", website: "" });
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post that — try again.");
      setStatus("error");
    }
  };

  return (
    <section id="wall" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Fun Corner"
          title="Leave your mark ✍️"
          description="Scrolled this far? Pin a note — say hi, leave feedback, or just say you were here."
        />

        {/* Form */}
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="glass-raised relative mb-12 overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl opacity-40"
              style={{ background: "var(--gradient-glow)" }}
            />
            {/* honeypot — hidden from real visitors */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-[0.8fr_1.4fr_auto] sm:items-end">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
                Name
                <input
                  required
                  maxLength={40}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lavender-deep"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
                Note
                <input
                  required
                  maxLength={220}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Leave something nice..."
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lavender-deep"
                />
              </label>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
                style={{ background: "var(--gradient-primary)" }}
              >
                {status === "sending" ? <Loader2 size={14} className="animate-spin" /> : <PenLine size={14} />}
                Pin a Note
              </button>
            </div>
            {status === "error" && (
              <p className="relative mt-3 flex items-center gap-1.5 text-xs text-blush-deep">
                <AlertCircle size={13} /> {error}
              </p>
            )}
          </form>
        </Reveal>

        {/* Wall */}
        {loading ? (
          <p className="text-center text-sm text-ink-faint">Loading the wall...</p>
        ) : entries.length === 0 ? (
          <div className="glass flex flex-col items-center gap-2 rounded-3xl py-14 text-center">
            <MessageSquareHeart size={22} className="text-ink-faint" />
            <p className="text-sm text-ink-faint">No notes yet — be the first to pin one!</p>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            <AnimatePresence initial={false}>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
                  className="glass relative rounded-2xl p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:rotate-0"
                >
                  <span
                    className="absolute left-1/2 -top-1.5 h-3 w-3 -translate-x-1/2 rounded-full shadow"
                    style={{ background: ACCENTS[i % ACCENTS.length] }}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-ink-soft">&ldquo;{entry.message}&rdquo;</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-ink">— {entry.name}</p>
                    <p className="text-[10px] uppercase tracking-wide text-ink-faint">{timeAgo(entry.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <DoodleCanvas />
      </div>
    </section>
  );
}
