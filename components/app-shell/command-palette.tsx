"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";

import { useUiStore } from "@/store/ui-store";

const quickActions = [
  { title: "Open dashboard", href: "/dashboard" },
  { title: "Review CRM leads", href: "/clients" },
  { title: "Open Kanban board", href: "/tasks" },
  { title: "Jump to admin center", href: "/admin" },
];

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUiStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-background/60 px-4 pt-20 backdrop-blur-xl"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel w-full max-w-2xl rounded-[32px] p-4"
            initial={{ y: 12, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 dark:border-white/10">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search clients, projects, and commands..."
              />
            </div>

            <div className="mt-4 space-y-2">
              {quickActions.map((action) => (
                <Link
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition hover:bg-foreground/5 dark:hover:bg-white/5"
                  href={action.href}
                  key={action.href}
                  onClick={() => setCommandPaletteOpen(false)}
                >
                  <span>{action.title}</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
