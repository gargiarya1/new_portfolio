"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Code2,
  Compass,
  Target,
  Star,
  Leaf,
  Feather,
  CircleDot,
  Triangle,
  Hexagon,
  Gem,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { aboutCards, type AboutCard } from "@/data/portfolio";
import { useMediaQuery } from "@/lib/hooks";

const chapterIcons: Record<AboutCard["icon"], LucideIcon> = {
  sparkles: Sparkles,
  graduation: GraduationCap,
  code: Code2,
  compass: Compass,
  target: Target,
};

const decorativePool: LucideIcon[] = [Star, Leaf, Feather, CircleDot, Triangle, Hexagon, Gem, Sparkle];

// -----------------------------------------------------------------------------
// AgedPaper — the two-tone, crinkled, burnt-edge page surface. The two tones
// are the site's *live* accent colors (blended toward a parchment base with
// color-mix so text stays legible) — pick a different palette in the theme
// picker and the pages retint immediately. The crinkle is a real emboss: a
// turbulence-noise field run through feDiffuseLighting so it actually reads
// as creased paper catching light, not flat grain.
// -----------------------------------------------------------------------------
function AgedPaper({ angle }: { angle: number }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg,
            color-mix(in srgb, var(--color-lavender) 42%, #f3e6cd) 0%,
            color-mix(in srgb, var(--color-blush) 38%, #ecdcb8) 50%,
            color-mix(in srgb, var(--color-rosegold) 46%, #e4d0a8) 100%)`,
        }}
      />
      {/* emboss / crinkle relief */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ filter: "url(#paper-crinkle)", opacity: 0.55 }}
      />
      <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.18]" />
      {/* burnt, uneven edges */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 45% at 3% 8%, rgba(58,28,10,0.55), transparent 60%),
            radial-gradient(ellipse 55% 50% at 97% 12%, rgba(58,28,10,0.5), transparent 60%),
            radial-gradient(ellipse 60% 55% at 5% 96%, rgba(58,28,10,0.55), transparent 60%),
            radial-gradient(ellipse 55% 50% at 96% 92%, rgba(58,28,10,0.5), transparent 60%),
            radial-gradient(ellipse at center, transparent 52%, rgba(60,30,10,0.28) 82%, rgba(30,14,5,0.62) 100%)
          `,
          boxShadow: "inset 0 0 3px 1px rgba(40,20,8,0.4)",
        }}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// FloatingIcon — its own position, depth, rotation speed and float rhythm.
// Continuously animates on its own; cursor parallax is layered on top via a
// separate wrapper (a CSS `animation` on an element can't share the property
// with a framer-motion-driven transform on that SAME element without one
// silently winning, so the two effects always live on separate nested divs).
// -----------------------------------------------------------------------------
type IconSpec = {
  Icon: LucideIcon;
  top: string;
  left: string;
  depth: number;
  floatDuration: number;
  floatDelay: number;
  spinDuration: number;
  scale: number;
};

function buildIconSpecs(seed: number): IconSpec[] {
  const positions = [
    { top: "8%", left: "10%" },
    { top: "14%", left: "82%" },
    { top: "40%", left: "4%" },
    { top: "46%", left: "88%" },
    { top: "78%", left: "14%" },
    { top: "82%", left: "78%" },
  ];
  return positions.map((pos, i) => {
    const Icon = decorativePool[(seed + i) % decorativePool.length];
    return {
      Icon,
      top: pos.top,
      left: pos.left,
      depth: 14 + ((i * 7 + seed * 3) % 22),
      floatDuration: 4.5 + ((i + seed) % 4),
      floatDelay: (i * 0.35) % 2,
      spinDuration: 14 + ((i * 5 + seed) % 16),
      scale: 0.78 + ((i % 3) * 0.12),
    };
  });
}

function FloatingIcon({ spec, smx, smy, accent }: { spec: IconSpec; smx: MotionValue<number>; smy: MotionValue<number>; accent: string }) {
  const x = useTransform(smx, (v) => v * spec.depth);
  const y = useTransform(smy, (v) => v * spec.depth);
  const rotate = useTransform(smx, (v) => v * spec.depth * 0.6);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute z-[3]"
      style={{ top: spec.top, left: spec.left, x, y }}
    >
      {/* gentle continuous float + spin, independent of the parallax layer above */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 6, 0, -6, 0] }}
        transition={{ duration: spec.floatDuration, delay: spec.floatDelay, repeat: Infinity, ease: "easeInOut" }}
        style={{ scale: spec.scale }}
      >
        <motion.div style={{ rotate }}>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            style={{ background: `${accent}1a`, border: `1px solid ${accent}55`, color: accent }}
          >
            <spec.Icon size={14} strokeWidth={1.75} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Page-turn variants — a corner rolls up first, then the page sweeps through
// the full turn, hinged at the spine. `null` as a keyframe's first value
// means "start from wherever the value currently is", so the roll blends
// straight into the turn instead of jumping. Which page flips (and which
// way it rolls) depends on the direction of travel.
// -----------------------------------------------------------------------------
const TURN_MS = 950;
const TURN_S = TURN_MS / 1000;
const EASE: [number, number, number, number] = [0.45, 0, 0.2, 1];

const flipFromRightPage: Variants = {
  enter: { rotateY: 132, rotateZ: -7, scale: 0.92, opacity: 0.55 },
  center: {
    rotateY: [null, 34, 0],
    rotateZ: [null, 9, 0],
    scale: [null, 0.95, 1],
    opacity: [null, 0.85, 1],
    transition: { duration: TURN_S, times: [0, 0.38, 1], ease: EASE },
  },
  exit: {
    rotateY: [null, -22, -82, -148],
    rotateZ: [null, 11, 5, 0],
    scale: [null, 0.93, 0.96, 1],
    opacity: [null, 1, 0.78, 0.55],
    transition: { duration: TURN_S, times: [0, 0.24, 0.56, 1], ease: EASE },
  },
};
const flipFromLeftPage: Variants = {
  enter: { rotateY: -132, rotateZ: 7, scale: 0.92, opacity: 0.55 },
  center: {
    rotateY: [null, -34, 0],
    rotateZ: [null, -9, 0],
    scale: [null, 0.95, 1],
    opacity: [null, 0.85, 1],
    transition: { duration: TURN_S, times: [0, 0.38, 1], ease: EASE },
  },
  exit: {
    rotateY: [null, 22, 82, 148],
    rotateZ: [null, -11, -5, 0],
    scale: [null, 0.93, 0.96, 1],
    opacity: [null, 1, 0.78, 0.55],
    transition: { duration: TURN_S, times: [0, 0.24, 0.56, 1], ease: EASE },
  },
};
const settle: Variants = {
  enter: { opacity: 0, scale: 0.97 },
  center: { opacity: 1, scale: 1, transition: { duration: TURN_S, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: TURN_S, ease: EASE } },
};

// -----------------------------------------------------------------------------
// Illustration page (left, desktop / top, mobile)
// -----------------------------------------------------------------------------
function IllustrationFace({
  card,
  smx,
  smy,
  seed,
}: {
  card: AboutCard;
  smx: MotionValue<number>;
  smy: MotionValue<number>;
  seed: number;
}) {
  const illoX = useTransform(smx, (v) => v * -14);
  const illoY = useTransform(smy, (v) => v * -10);
  const bgX = useTransform(smx, (v) => v * -4);
  const bgY = useTransform(smy, (v) => v * -3);
  const specs = buildIconSpecs(seed);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AgedPaper angle={155} />
      {/* subtle background decorative shift (least parallax) */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.2]" style={{ x: bgX, y: bgY }}>
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 38%, ${card.accent}22, transparent 62%)` }}
        />
      </motion.div>

      {specs.map((spec, i) => (
        <FloatingIcon key={i} spec={spec} smx={smx} smy={smy} accent={card.accent} />
      ))}

      <motion.img
        src={card.image}
        alt=""
        style={{ x: illoX, y: illoY }}
        className="relative z-[2] max-h-[78%] max-w-[72%] object-contain"
        draggable={false}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Content page (right, desktop / bottom, mobile)
