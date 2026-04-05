import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mesh-panel relative overflow-hidden rounded-[32px] border border-white/20 px-6 py-7 shadow-[0_24px_60px_rgba(8,24,25,0.08)] dark:border-white/10">
      <div className="absolute inset-y-0 right-0 hidden w-64 bg-[radial-gradient(circle_at_center,rgba(74,181,184,0.16),transparent_62%)] lg:block" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</p>
            {badge ? <Badge>{badge}</Badge> : null}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
      </div>
    </div>
  );
}
