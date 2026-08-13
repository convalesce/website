"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center gap-2 rounded-md font-medium transition-colors duration-150 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "border border-line text-ink hover:bg-ink/[0.04]",
  ghost: "text-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-[14px]",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  event,
  className = "",
  trailing,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  event?: AnalyticsEvent;
  className?: string;
  trailing?: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={event ? () => track(event, { label: String(children) }) : undefined}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {trailing ? (
        <span aria-hidden="true" className="text-[0.9em] opacity-70">
          {trailing}
        </span>
      ) : null}
    </a>
  );
}
