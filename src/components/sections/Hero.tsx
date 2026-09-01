"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Sparkles, Eye, Download } from "lucide-react";
import { profile } from "@/data/portfolio";
import { RoleCycler } from "@/components/ui/RoleCycler";
import { Button } from "@/components/ui/Button";
import { ProfileCard3D } from "@/components/sections/ProfileCard3D";
import { useResumeModal } from "@/lib/resume-modal-context";
import { useMediaQuery } from "@/lib/hooks";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function Hero() {
  const { open } = useResumeModal();
  const showScene = useMediaQuery("(min-width: 640px)");

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20"
    >
      {/* Ambient gradient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-70"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Text content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-lavender-deep"
          >
            <Sparkles size={13} />
            Available for new opportunities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
          >
            Hi, I&apos;m {profile.firstName} —
            <br />
            <RoleCycler roles={profile.roles} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href="#projects" icon={<ArrowUpRight size={16} />}>
              View My Work
            </Button>
            <Button href="#contact" variant="ghost">
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={open}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:-translate-y-0.5 hover:text-ink"
            >
              <Eye size={15} />
              View Resume
            </button>
            <a
              href={profile.resumeUrl}
              download
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_30px_-8px_rgba(219,162,79,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-6px_rgba(219,162,79,0.65)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Download size={15} className="transition-transform group-hover:translate-y-0.5" />
              Download Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-12 flex items-center gap-6 text-xs uppercase tracking-[0.15em] text-ink-faint"
          >
            <span>{profile.location}</span>
            <span className="h-px w-8 bg-current opacity-30" />
            <span>Code Cafe Lab IT Solutions</span>
          </motion.div>
        </div>

        {/* 3D profile card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          {showScene && (
            <div className="pointer-events-none absolute inset-0 -z-10 scale-125 opacity-70">
              <HeroScene />
            </div>
          )}
          <ProfileCard3D />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-faint sm:flex"
      >
        Scroll
        <ArrowDown size={14} className="animate-float" />
      </motion.a>
    </section>
  );
}
