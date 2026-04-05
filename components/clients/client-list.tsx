"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clients } from "@/lib/mock-data";

export function ClientList() {
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        `${client.companyName} ${client.contactName} ${client.industry}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Client directory</p>
          <h3 className="mt-2 text-2xl font-semibold">Manage leads and active accounts</h3>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients"
            value={query}
          />
        </div>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {filteredClients.map((client) => (
          <div
            className="rounded-[28px] border border-white/20 bg-background/40 p-5 dark:border-white/10"
            key={client.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{client.industry}</p>
                <h4 className="mt-2 text-xl font-semibold">{client.companyName}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{client.contactName}</p>
              </div>
              <Badge
                variant={
                  client.status === "active"
                    ? "success"
                    : client.status === "lead"
                      ? "warning"
                      : "muted"
                }
              >
                {client.status}
              </Badge>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
              <p>{client.email}</p>
              <p>{client.phone}</p>
              <p>{client.notes}</p>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Lifetime spend</span>
              <span className="font-semibold">{client.spend}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
