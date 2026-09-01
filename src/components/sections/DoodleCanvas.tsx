"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import {
  Eraser,
  Loader2,
  AlertCircle,
  Palette as PaletteIcon,
  Sparkles,
  Pen,
  Paintbrush,
  Highlighter,
  SprayCan,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";

type Doodle = {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
};

type BrushId = "pen" | "marker" | "highlighter" | "spray";
type CanvasTheme = "light" | "dark";

const BRUSHES: { id: BrushId; label: string; Icon: LucideIcon }[] = [
  { id: "pen", label: "Pen", Icon: Pen },
  { id: "marker", label: "Marker", Icon: Paintbrush },
  { id: "highlighter", label: "Highlighter", Icon: Highlighter },
  { id: "spray", label: "Spray", Icon: SprayCan },
];

// Each brush scales the shared "size" slider by its own character —
// a highlighter is always chunkier than a pen at the same size setting.
const BRUSH_CONFIG: Record<Exclude<BrushId, "spray">, { widthMul: number; alpha: number; cap: CanvasLineCap }> = {
  pen: { widthMul: 1, alpha: 1, cap: "round" },
  marker: { widthMul: 2, alpha: 0.9, cap: "round" },
  highlighter: { widthMul: 3.4, alpha: 0.32, cap: "square" },
};

const CANVAS_BG: Record<CanvasTheme, string> = {
  light: "#fdfbf6",
  dark: "#161320",
};

const DEFAULT_INK: Record<CanvasTheme, string> = {
  light: "#1a1625",
  dark: "#f6f4fb",
};

// Theme accents + a spread of soft pastels, for a proper art-box feel.
const COLORS = [
  "#1a1625",
  "#f6f4fb",
  "#9b8cf9",
  "#e37fae",
  "#f0c27a",
  "#67e8d0",
  "#ffd1dc",
  "#c9e4ff",
  "#fff5ba",
  "#c8f4de",
  "#e3d1ff",
  "#ffdfba",
];

const CANVAS_W = 480;
const CANVAS_H = 300;
const MIN_SIZE = 2;
const MAX_SIZE = 20;

