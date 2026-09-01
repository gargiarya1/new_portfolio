"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";
import { profile } from "@/data/portfolio";
import { useResumeModal } from "@/lib/resume-modal-context";

export function ResumeModal() {
  const { isOpen, close } = useResumeModal();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-raised relative flex h-full max-h-[880px] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] shadow-[0_40px_120px_-24px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
              <div>
                <p className="font-display text-base font-medium text-ink sm:text-lg">
                  {profile.name} — Resume
                </p>
                <p className="text-xs text-ink-faint">Updated {profile.resumeUpdated}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:text-lavender-deep sm:inline-flex"
                >
                  <ExternalLink size={13} />
                  Open in tab
                </a>
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  <Download size={13} />
                  Download
                </a>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close resume preview"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full glass text-ink-soft transition-colors hover:text-blush-deep cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* PDF preview */}
            <div className="relative flex-1 bg-[#1a1824]">
              <iframe
                src={`${profile.resumeUrl}#toolbar=0&navpanes=0`}
                title={`${profile.name} resume preview`}
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
