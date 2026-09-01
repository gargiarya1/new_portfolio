"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { themePresets, defaultThemePreset, type ThemePreset } from "@/data/themePresets";

const STORAGE_KEY = "portfolio-theme-preset";

const cssVarMap: Record<keyof ThemePreset["colors"], string> = {
  lavender: "--color-lavender",
  lavenderDeep: "--color-lavender-deep",
  blush: "--color-blush",
  blushDeep: "--color-blush-deep",
  rosegold: "--color-rosegold",
  rosegoldDeep: "--color-rosegold-deep",
  purple: "--color-purple",
  cyan: "--color-cyan",
};

function readSavedPreset(): ThemePreset {
  if (typeof window === "undefined") return defaultThemePreset;
  try {
    const savedId = window.localStorage.getItem(STORAGE_KEY);
    return themePresets.find((p) => p.id === savedId) ?? defaultThemePreset;
  } catch {
    return defaultThemePreset;
  }
}

type ThemeAccentContextValue = {
  preset: ThemePreset;
  setPreset: (id: string) => void;
};

const ThemeAccentContext = createContext<ThemeAccentContextValue | null>(null);

export function ThemeAccentProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: reads localStorage once, synchronously, for the
  // initial render — avoids a default-then-swap flash and keeps the
  // effect below purely a "sync with the DOM" side effect.
  const [preset, setPresetState] = useState<ThemePreset>(readSavedPreset);

  useEffect(() => {
    const root = document.documentElement;
    for (const [key, cssVar] of Object.entries(cssVarMap) as [keyof ThemePreset["colors"], string][]) {
      root.style.setProperty(cssVar, preset.colors[key]);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, preset.id);
    } catch {
      // localStorage unavailable — palette still applies for this visit
    }
  }, [preset]);

  const setPreset = useCallback((id: string) => {
    setPresetState(themePresets.find((p) => p.id === id) ?? defaultThemePreset);
  }, []);

  const value = useMemo(() => ({ preset, setPreset }), [preset, setPreset]);

  return <ThemeAccentContext.Provider value={value}>{children}</ThemeAccentContext.Provider>;
}

export function useThemeAccent() {
  const ctx = useContext(ThemeAccentContext);
  if (!ctx) throw new Error("useThemeAccent must be used within a ThemeAccentProvider");
  return ctx;
}
