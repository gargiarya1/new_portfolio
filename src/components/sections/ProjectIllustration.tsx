import {
  PhoneCall,
  Sun,
  GraduationCap,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Code2,
  Cloud,
  Sparkles,
  Zap,
  Wifi,
  Braces,
  type LucideIcon,
} from "lucide-react";

type Scene = {
  Icon: LucideIcon;
  /** Free, MIT-licensed illustration from unDraw (undraw.co), recolored to
   * this project's accent — see public/illustrations/. */
  image: string;
  primary: string;
  secondary: string;
  tertiary: string;
  glyphs: [LucideIcon, LucideIcon, LucideIcon, LucideIcon];
};

const scenes: Record<string, Scene> = {
  "ai-caller-system": {
    Icon: PhoneCall,
    image: "/illustrations/ai-caller-system.svg",
    primary: "var(--color-lavender)",
    secondary: "var(--color-cyan)",
    tertiary: "var(--color-blush)",
    glyphs: [Wifi, Sparkles, Braces, Cloud],
  },
  "suncity-solar-erp": {
    Icon: Sun,
    image: "/illustrations/suncity-solar-erp.svg",
    primary: "var(--color-rosegold)",
    secondary: "var(--color-blush)",
    tertiary: "var(--color-lavender)",
    glyphs: [Zap, Cloud, Sparkles, Code2],
  },
  "t2u-lms-panel": {
    Icon: GraduationCap,
    image: "/illustrations/t2u-lms-panel.svg",
    primary: "var(--color-cyan)",
    secondary: "var(--color-lavender)",
    tertiary: "var(--color-rosegold)",
    glyphs: [Braces, Sparkles, Wifi, Cloud],
  },
  "zyra-whatsapp": {
    Icon: MessageSquare,
    image: "/illustrations/zyra-whatsapp.svg",
    primary: "var(--color-blush)",
    secondary: "var(--color-cyan)",
    tertiary: "var(--color-rosegold)",
    glyphs: [Wifi, Cloud, Sparkles, Braces],
  },
  mindsnap: {
    Icon: BookOpen,
    image: "/illustrations/mindsnap.svg",
    primary: "var(--color-lavender)",
    secondary: "var(--color-rosegold)",
    tertiary: "var(--color-cyan)",
    glyphs: [Sparkles, Braces, Cloud, Zap],
  },
  bsafe: {
    Icon: ShieldCheck,
    image: "/illustrations/bsafe.svg",
    primary: "var(--color-blush)",
    secondary: "var(--color-lavender)",
    tertiary: "var(--color-cyan)",
    glyphs: [Zap, Sparkles, Wifi, Cloud],
  },
};

/** A distinct, free-licensed flat illustration per project (via unDraw,
 * recolored to that project's accent) layered over a small geometric
 * wallpaper motif in the site's live palette. */
export function ProjectIllustration({ slug }: { slug: string }) {
  const scene = scenes[slug] ?? scenes.mindsnap;
  const { Icon, image, primary, secondary, tertiary, glyphs } = scene;
  const [G1, G2, G3, G4] = glyphs;
  const uid = slug;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* geometric wallpaper backdrop, in the live palette */}
      <svg viewBox="0 0 220 160" className="absolute inset-0 h-full w-full" role="img" aria-label="">
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: primary, stopOpacity: 0.22 }} />
            <stop offset="100%" style={{ stopColor: secondary, stopOpacity: 0.12 }} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="160" fill={`url(#bg-${uid})`} />
        <g opacity="0.75">
          <rect x="10" y="10" width="22" height="22" rx="7" style={{ fill: tertiary }} opacity="0.3" transform="rotate(-8 21 21)" />
          <G1 x={15} y={15} size={12} strokeWidth={2} style={{ color: tertiary }} />

          <circle cx="204" cy="24" r="14" style={{ fill: primary }} opacity="0.25" />
          <G2 x={198} y={18} size={12} strokeWidth={2} style={{ color: primary }} />

          <rect x="184" y="122" width="20" height="20" rx="6" style={{ fill: secondary }} opacity="0.25" transform="rotate(10 194 132)" />
          <G3 x={188} y={126} size={12} strokeWidth={2} style={{ color: secondary }} />

          <circle cx="14" cy="136" r="11" style={{ fill: tertiary }} opacity="0.25" />
          <G4 x={9} y={131} size={11} strokeWidth={2} style={{ color: tertiary }} />
        </g>
      </svg>

      {/* the illustration itself */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image benefit */}
      <img
        src={image}
        alt=""
        className="absolute inset-x-0 bottom-0 h-[86%] w-full object-contain object-bottom drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
      />

      {/* project icon badge */}
      <span
        className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 shadow-lg backdrop-blur-sm"
        style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
      >
        <Icon size={16} className="text-black/80" strokeWidth={2} />
      </span>
    </div>
  );
}
