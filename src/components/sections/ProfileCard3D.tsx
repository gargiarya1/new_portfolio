"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { MouseEvent } from "react";
import { Code2, MapPin, RotateCw } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const techStack = ["React", "Node", "Python", "SQL"];

function CardFace({
  src,
  alt,
  rotateX,
  rotateY,
  sheen,
}: {
  src: string;
  alt: string;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  sheen: MotionValue<string>;
}) {
  return (
    <motion.div
      style={{ rotateX, rotateY, backfaceVisibility: "hidden", transformPerspective: 1000 }}
      className="absolute inset-0"
    >
      <div className="glass-raised relative h-full w-full overflow-hidden rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(124,108,240,0.45)]">
        <Image src={src} alt={alt} fill sizes="(max-width: 640px) 90vw, 420px" className="object-cover" priority />
        {/* depth vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07060c] via-transparent to-[#07060c]/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lavender/10 via-transparent to-rosegold/10" />
        {/* moving sheen */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: sheen }} />
        {/* edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/15" />
      </div>
    </motion.div>
  );
}

export function ProfileCard3D() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 120, damping: 16, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [9, -9]), springConfig);
  const tiltY = useSpring(useTransform(x, [0, 1], [-9, 9]), springConfig);
  const backRotateY = useTransform(tiltY, (v) => v + 180);

  const sheenX = useTransform(x, (v) => `${v * 100}%`);
  const sheenY = useTransform(y, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.14), transparent 65%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div className="relative mx-auto h-[400px] w-full max-w-sm sm:h-[480px] lg:h-[540px]">
      {/* Tilting + flipping glass frame */}
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        onClick={() => setFlipped((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label="Flip photo"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((v) => !v);
          }
        }}
        className="relative mx-auto h-full w-[86%] cursor-pointer"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-full w-full"
        >
          <CardFace src="/profile.jpg" alt="Gargi Arya" rotateX={rotateX} rotateY={tiltY} sheen={sheen} />
          <CardFace src="/profile-alt.jpg" alt="Gargi Arya, side profile" rotateX={rotateX} rotateY={backRotateY} sheen={sheen} />
        </motion.div>

        {/* flip affordance */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFlipped((v) => !v);
          }}
          aria-label="Flip photo"
          className="glass absolute -bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full text-ink-soft shadow-lg transition-colors hover:text-ink cursor-pointer"
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Floating badge: Developer */}
      <div className="animate-float pointer-events-none absolute -left-2 top-6 hidden sm:block" style={{ animationDelay: "0.2s" }}>
        <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-lg">
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-black" style={{ background: "var(--gradient-primary)" }}>
            <Code2 size={13} />
          </span>
          <span className="text-xs font-semibold text-ink">Developer</span>
        </div>
      </div>

      {/* Floating badge: Open to opportunities */}
      <div className="animate-float-slow pointer-events-none absolute -right-3 top-16 hidden sm:block" style={{ animationDelay: "0.6s" }}>
        <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-cyan" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="text-xs font-semibold text-ink">Open to opportunities</span>
        </div>
      </div>

      {/* Floating badge: tech stack */}
      <div className="animate-float-slower pointer-events-none absolute -left-4 bottom-24 hidden sm:block" style={{ animationDelay: "0.9s" }}>
        <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2.5 shadow-lg">
          {techStack.map((t) => (
            <span key={t} className="flex h-6 items-center rounded-full bg-white/8 px-2 text-[10px] font-semibold text-ink-soft">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Floating badge: location */}
      <div className="animate-float pointer-events-none absolute -right-2 bottom-8 hidden sm:block" style={{ animationDelay: "1.2s" }}>
        <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-lg">
          <MapPin size={13} className="text-blush-deep" />
          <span className="text-xs font-semibold text-ink">Jaipur, India</span>
        </div>
      </div>
    </div>
  );
}