// -----------------------------------------------------------------------------
function ContentFace({ card, index, total }: { card: AboutCard; index: number; total: number }) {
  const Icon = chapterIcons[card.icon];
  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-3 overflow-hidden px-7 py-8 sm:px-10 sm:py-10">
      <AgedPaper angle={200} />
      {/* legibility scrim behind the text block */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-sm sm:inset-6"
        style={{ background: "rgba(253,248,235,0.38)" }}
      />

      <p className="relative text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: card.accent }}>
        {card.chapter}
      </p>
      <h3 className="relative font-display text-2xl font-medium leading-tight text-[#241a10] sm:text-4xl">
        {card.title}
      </h3>
      <p className="relative font-display text-base italic text-[#5c4c34] sm:text-lg">{card.intro}</p>

      <p className="relative max-w-md text-sm leading-relaxed text-[#3c3122] sm:text-base">{card.body}</p>

      {card.quote && (
        <blockquote
          className="relative mt-1 max-w-md border-l-2 pl-4 font-display text-sm italic leading-snug text-[#4a3c28] sm:text-base"
          style={{ borderColor: card.accent }}
        >
          &ldquo;{card.quote}&rdquo;
        </blockquote>
      )}

      <span
        className="relative mt-2 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md"
        style={{ background: card.accent }}
      >
        <Icon size={16} />
      </span>

      <p className="absolute bottom-5 right-7 text-xs font-medium tabular-nums text-[#8a7756] sm:right-10">
        {index + 1} / {total}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Turn-shadow overlay — a dark sweep that peaks mid-rotation, sold as the
// shading a real page would cast on itself as it lifts and bends.
// -----------------------------------------------------------------------------
function TurnShadow({ fromLeft }: { fromLeft: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: fromLeft
          ? "linear-gradient(270deg, rgba(0,0,0,0.55), transparent 55%)"
          : "linear-gradient(90deg, rgba(0,0,0,0.55), transparent 55%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 0] }}
      transition={{ duration: TURN_S, times: [0, 0.6, 1] }}
    />
  );
}

/** The corner lifting and curling before the page commits to the full turn —
 * a soft dark blob that grows fast early, then fades as the turn takes over. */
function CornerCurlShadow({ corner }: { corner: "br" | "bl" | "tr" | "tl" }) {
  const pos: Record<typeof corner, string> = {
    br: "bottom-0 right-0",
    bl: "bottom-0 left-0",
    tr: "top-0 right-0",
    tl: "top-0 left-0",
  };
  const origin: Record<typeof corner, string> = {
    br: "bottom right",
    bl: "bottom left",
    tr: "top right",
    tl: "top left",
  };
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${pos[corner]} h-24 w-24 rounded-full sm:h-32 sm:w-32`}
      style={{
        background: "radial-gradient(circle, rgba(30,15,5,0.55), transparent 72%)",
        transformOrigin: origin[corner],
      }}
      initial={{ opacity: 0, scale: 0.25 }}
      animate={{ opacity: [0, 0.75, 0.4, 0], scale: [0.25, 1, 1.3, 1.6] }}
      transition={{ duration: TURN_S, times: [0, 0.24, 0.55, 1] }}
    />
  );
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export function AboutStoryBook() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const animating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const bookRotateX = useSpring(useTransform(my, (v) => v * -3), { stiffness: 80, damping: 22 });
  const bookRotateY = useSpring(useTransform(mx, (v) => v * 3), { stiffness: 80, damping: 22 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  function withGuard(fn: () => void) {
    if (animating.current) return;
    animating.current = true;
    fn();
    setTimeout(() => {
      animating.current = false;
    }, TURN_MS + 40);
  }

  const next = () =>
    withGuard(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % aboutCards.length);
    });
  const prev = () =>
    withGuard(() => {
      setDirection(-1);
      setIndex((i) => (i - 1 + aboutCards.length) % aboutCards.length);
    });
  const goTo = (i: number) =>
    withGuard(() => {
      setDirection(i > index ? 1 : -1);
      setIndex(i);
    });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const card = aboutCards[index];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-5xl px-3 py-8 sm:px-6"
    >
      {/* shared paper-crinkle filter — emboss a turbulence field so the page
          surface reads as creased paper catching light, not flat grain */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="paper-crinkle" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="5" seed="7" result="noise" />
          <feDiffuseLighting in="noise" surfaceScale="2.6" diffuseConstant="1.15" lightingColor="#ffffff" result="light">
            <feDistantLight azimuth="235" elevation="48" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <div className="relative w-full" style={{ perspective: 2600 }}>
        <motion.div
          style={{ rotateX: bookRotateX, rotateY: bookRotateY, transformStyle: "preserve-3d" }}
          className="relative mx-auto w-full"
        >
          {/* hardcover, peeking around the pages */}
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[1.6rem] sm:-inset-4 sm:rounded-[2rem]"
            style={{
              background: "linear-gradient(155deg, #2a1c12 0%, #170f09 100%)",
              boxShadow: "0 50px 110px -30px rgba(0,0,0,0.75)",
            }}
          />

          <div className="relative flex flex-col overflow-visible rounded-[1.2rem] sm:h-[500px] sm:flex-row sm:rounded-[1.5rem]">
            {isDesktop ? (
              <>
                {/* LEFT page */}
                <div className="relative h-64 shrink-0 overflow-hidden rounded-t-[1.2rem] border-y-2 border-l-2 border-[#3a2717] sm:h-auto sm:w-1/2 sm:rounded-l-[1.5rem] sm:rounded-tr-none sm:border-y-4 sm:border-l-4" style={{ perspective: 1800 }}>
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                      key={index}
                      variants={direction === -1 ? flipFromLeftPage : settle}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      onClick={prev}
                      role="button"
                      tabIndex={0}
                      aria-label="Previous page"
                      style={{ transformOrigin: "right center", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                      className="absolute inset-0 cursor-pointer"
                    >
                      <IllustrationFace card={card} smx={smx} smy={smy} seed={index} />
                      {direction === -1 && (
                        <>
                          <TurnShadow fromLeft />
                          <CornerCurlShadow corner="bl" />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* spine */}
                <div
                  aria-hidden
                  className="relative z-[4] h-3 shrink-0 sm:h-auto sm:w-4"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0.6))",
                  }}
                />

                {/* RIGHT page */}
                <div className="relative h-72 shrink-0 overflow-hidden rounded-b-[1.2rem] border-y-2 border-r-2 border-[#3a2717] sm:h-auto sm:w-1/2 sm:rounded-r-[1.5rem] sm:rounded-bl-none sm:border-y-4 sm:border-r-4" style={{ perspective: 1800 }}>
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                      key={index}
                      variants={direction === 1 ? flipFromRightPage : settle}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      onClick={next}
                      role="button"
                      tabIndex={0}
                      aria-label="Next page"
                      style={{ transformOrigin: "left center", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                      className="absolute inset-0 cursor-pointer"
                    >
                      <ContentFace card={card} index={index} total={aboutCards.length} />
                      {direction === 1 && (
                        <>
                          <TurnShadow fromLeft={false} />
                          <CornerCurlShadow corner="br" />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // mobile: one unified page, illustration on top, content below,
              // the whole thing turns as a single sheet
              <div className="relative h-[560px] w-full overflow-hidden rounded-[1.2rem] border-2 border-[#3a2717]" style={{ perspective: 1800 }}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={index}
                    variants={direction === 1 ? flipFromRightPage : flipFromLeftPage}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    onClick={next}
                    role="button"
                    tabIndex={0}
                    aria-label="Next page"
                    style={{
                      transformOrigin: direction === 1 ? "left center" : "right center",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                    className="absolute inset-0 flex cursor-pointer flex-col"
                  >
                    <div className="h-[42%] shrink-0">
                      <IllustrationFace card={card} smx={smx} smy={smy} seed={index} />
                    </div>
                    <div className="flex-1">
                      <ContentFace card={card} index={index} total={aboutCards.length} />
                    </div>
                    <TurnShadow fromLeft={direction !== 1} />
                    <CornerCurlShadow corner={direction === 1 ? "br" : "bl"} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ambient shadow beneath the book */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 -bottom-6 h-8 rounded-full opacity-70 blur-2xl sm:-bottom-8 sm:h-10"
            style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.65), transparent 70%)" }}
          />
        </motion.div>
      </div>

      {/* navigation */}
      <div className="mt-10 flex items-center justify-center gap-6 text-sm text-ink-faint">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous page"
          className="flex items-center gap-1.5 transition-colors hover:text-ink cursor-pointer"
        >
          <ChevronLeft size={15} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {aboutCards.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${c.title}`}
              className="h-1.5 rounded-full transition-all cursor-pointer"
              style={{
                width: i === index ? 20 : 6,
                background: i === index ? card.accent : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next page"
          className="flex items-center gap-1.5 transition-colors hover:text-ink cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
