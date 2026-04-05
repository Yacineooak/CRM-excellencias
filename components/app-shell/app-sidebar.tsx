"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "CRM", icon: Building2 },
  { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/tasks", label: "Kanban", icon: Settings },
  { href: "/admin", label: "Admin", icon: ShieldCheck, badge: "Core" },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-[280px] flex-col rounded-[32px] p-5 xl:flex">
      <BrandLogo />

      <div className="mt-10 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all",
                isActive
                  ? "bg-teal text-white shadow-teal"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/5",
              )}
              href={item.href}
              key={item.href}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                {item.label}
              </span>
              {item.badge ? (
                <Badge className={isActive ? "bg-white/15 text-white" : ""}>{item.badge}</Badge>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto rounded-[28px] border border-white/20 bg-background/60 p-4 dark:bg-background/40">
        <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Launch pulse</p>
        <h3 className="mt-3 text-xl font-semibold">14 tasks this week</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Stay ahead of client feedback with the live admin and notification stack.
        </p>
      </div>
    </aside>
  );
}
