import { skillCategories } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const allSkills = skillCategories.flatMap((c) => c.skills);

export function Skills() {
  return (
    <section id="skills" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Skills"
          title="The toolkit behind every build"
          description="Languages, frameworks and tools I reach for to take an idea from spec to production."
        />
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
          {skillCategories.map((category, i) => (
            <Reveal key={category.title} delay={(i % 3) * 0.08}>
              <div className="group glass relative h-full overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-20px_rgba(139,111,179,0.4)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: "var(--gradient-glow)" }}
                />
                <h3 className="font-display text-xl font-medium text-ink">
                  {category.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-faint">{category.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-lavender/25 bg-lavender/5 px-3 py-1 text-xs font-medium text-ink-soft transition-colors group-hover:border-lavender/40 group-hover:text-lavender-deep"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
