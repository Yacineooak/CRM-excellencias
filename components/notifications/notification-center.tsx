"use client";

import { Bell, Radio } from "lucide-react";

import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import type { NotificationItem } from "@/lib/types";

export function NotificationCenter({
  initialItems,
  userId,
}: {
  initialItems: NotificationItem[];
  userId: string;
}) {
  const { items, isLive } = useRealtimeNotifications({ initialItems, userId });
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <Card className="hidden min-w-[320px] lg:block">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-teal/15 p-2 text-teal">
            <Bell className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">{unreadCount} unread updates</p>
          </div>
        </div>
        <Badge variant={isLive ? "success" : "muted"}>
          {isLive ? (
            <span className="flex items-center gap-2">
              <Radio className="size-3" />
              Live
            </span>
          ) : (
            "Preview"
          )}
        </Badge>
      </div>

      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              className="rounded-2xl border border-white/20 bg-background/50 p-3 dark:border-white/10"
              key={item.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
                {!item.read ? <span className="mt-1 size-2 rounded-full bg-teal" /> : null}
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {item.createdAt}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 bg-background/30 p-5 text-sm text-muted-foreground dark:border-white/10">
            No notifications yet. Task assignments and mentions will appear here.
          </div>
        )}
      </div>
    </Card>
  );
}
