import { ArrowUpRight, CheckCircle2, Puzzle } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { GithubIcon } from "@/components/ui/icons";

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;

  return (
    <Reveal>
      <div
        className={`group grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-10 ${
          reversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Visual placeholder panel */}
        <TiltCard className="group">
          <div className="glass relative flex h-64 w-full items-center justify-center overflow-hidden rounded-[2rem] sm:h-80 lg:h-full">
            <div
              aria-hidden
              className="absolute inset-0 opacity-80"
              style={{ background: "var(--gradient-primary)", filter: "saturate(0.85)" }}
            />
            <div aria-hidden className="absolute inset-0 bg-noise opacity-30" />
            <div
              aria-hidden
              className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <span className="relative font-display text-6xl font-medium text-white/95 drop-shadow-sm sm:text-7xl">
              {initials(project.name)}
            </span>
            <span className="absolute bottom-5 left-5 rounded-full bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        </TiltCard>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-faint">
              0{index + 1}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                project.type === "Enterprise Project"
                  ? "bg-purple/10 text-purple"
                  : "bg-rosegold/15 text-rosegold-deep"
              }`}
            >
              {project.type}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                project.status === "Live"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-ink-faint/10 text-ink-faint"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  project.status === "Live" ? "bg-emerald-500" : "bg-ink-faint"
                }`}
              />
              {project.status}
            </span>
          </div>

          <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {project.name}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            {project.longDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-lavender/25 bg-lavender/5 px-3 py-1 text-xs font-medium text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-lavender-deep">
                <CheckCircle2 size={13} /> Key Features
              </p>
              <ul className="space-y-1.5">
                {project.features.map((f) => (
                  <li key={f} className="text-sm leading-snug text-ink-soft">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rosegold-deep">
                <Puzzle size={13} /> Challenges Solved
              </p>
              <ul className="space-y-1.5">
                {project.challenges.map((c) => (
                  <li key={c} className="text-sm leading-snug text-ink-soft">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--gradient-primary)" }}
              >
                Live Demo
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:text-lavender-deep"
              >
                <GithubIcon size={14} />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
