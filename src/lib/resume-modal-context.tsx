"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ResumeModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ResumeModalContext = createContext<ResumeModalContextValue | null>(null);

export function ResumeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return <ResumeModalContext.Provider value={value}>{children}</ResumeModalContext.Provider>;
}

export function useResumeModal() {
  const ctx = useContext(ResumeModalContext);
  if (!ctx) {
    throw new Error("useResumeModal must be used within a ResumeModalProvider");
  }
  return ctx;
}
