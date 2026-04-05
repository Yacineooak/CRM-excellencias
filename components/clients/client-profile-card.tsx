import { Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { clients, projects } from "@/lib/mock-data";

export function ClientProfileCard() {
  const featured = clients[0];
  const linkedProjects = projects.filter((project) => featured.linkedProjectIds.includes(project.id));

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Featured account</p>
          <h3 className="mt-2 text-2xl font-semibold">{featured.companyName}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{featured.notes}</p>
        </div>
        <Badge variant="success">{featured.status}</Badge>
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
              {featured.phone}
            </p>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Linked projects</p>
          <div className="mt-4 space-y-3">
            {linkedProjects.map((project) => (
              <div className="rounded-2xl bg-foreground/5 p-3 dark:bg-white/5" key={project.id}>
                <p className="font-semibold">{project.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
