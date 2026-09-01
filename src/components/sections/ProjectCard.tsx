"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { TiltCard } from "@/components/ui/TiltCard";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectIllustration } from "./ProjectIllustration";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
    >
      <TiltCard className="group h-full">
        <div className="glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-shadow duration-500 hover:shadow-[0_30px_70px_-24px_rgba(124,108,240,0.5)]">
          {/* Preview panel */}
          <div className="relative h-44 w-full overflow-hidden bg-[#0c0a16]">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
              <ProjectIllustration slug={project.slug} />
            </div>
            <span
              className={`absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/95 backdrop-blur-sm`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  project.status === "Live" ? "bg-emerald-400" : "bg-white/60"
                }`}
              />
              {project.status}
            </span>
            <span className="absolute bottom-3.5 left-3.5 rounded-full bg-black/30 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
              {project.category}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6">
            <span
              className={`mb-2 w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                project.type === "Enterprise Project"
                  ? "bg-purple/15 text-lavender-deep"
                  : "bg-rosegold/15 text-rosegold-deep"
              }`}
            >
              {project.type}
            </span>
            <h3 className="font-display text-xl font-medium text-ink">{project.name}</h3>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-lavender/20 bg-lavender/5 px-2.5 py-1 text-[11px] font-medium text-ink-soft transition-colors duration-300 group-hover:border-lavender/35 group-hover:text-lavender-deep"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="rounded-full px-2.5 py-1 text-[11px] font-medium text-ink-faint">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 border-t border-white/10 pt-5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Live Demo
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:text-lavender-deep"
                >
                  <GithubIcon size={13} />
                  GitHub
                </a>
              )}
              {!project.liveUrl && !project.githubUrl && (
                <span className="text-xs font-medium text-ink-faint">
                  Private / Enterprise codebase
                </span>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
