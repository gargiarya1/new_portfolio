import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={`mb-10 flex flex-col gap-4 ${isCenter ? "items-center text-center" : "items-start text-left"}`}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-lavender-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-lavender to-blush" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl ${isCenter ? "mx-auto max-w-2xl" : ""}`}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.14}>
          <p className={`max-w-xl text-base text-ink-soft sm:text-lg ${isCenter ? "mx-auto" : ""}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
