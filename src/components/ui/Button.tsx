import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: ReactNode;
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  icon,
  external,
  className,
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer";

  const styles =
    variant === "primary"
      ? "text-white shadow-[0_8px_30px_-8px_rgba(139,111,179,0.55)] hover:shadow-[0_12px_40px_-6px_rgba(139,111,179,0.65)] hover:-translate-y-0.5"
      : "glass text-ink hover:text-lavender-deep hover:-translate-y-0.5";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(base, styles, className)}
    >
      {variant === "primary" && (
        <span
          className="absolute inset-0 rounded-full -z-10"
          style={{ background: "var(--gradient-primary)" }}
        />
      )}
      {children}
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </Link>
  );
}
