"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { themePresets } from "@/data/themePresets";
import { useThemeAccent } from "@/lib/theme-accent-context";

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const { preset, setPreset } = useThemeAccent();

  return (
    <div className="fixed bottom-24 right-5 z-40 sm:bottom-28 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-raised absolute bottom-16 right-0 w-60 rounded-2xl p-4 shadow-2xl"
          >
            <p className="mb-1 text-sm font-semibold text-ink">Pick your palette</p>
            <p className="mb-3 text-xs text-ink-faint">Applied instantly, just for you.</p>
            <div className="grid grid-cols-3 gap-2.5">
              {themePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  className="group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-white/5 cursor-pointer"
                  aria-label={`Use ${p.label} palette`}
                >
                  <span
                    className="relative flex h-9 w-9 items-center justify-center rounded-full shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${p.colors.lavender}, ${p.colors.blush}, ${p.colors.rosegold})`,
                    }}
                  >
                    {preset.id === p.id && (
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-black/25">
                        <Check size={14} className="text-white" />
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-medium text-ink-soft group-hover:text-ink">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Choose color palette"
        aria-expanded={open}
        className="glass-raised flex h-12 w-12 items-center justify-center rounded-full text-ink shadow-xl cursor-pointer"
      >
        <Palette size={19} />
      </motion.button>
    </div>
  );
}
