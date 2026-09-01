"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

/**
 * Fixed, full-viewport ambient background: a faint drifting particle field
 * plus a masked grid, sitting behind every section. Pure canvas + CSS,
 * no WebGL — cheap enough to run everywhere, paused under reduced-motion.
 */
export function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.round((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.6 + 0.4,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 190, 245, 0.45)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 190, 245, 0.35)";
        ctx.fill();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_10%,transparent_75%)]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full blur-[120px] opacity-40"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div
        className="absolute top-[60%] -right-32 h-[28rem] w-[28rem] rounded-full blur-[120px] opacity-30"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />
    </div>
  );
}
