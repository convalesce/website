"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { outside } from "@/lib/content";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center gap-2 rounded-md font-medium transition-colors duration-150 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "border border-ink/25 bg-bg/60 text-ink hover:border-ink/40 hover:bg-ink/[0.06]",
  ghost: "text-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-small",
  md: "h-11 px-5 text-small",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  event,
  label,
  className = "",
  trailing,
  beta = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  event?: AnalyticsEvent;
  /** analytics label when children is not a plain string */
  label?: string;
  className?: string;
  trailing?: ReactNode;
  /** marks the product behind the button as in beta */
  beta?: boolean;
}) {
  const analyticsLabel = label ?? (typeof children === "string" ? children : "");

  return (
    <a
      href={href}
      {...outside(href)}
      onClick={event ? () => track(event, { label: analyticsLabel }) : undefined}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {beta ? (
        <span className="mono-label rounded-sm border border-current/60 !text-current px-1.5 py-0.5 text-[0.65rem] leading-none">
          Beta
        </span>
      ) : null}
      {trailing ? (
        <span aria-hidden="true" className="inline-flex items-center text-[0.9em] opacity-70">
          {trailing}
        </span>
      ) : null}
    </a>
  );
}
