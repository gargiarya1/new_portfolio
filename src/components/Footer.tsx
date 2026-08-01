"use client";

import { Mail, ArrowUp } from "lucide-react";
import { profile } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const links = [
  { icon: GithubIcon, href: profile.github, label: "GitHub" },
  { icon: LinkedinIcon, href: profile.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-lavender/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <a href="#home" className="font-display text-lg font-semibold text-ink">
          Gargi<span className="text-gradient">.</span>
        </a>

        <div className="flex items-center gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="flex h-10 w-10 items-center justify-center rounded-full glass text-ink-soft transition-colors hover:text-lavender-deep"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} {profile.name}. Crafted with care in Jaipur.
        </p>

        <a
          href="#home"
          aria-label="Back to top"
          className="flex h-10 w-10 items-center justify-center rounded-full glass text-ink-soft transition-colors hover:text-lavender-deep"
        >
          <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
}
