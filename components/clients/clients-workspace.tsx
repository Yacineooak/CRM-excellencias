"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, Search } from "lucide-react";

import { CreateClientForm } from "@/components/clients/create-client-form";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Client, Project } from "@/lib/types";

export function ClientsWorkspace({
  clients,
  projects,
  viewerId,
}: {
  clients: Client[];
  projects: Project[];
  viewerId: string;
}) {
  const [query, setQuery] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        `${client.companyName} ${client.contactName} ${client.industry}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [clients, query],
  );

  const featured = filteredClients[0];
  const linkedProjects = projects.filter((project) => featured?.linkedProjectIds.includes(project.id));

  return (
    <>
      <PageHeader
        actions={<Button onClick={() => setCreateOpen(true)}>Add client</Button>}
        badge="CRM"
        description="Capture lead context, contact details, project history, and account notes in a premium client workspace."
        eyebrow="Clients"
        title="A CRM designed for relationship-first agencies"
      />

      {featured ? (
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Featured account</p>
              <h3 className="mt-2 text-2xl font-semibold">{featured.companyName}</h3>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{featured.notes}</p>
            </div>
            <Badge
              variant={
                featured.status === "active"
                  ? "success"
                  : featured.status === "lead"
                    ? "warning"
                    : "muted"
              }
            >
              {featured.status}
            </Badge>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Primary contact</p>
              <p className="mt-3 text-lg font-semibold">{featured.contactName}</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="size-4" />
                  {featured.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-4" />
                  {featured.phone || "No phone number"}
                </p>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Linked projects</p>
              <div className="mt-4 space-y-3">
                {linkedProjects.length > 0 ? (
                  linkedProjects.map((project) => (
                    <div className="rounded-2xl bg-foreground/5 p-3 dark:bg-white/5" key={project.id}>
                      <p className="font-semibold">{project.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No linked projects yet.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

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
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
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
                  <p>{client.phone || "No phone number"}</p>
                  <p>{client.notes || "No notes yet."}</p>
                </div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Linked projects</span>
                  <span className="font-semibold">{client.linkedProjectIds.length}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/20 p-6 text-sm text-muted-foreground dark:border-white/10">
              No clients found. Create the first client to start using the CRM.
            </div>
          )}
        </div>
      </Card>

      <Dialog
        description="Add a real client record to your CRM."
        onClose={() => setCreateOpen(false)}
        open={isCreateOpen}
        title="Add client"
      >
        <CreateClientForm onSuccess={() => setCreateOpen(false)} ownerId={viewerId} />
      </Dialog>
    </>
  );
}
