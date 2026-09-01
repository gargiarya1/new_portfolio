"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  LayoutPanelLeft,
  Smartphone,
  Server,
  Database,
  BrainCircuit,
  Building2,
  Cloud,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { skillCategories } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";

const allSkills = skillCategories.flatMap((c) => c.skills);

const categoryIcons: Record<string, LucideIcon> = {
  "Programming Languages": Terminal,
  "Frontend Development": LayoutPanelLeft,
  "Mobile Development": Smartphone,
  "Backend Development": Server,
  Databases: Database,
  "AI & Automation": BrainCircuit,
  "Business Systems": Building2,
  "Cloud & DevOps": Cloud,
  "Tools & Productivity": Wrench,
};

const orbitIcons = [Terminal, LayoutPanelLeft, Server, Database, BrainCircuit, Cloud];

function SkillOrbit() {
  const radius = 84;
  return (
    <div
      aria-hidden
      className="relative hidden h-56 w-56 shrink-0 lg:block"
      style={{ perspective: "800px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-jiggle glass flex h-20 w-20 items-center justify-center rounded-full text-xs font-semibold text-gradient">
          Stack
        </div>
      </div>
      {/* Two nested layers on purpose: a CSS animation targeting `transform`
          completely overrides any static inline `transform` on the SAME
          element, so the 3D tilt has to live on its own wrapper — the
          animated spin goes on the outer div, the static tilt on the inner. */}
      <div className="animate-spin-slow absolute inset-0">
        <div className="absolute inset-0" style={{ transform: "rotateX(55deg)" }}>
          {orbitIcons.map((Icon, i) => {
            const angle = (i / orbitIcons.length) * 2 * Math.PI;
            // Rounded to 2dp so server- and client-computed trig (which can
            // differ in the last float digit between runtimes) render identical
            // strings and never trip a hydration mismatch.
            const cx = Math.round(Math.cos(angle) * radius * 100) / 100;
            const cy = Math.round(Math.sin(angle) * radius * 100) / 100;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-9 w-9"
                style={{ transform: `translate(${cx}px, ${cy}px) translate(-50%, -50%)` }}
              >
                <div style={{ animation: "spin 22s linear infinite reverse" }}>
                  <div
                    className="animate-chip-bounce glass flex h-9 w-9 items-center justify-center rounded-full text-lavender-deep shadow-lg"
                    style={{ animationDelay: `${i * 0.22}s` }}
                  >
                    <Icon size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <SectionHeading
            eyebrow="Skills"
            title="The toolkit behind every build"
            description="Languages, frameworks and tools I reach for to take an idea from spec to production."
          />
          <SkillOrbit />
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative mb-12 overflow-hidden py-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent"
        />
        <div className="flex w-max animate-marquee gap-3">
          {[...allSkills, ...allSkills].map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="glass whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium text-ink-soft"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => {
            const Icon = categoryIcons[category.title] ?? Terminal;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, rotateX: -78, y: 26 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 1200, transformOrigin: "bottom" }}
                className="h-full"
              >
                <TiltCard className="group h-full">
                  <div className="glass relative h-full overflow-hidden rounded-3xl p-6 transition-shadow duration-500 hover:shadow-[0_20px_50px_-20px_rgba(124,108,240,0.45)]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                      style={{ background: "var(--gradient-glow)" }}
                    />
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl text-black"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Icon size={17} />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-medium text-ink">
                      {category.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-faint">{category.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-lavender/25 bg-lavender/5 px-3 py-1 text-xs font-medium text-ink-soft transition-all duration-300 group-hover:border-lavender/40 group-hover:text-lavender-deep"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
