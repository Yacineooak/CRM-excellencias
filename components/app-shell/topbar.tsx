"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import type { UserProfile } from "@/lib/types";

export function Topbar({ viewer }: { viewer: UserProfile }) {
  const { setCommandPaletteOpen } = useUiStore();

  return (
    <div className="glass-panel mesh-panel sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 rounded-[30px] px-4 py-3">
      <button
        className="hidden min-w-[320px] items-center gap-3 rounded-full border border-white/20 bg-background/60 px-4 py-2.5 text-sm text-muted-foreground transition hover:-translate-y-0.5 hover:text-foreground lg:flex"
        onClick={() => setCommandPaletteOpen(true)}
        type="button"
      >
        <Search className="size-4" />
        Search projects, tasks, people
        <span className="ml-auto rounded-full bg-foreground/5 px-2 py-1 text-xs dark:bg-white/10">
          Ctrl K
        </span>
      </button>

      <div className="flex items-center gap-3">
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
  );
}
