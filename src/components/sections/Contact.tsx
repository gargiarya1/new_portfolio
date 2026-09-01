"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { profile } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { useChatbot } from "@/lib/chatbot-context";

const contactCards = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
  { icon: MapPin, label: "Location", value: profile.location, href: undefined },
];

const socialLinks = [
  { icon: GithubIcon, label: "GitHub", href: profile.github },
  { icon: LinkedinIcon, label: "LinkedIn", href: profile.linkedin },
];

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { open: openChat } = useChatbot();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something great"
          description="Have a project, a role, or just want to say hi? My inbox is open."
          align="center"
        />

        <Reveal>
          <div className="glass-raised relative mb-10 overflow-hidden rounded-[2rem] px-8 py-12 text-center sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50"
              style={{ background: "var(--gradient-glow)" }}
            />
            <p className="relative font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Let&apos;s build something{" "}
              <span className="text-gradient italic">amazing.</span>
            </p>
            <motion.button
              type="button"
              onClick={openChat}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-black shadow-[0_16px_40px_-10px_rgba(124,108,240,0.55)] transition-shadow hover:shadow-[0_20px_50px_-8px_rgba(124,108,240,0.7)] cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              <MessageCircle size={16} />
              Start a Conversation
            </motion.button>
            <p className="relative mt-3 text-xs text-ink-faint">
              Opens a quick chat — ask about skills, projects, or just say hi.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Info column */}
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                const content = (
                  <div className="glass group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-black"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink-faint">
                        {card.label}
                      </p>
                      <p className="text-sm font-medium text-ink">{card.value}</p>
                    </div>
                  </div>
                );
                return card.href ? (
                  <a key={card.label} href={card.href}>
                    {content}
                  </a>
                ) : (
                  <div key={card.label}>{content}</div>
                );
              })}

              <div className="glass mt-auto flex items-center gap-3 rounded-2xl p-5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-lavender/20 text-ink-soft transition-all hover:-translate-y-0.5 hover:border-lavender/40 hover:text-lavender-deep"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
                <p className="ml-2 text-sm text-ink-faint">Say hello on socials</p>
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-9"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full blur-3xl"
                style={{ background: "var(--gradient-glow)" }}
              />
              <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft">
                  Name
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="rounded-xl border border-lavender/20 bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lavender-deep"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft">
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className="rounded-xl border border-lavender/20 bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lavender-deep"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-ink-soft sm:col-span-2">
                  Message
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me a bit about what you're building..."
                    className="resize-none rounded-xl border border-lavender/20 bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lavender-deep"
                  />
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileTap={{ scale: 0.97 }}
                className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto cursor-pointer"
                style={{ background: "var(--gradient-primary)" }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : status === "sent" ? (
                  <>
                    <CheckCircle2 size={16} /> Message sent!
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </motion.button>

              {status === "error" && (
                <p className="relative mt-3 flex items-center gap-1.5 text-sm text-blush-deep">
                  <AlertCircle size={14} />
                  {errorMessage}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
