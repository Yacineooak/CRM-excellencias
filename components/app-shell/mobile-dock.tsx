"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Building2, LayoutDashboard, ListTodo, UserCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function MobileDock({ taskCount }: { taskCount: number }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-3 bottom-3 z-30 xl:hidden">
      <div className="glass-panel mesh-panel rounded-[28px] px-3 py-2 shadow-[0_24px_44px_rgba(7,17,19,0.16)]">
        <div className="mb-2 flex items-center justify-between px-2 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Dispatch hub
          </p>
          <span className="rounded-full bg-teal/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">
            {taskCount} tasks
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[20px] px-2 py-2.5 text-[11px] font-medium transition-[transform,background-color,color,box-shadow] duration-100",
                  isActive
                    ? "bg-[linear-gradient(135deg,#4ab5b8,#2c9598)] text-white shadow-[0_14px_30px_rgba(74,181,184,0.28)]"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/5",
                )}
                href={item.href}
                key={item.href}
              >
                <span className={cn("rounded-full p-2", isActive ? "bg-white/15" : "bg-foreground/5 dark:bg-white/5")}>
                  <Icon className="size-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
