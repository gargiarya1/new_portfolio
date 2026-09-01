import { Briefcase, GraduationCap } from "lucide-react";
import { experience, education } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <section id="experience" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Experience & Education"
          title="Where I've built, and where it started"
        />

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.3fr_1fr]">
          {/* Experience timeline */}
          <div>
            <Reveal>
              <h3 className="mb-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-lavender-deep">
                <Briefcase size={15} />
                Work Experience
              </h3>
            </Reveal>
            <div className="relative flex flex-col gap-10 pl-8">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-lavender via-blush to-transparent" />
              {experience.map((item, i) => (
                <Reveal key={item.role} delay={i * 0.1}>
                  <div className="relative">
                    <span className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-base bg-gradient-to-br from-lavender to-blush shadow-[0_0_0_4px_rgba(185,166,224,0.15)]" />
                    <div className="glass rounded-3xl p-6">
                      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-xl font-medium text-ink">
                          {item.role}
                        </h4>
                        <span className="text-xs font-semibold uppercase tracking-wide text-rosegold-deep">
                          {item.period}
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-ink-faint">
                        {item.org} — {item.location}
                      </p>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        Key Contributions
                      </p>
                      <ul className="space-y-2">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-lavender-deep" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-lavender/25 bg-lavender/5 px-3 py-1 text-xs font-medium text-ink-soft"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <Reveal>
              <h3 className="mb-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-lavender-deep">
                <GraduationCap size={15} />
                Education
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass relative overflow-hidden rounded-3xl p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl"
                  style={{ background: "var(--gradient-glow)" }}
                />
                <h4 className="font-display text-xl font-medium text-ink">
                  {education.degree}
                </h4>
                <p className="mt-1.5 text-sm text-ink-faint">{education.school}</p>
                <div className="mt-5 flex items-center justify-between border-t border-lavender/15 pt-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {education.period}
                  </span>
                  <span className="rounded-full bg-lavender/10 px-3 py-1 text-xs font-semibold text-lavender-deep">
                    {education.detail}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
