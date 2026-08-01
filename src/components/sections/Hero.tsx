"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Sparkles } from "lucide-react";
import { profile } from "@/data/portfolio";
import { RoleCycler } from "@/components/ui/RoleCycler";
import { Button } from "@/components/ui/Button";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function Hero() {
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
              View Projects
            </Button>
            <Button href="#contact" variant="ghost">
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-14 flex items-center gap-6 text-xs uppercase tracking-[0.15em] text-ink-faint"
          >
            <span>{profile.location}</span>
            <span className="h-px w-8 bg-current opacity-30" />
            <span>Code Cafe Lab IT Solutions</span>
          </motion.div>
        </div>

        {/* 3D scene + avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto h-[380px] w-full max-w-md sm:h-[460px] lg:h-[520px]"
        >
          <div className="absolute inset-0">
            <HeroScene />
          </div>

          {/* Monogram avatar badge, floats above the 3D scene */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="animate-float flex h-32 w-32 items-center justify-center rounded-[2rem] glass shadow-[0_20px_60px_-15px_rgba(139,111,179,0.5)] sm:h-40 sm:w-40"
              style={{ transform: "translateZ(0)" }}
            >
              <span className="font-display text-4xl font-medium text-gradient sm:text-5xl">
                GA
              </span>
            </div>
          </div>
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
