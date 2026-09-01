"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/portfolio";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled ? "glass shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)]" : "bg-transparent"
        }`}
      >
        <a href="#home" className="flex items-center gap-2.5 pl-1">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
            <Image
              src="/profile.jpg"
              alt={profile.name}
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Gargi<span className="text-gradient">.</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-ink-soft transition-colors hover:text-lavender-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 sm:inline-flex"
            style={{ background: "var(--gradient-primary)" }}
          >
            Let&apos;s Talk
            <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full glass text-ink lg:hidden cursor-pointer"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass absolute inset-x-4 top-20 z-40 flex flex-col gap-1 rounded-3xl p-4 shadow-2xl lg:hidden"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-lavender/10 hover:text-lavender-deep"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl px-4 py-3 text-center text-base font-semibold text-black"
              style={{ background: "var(--gradient-primary)" }}
            >
              Let&apos;s Talk
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
