"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/types";
import { cn, formatLabel } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "CRM", icon: Building2 },
  { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/tasks", label: "Kanban", icon: ListTodo },
  { href: "/admin", label: "Admin", icon: ShieldCheck, badge: "Core" },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function AppSidebar({
  viewer,
  taskCount,
}: {
    viewer: UserProfile;
  taskCount: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="glass-panel mesh-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-[288px] flex-col rounded-[36px] p-5 xl:flex">
      <BrandLogo />

      <div className="mt-6 rounded-[26px] border border-white/20 bg-background/55 p-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Workspace mode</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Creative delivery</span>
          <span className="rounded-full bg-teal/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">
            Live
          </span>
        </div>
      </div>

      <div className="mt-10 flex-1 space-y-2 overflow-y-auto pr-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex items-center justify-between rounded-[22px] px-4 py-3 text-sm transition-all duration-300",
                isActive
                  ? "bg-[linear-gradient(135deg,#4ab5b8,#2c9598)] text-white shadow-[0_18px_40px_rgba(74,181,184,0.3)]"
                  : "text-muted-foreground hover:-translate-y-0.5 hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/5",
              )}
              href={item.href}
              key={item.href}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full p-2",
                    isActive ? "bg-white/15" : "bg-foreground/5 dark:bg-white/5",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {item.label}
              </span>
              {item.badge ? (
                <Badge className={isActive ? "bg-white/15 text-white" : ""}>{item.badge}</Badge>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 rounded-[30px] border border-white/20 bg-background/60 p-4 dark:bg-background/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">{formatLabel(viewer.role)}</p>
            <h3 className="mt-2 text-lg font-semibold">{taskCount} active tasks</h3>
          </div>
          <div className="rounded-full bg-teal/12 p-2 text-teal">
            <Activity className="size-4" />
          </div>
        </div>
        <div className="mt-4 rounded-[22px] border border-white/15 bg-background/45 px-3 py-3 dark:border-white/10">
          <p className="truncate text-sm font-semibold">{viewer.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Live from Supabase
          </p>
        </div>
      </div>
    </aside>
  );
}
