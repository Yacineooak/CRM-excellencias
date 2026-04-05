import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "muted" | "success" | "warning" | "danger";

const styles: Record<BadgeVariant, string> = {
  default: "bg-teal/15 text-teal dark:bg-teal/20",
  muted: "bg-foreground/5 text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  danger: "bg-red-500/15 text-red-600 dark:text-red-300",
};

export function Badge({
  className,
  children,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
