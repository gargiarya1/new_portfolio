import { profile, stats } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function About() {
  return (
    <section id="about" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About Me"
          title="The story behind the code"
          description="A little about how I got here, and what keeps me building."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
                  style={{ background: "var(--gradient-glow)" }}
                />
                <p className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">
                  &ldquo;The best products disappear into the background —
                  they just work, beautifully.&rdquo;
                </p>
                <div className="mt-8 h-px w-full bg-gradient-to-r from-lavender/40 via-blush/40 to-transparent" />
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-3xl font-medium text-gradient sm:text-4xl">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-faint">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col justify-center gap-6">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
