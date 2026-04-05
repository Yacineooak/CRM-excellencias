"use client";

import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NotificationItem } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export function useRealtimeNotifications({
  initialItems,
  userId,
}: {
  initialItems: NotificationItem[];
  userId: string;
}) {
  const [items, setItems] = useState<NotificationItem[]>(initialItems);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase || !userId) {
      return;
    }

    setIsLive(true);

    const channel = supabase
      .channel("agency-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const nextRow = payload.new as {
            id: string;
            title: string;
            body: string;
            kind: NotificationItem["kind"];
            read: boolean;
            created_at: string;
          };

          const nextItem: NotificationItem = {
            id: nextRow.id,
            title: nextRow.title,
            body: nextRow.body,
            kind: nextRow.kind,
            read: nextRow.read,
            createdAt: formatRelativeTime(nextRow.created_at),
          };

          setItems((previous) => [nextItem, ...previous]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  return { items, isLive };
}
