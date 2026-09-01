import { stats } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AboutStoryBook } from "@/components/sections/AboutStoryBook";

export function About() {
  return (
    <section id="about" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About Me"
          title="The story behind the code"
          description="A little about how I got here, and what keeps me building."
        />

        {/* Quote + stats strip */}
        <Reveal>
          <div className="glass-raised relative mb-6 overflow-hidden rounded-[2rem] p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
              style={{ background: "var(--gradient-glow)" }}
            />
            <p className="max-w-2xl font-display text-2xl italic leading-snug text-ink sm:text-3xl">
              &ldquo;The best products disappear into the background —
              they just work, beautifully.&rdquo;
            </p>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-lavender/40 via-blush/40 to-transparent" />
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
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
        </Reveal>
      </div>

      {/* Storybook */}
      <AboutStoryBook />
    </section>
  );
}
