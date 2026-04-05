"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import type { UserProfile } from "@/lib/types";

export function Topbar({
  assignedTasks,
  overdueTasks,
  viewer,
}: {
  assignedTasks: number;
  overdueTasks: number;
  viewer: UserProfile;
}) {
  const { setCommandPaletteOpen } = useUiStore();

  return (
    <div className="glass-panel mesh-panel sticky top-4 z-20 mb-6 rounded-[32px] px-4 py-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          className="flex min-h-14 w-full items-center gap-3 rounded-[24px] border border-white/25 bg-background/65 px-4 py-3 text-sm text-muted-foreground transition hover:-translate-y-0.5 hover:border-teal/25 hover:text-foreground lg:max-w-[420px]"
          onClick={() => setCommandPaletteOpen(true)}
          type="button"
        >
          <span className="rounded-full bg-teal/12 p-2 text-teal">
            <Search className="size-4" />
          </span>
          <span className="text-left">
            <span className="block font-semibold text-foreground">Search projects, tasks, or people</span>
            <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Command palette
            </span>
          </span>
          <span className="ml-auto hidden rounded-full bg-foreground/5 px-2 py-1 text-xs dark:bg-white/10 sm:block">
            Ctrl K
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden rounded-[22px] border border-white/20 bg-background/55 px-4 py-2.5 dark:border-white/10 lg:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Dispatch pulse</p>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="font-semibold">{assignedTasks} assigned</span>
              <span className="text-muted-foreground">{overdueTasks} overdue</span>
            </div>
          </div>
          <Button className="lg:hidden" size="icon" variant="secondary" onClick={() => setCommandPaletteOpen(true)}>
            <Search className="size-4" />
          </Button>
          <ThemeToggle />
          <Link
            className="flex items-center gap-3 rounded-full border border-white/20 bg-background/55 px-2 py-1.5 transition hover:-translate-y-0.5 hover:bg-foreground/5 dark:border-white/10 dark:hover:bg-white/5"
            href="/profile"
          >
            <Avatar alt={viewer.name} className="size-10" src={viewer.avatarUrl} />
            <div className="hidden pr-2 sm:block">
              <p className="text-sm font-semibold">{viewer.name}</p>
              <p className="text-xs text-muted-foreground">{viewer.title}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
