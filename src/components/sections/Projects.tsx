"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

const filters = ["All", "Enterprise Project", "Personal Project"] as const;

export function Projects() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.type === active)),
    [active]
  );

  return (
    <section id="projects" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work, end to end"
          description="Enterprise platforms I've built in production, and personal projects I've shipped for the love of building."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                active === f
                  ? "text-black"
                  : "glass text-ink-soft hover:text-ink"
              }`}
              style={active === f ? { background: "var(--gradient-primary)" } : undefined}
            >
              {f === "All" ? "All Projects" : f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