export function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState(COLORS[2]);
  const [brush, setBrush] = useState<BrushId>("pen");
  const [size, setSize] = useState(5);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("light");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState<Doodle[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  function paintBackground(theme: CanvasTheme) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = CANVAS_BG[theme];
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Initial paint — light background, run once on mount.
  useEffect(() => {
    paintBackground("light");
  }, []);

  useEffect(() => {
    fetch("/api/doodles")
      .then((r) => r.json())
      .then((data) => setGallery(data.entries ?? []))
      .catch(() => setGallery([]));
  }, []);

  function pointerPos(e: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }

  function sprayAt(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
    ctx.fillStyle = color;
    const spread = size * 1.3;
    const dot = Math.max(0.6, size * 0.14);
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * spread;
      ctx.globalAlpha = 0.4 + Math.random() * 0.4;
      ctx.beginPath();
      ctx.arc(pos.x + Math.cos(angle) * radius, pos.y + Math.sin(angle) * radius, dot * (0.6 + Math.random() * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function strokeTo(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) {
    const cfg = BRUSH_CONFIG[brush as Exclude<BrushId, "spray">];
    ctx.strokeStyle = color;
    ctx.lineWidth = size * cfg.widthMul;
    ctx.globalAlpha = cfg.alpha;
    ctx.lineCap = cfg.cap;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const pos = pointerPos(e);
    last.current = pos;
    setHasDrawn(true);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (brush === "spray") sprayAt(ctx, pos);
    else strokeTo(ctx, pos, pos); // dot on tap
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const pos = pointerPos(e);

    if (brush === "spray") sprayAt(ctx, pos);
    else strokeTo(ctx, last.current, pos);

    last.current = pos;
  }

  function handlePointerUp() {
    drawing.current = false;
    last.current = null;
  }

  function handleClear() {
    paintBackground(canvasTheme);
    setHasDrawn(false);
  }

  function handleThemeToggle() {
    const next: CanvasTheme = canvasTheme === "light" ? "dark" : "light";
    setCanvasTheme(next);
    // Swap ink color if the current pick would be invisible on the new canvas.
    setColor((c) => (c === DEFAULT_INK[canvasTheme] ? DEFAULT_INK[next] : c));
    paintBackground(next);
    setHasDrawn(false);
  }

  async function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    setStatus("sending");
    setError("");
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const res = await fetch("/api/doodles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dataUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't save that — try again.");
      if (data.entry) setGallery((prev) => [data.entry, ...prev]);
      handleClear();
      setName("");
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that — try again.");
      setStatus("error");
    }
  }

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles size={16} className="text-rosegold-deep" />
        <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">
          Or doodle something 🎨
        </h3>
      </div>

      <div className="glass-raised relative overflow-hidden rounded-[1.75rem] p-5 sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full touch-none rounded-2xl border border-white/15 shadow-inner"
              style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, cursor: "crosshair" }}
            />

            {/* brush picker + canvas theme */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {BRUSHES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBrush(b.id)}
                  aria-label={b.label}
                  title={b.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer ${
                    brush === b.id ? "text-black" : "glass text-ink-soft hover:text-ink"
                  }`}
                  style={brush === b.id ? { background: "var(--gradient-primary)" } : undefined}
                >
                  <b.Icon size={14} />
                </button>
              ))}

              <button
                type="button"
                onClick={handleThemeToggle}
                aria-label={canvasTheme === "light" ? "Switch to dark canvas" : "Switch to light canvas"}
                title={canvasTheme === "light" ? "Dark canvas" : "Light canvas"}
                className="flex h-8 w-8 items-center justify-center rounded-full glass text-ink-soft transition-colors hover:text-ink cursor-pointer"
              >
                {canvasTheme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-ink cursor-pointer"
              >
                <Eraser size={12} /> Clear
              </button>
            </div>

            {/* brush size */}
            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Size</span>
              <input
                type="range"
                min={MIN_SIZE}
                max={MAX_SIZE}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer accent-[var(--color-lavender)]"
              />
              <span
                aria-hidden
                className="rounded-full bg-white/10"
                style={{ width: Math.max(4, size), height: Math.max(4, size) }}
              />
              <span className="w-6 text-right text-[11px] font-medium text-ink-faint">{size}</span>
            </div>

            {/* color picker */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <PaletteIcon size={13} className="mr-0.5 text-ink-faint" />
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Pick color ${c}`}
                  className="h-6 w-6 rounded-full transition-transform hover:scale-110 cursor-pointer"
                  style={{
                    background: c,
                    outline: color === c ? "2px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.15)",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-56">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
              Your name (optional)
              <input
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous artist"
                className="rounded-xl border border-white/10 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lavender-deep"
              />
            </label>
            <button
              type="button"
              onClick={handleSave}
              disabled={status === "sending" || !hasDrawn}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              {status === "sending" ? <Loader2 size={14} className="animate-spin" /> : "🖌️"}
              Pin my doodle
            </button>
            {status === "error" && (
              <p className="flex items-center gap-1.5 text-xs text-blush-deep">
                <AlertCircle size={12} /> {error}
              </p>
            )}
            <p className="text-xs leading-relaxed text-ink-faint">
              Pick a brush, size and color — or flip to a dark canvas — then pin it to the wall below.
            </p>
          </div>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: (i % 8) * 0.03 }}
              className="glass overflow-hidden rounded-2xl p-2 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user-generated data: URLs, not an optimizable static asset */}
              <img src={d.dataUrl} alt={`Doodle by ${d.name}`} className="w-full rounded-xl" />
              <p className="mt-1.5 px-1 text-[11px] font-medium text-ink-faint">by {d.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
