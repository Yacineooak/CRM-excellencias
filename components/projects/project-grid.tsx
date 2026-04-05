import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { clients, projects, users } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function ProjectGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {projects.map((project) => {
        const client = clients.find((item) => item.id === project.clientId);
        const team = users.filter((user) => project.teamMemberIds.includes(user.id));

        return (
          <Card className="p-6" key={project.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{client?.companyName}</p>
                <h3 className="mt-2 text-2xl font-semibold">{project.name}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.description}</p>
              </div>
              <Badge
                variant={
                  project.status === "active"
                    ? "success"
                    : project.status === "at_risk"
                      ? "warning"
                      : "muted"
                }
              >
                {project.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{project.progress}%</span>
              </div>
              <Progress
                tone={project.health === "Watch" ? "amber" : "teal"}
                value={project.progress}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Deadline</p>
                <p className="mt-2 font-semibold">{formatDate(project.deadline)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Budget</p>
                <p className="mt-2 font-semibold">{project.budget}</p>
              </div>
              <div className="flex -space-x-3">
                {team.map((member) => (
                  <Avatar alt={member.name} className="size-10" key={member.id} src={member.avatarUrl} />
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
