import { Award, Trophy } from "lucide-react";
import { certifications } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Achievements() {
  return (
    <section id="achievements" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Achievements"
          title="Certifications & milestones"
          description="Programs and recognitions that have shaped how I learn and build."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={(i % 2) * 0.1}>
              <div className="group glass relative flex items-start gap-4 overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(139,111,179,0.4)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: "var(--gradient-glow)" }}
                />
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Award size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium leading-snug text-ink">
                    {cert.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-faint">{cert.issuer}</p>
                  {cert.highlight && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rosegold/15 px-3 py-1 text-xs font-semibold text-rosegold-deep">
                      <Trophy size={12} />
                      {cert.highlight}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
