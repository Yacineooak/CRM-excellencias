"use client";

import { useEffect, useState } from "react";

import { notifications as fallbackNotifications } from "@/lib/mock-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NotificationItem } from "@/lib/types";

export function useRealtimeNotifications() {
  const [items, setItems] = useState<NotificationItem[]>(fallbackNotifications);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
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
        },
        (payload) => {
          const nextItem = payload.new as NotificationItem;
          setItems((previous) => [nextItem, ...previous]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return { items, isLive };
}
