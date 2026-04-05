"use client";

import { Search } from "lucide-react";

import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { useUiStore } from "@/store/ui-store";

export function Topbar() {
  const { setCommandPaletteOpen } = useUiStore();

  return (
    <div className="glass-panel sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 rounded-[28px] px-4 py-3">
      <button
        className="hidden min-w-[260px] items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground lg:flex"
        onClick={() => setCommandPaletteOpen(true)}
        type="button"
      >
        <Search className="size-4" />
        Search workspace
        <span className="ml-auto rounded-full bg-foreground/5 px-2 py-1 text-xs dark:bg-white/10">
          Ctrl K
        </span>
      </button>

      <div className="flex items-center gap-3">
        <Button className="lg:hidden" size="icon" variant="secondary" onClick={() => setCommandPaletteOpen(true)}>
          <Search className="size-4" />
        </Button>
        <ThemeToggle />
        <div className="flex items-center gap-3 rounded-full border border-white/20 px-2 py-1.5 dark:border-white/10">
          <Avatar alt={currentUser.name} className="size-10" src={currentUser.avatarUrl} />
          <div className="hidden pr-2 sm:block">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
