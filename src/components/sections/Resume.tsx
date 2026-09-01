"use client";

import { Award, Trophy, Eye, Download, Clock } from "lucide-react";
import { certifications, profile } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { useResumeModal } from "@/lib/resume-modal-context";

export function Resume() {
  const { open } = useResumeModal();

  return (
    <section id="resume" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Resume"
          title="Everything, on one page"
          description="A quick preview, or the full PDF — whichever you need."
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Resume card */}
          <Reveal>
            <TiltCard className="group">
              <div className="glass-raised relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full blur-3xl opacity-60"
                  style={{ background: "var(--gradient-glow)" }}
                />

                <button
                  type="button"
                  onClick={open}
                  aria-label="View full resume"
                  className="group/thumb relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#15131f]"
                >
                  <iframe
                    src={`${profile.resumeUrl}#toolbar=0&navpanes=0&view=FitH`}
                    title="Resume preview"
                    tabIndex={-1}
                    className="pointer-events-none absolute left-0 top-0 h-[250%] w-[250%] origin-top-left scale-[0.4]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover/thumb:bg-black/40 group-hover/thumb:opacity-100">
                    <span className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-ink">
                      <Eye size={14} />
                      Preview
                    </span>
                  </div>
                </button>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-medium text-ink">{profile.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-ink-faint">
                      <Clock size={11} />
                      Updated {profile.resumeUpdated}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={open}
                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full glass px-4 py-2.5 text-sm font-semibold text-ink-soft transition-all hover:-translate-y-0.5 hover:text-ink"
                  >
                    <Eye size={14} />
                    View Resume
                  </button>
                  <a
                    href={profile.resumeUrl}
                    download
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-black transition-all hover:-translate-y-0.5"
                    style={{ background: "var(--gradient-gold)" }}
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* Certifications */}
          <div>
            <Reveal>
              <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-lavender-deep">
                <Award size={15} />
                Certifications & Milestones
              </h3>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {certifications.map((cert, i) => (
                <Reveal key={cert.title} delay={(i % 2) * 0.1}>
                  <TiltCard className="group h-full">
                    <div className="glass relative flex h-full items-start gap-4 overflow-hidden rounded-2xl p-5 transition-shadow duration-500 hover:shadow-[0_20px_50px_-24px_rgba(124,108,240,0.45)]">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                        style={{ background: "var(--gradient-glow)" }}
                      />
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-black"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        <Award size={18} />
                      </span>
                      <div>
                        <h4 className="font-display text-base font-medium leading-snug text-ink">
                          {cert.title}
                        </h4>
                        <p className="mt-1 text-sm text-ink-faint">{cert.issuer}</p>
                        {cert.highlight && (
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rosegold/15 px-3 py-1 text-xs font-semibold text-rosegold-deep">
                            <Trophy size={12} />
                            {cert.highlight}
                          </span>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
