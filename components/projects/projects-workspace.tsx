"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";

import { CreateProjectForm } from "@/components/projects/create-project-form";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import type { Client, Project, UserProfile } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/utils";

export function ProjectsWorkspace({
  clients,
  currentUserId,
  projects,
  users,
}: {
  clients: Client[];
  currentUserId: string;
  projects: Project[];
  users: UserProfile[];
}) {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleProjects = useMemo(
    () => projects.filter((project) => statusFilter === "all" || project.status === statusFilter),
    [projects, statusFilter],
  );

  const sortedByDeadline = useMemo(
    () =>
      [...visibleProjects].sort((left, right) =>
        new Date(left.deadline ?? "2100-01-01").getTime() -
        new Date(right.deadline ?? "2100-01-01").getTime(),
      ),
    [visibleProjects],
  );

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button onClick={() => setCalendarMode((current) => !current)} variant="secondary">
              {calendarMode ? "Card view" : "View calendar"}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>Create project</Button>
          </>
        }
        badge="Portfolio"
        description="Review delivery health, ownership, timelines, and assigned teams across all client engagements."
        eyebrow="Projects"
        title="Project delivery with visibility built in"
      />

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Portfolio focus</p>
            <h3 className="mt-2 text-2xl font-semibold">Track delivery by status and team load</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <Select
              icon={<BriefcaseBusiness className="size-3.5" />}
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="all">All project statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="at_risk">At risk</option>
              <option value="completed">Completed</option>
            </Select>
            <div className="rounded-[24px] border border-white/20 bg-background/45 px-4 py-3 dark:border-white/10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Visible projects</p>
              <p className="mt-2 text-lg font-semibold">{visibleProjects.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {calendarMode ? (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Deadline calendar</p>
          <h3 className="mt-2 text-2xl font-semibold">Upcoming project milestones</h3>
          <div className="mt-6 space-y-4">
            {sortedByDeadline.map((project) => (
              <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10" key={project.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{project.clientName}</p>
                    <p className="mt-1 text-lg font-semibold">{project.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Deadline</p>
                    <p className="mt-1 font-semibold">
                      {project.deadline ? formatDate(project.deadline) : "No deadline"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleProjects.map((project) => {
            const team = users.filter((user) => project.teamMemberIds.includes(user.id));

            return (
              <Card className="p-6" key={project.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{project.clientName}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{project.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge
                    variant={
                      project.health === "Critical"
                        ? "danger"
                        : project.health === "Watch"
                          ? "warning"
                          : "success"
                    }
                  >
                    {formatLabel(project.status)}
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress
                    tone={
                      project.health === "Critical" ? "red" : project.health === "Watch" ? "amber" : "teal"
                    }
                    value={project.progress}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Deadline</p>
                    <p className="mt-2 font-semibold">
                      {project.deadline ? formatDate(project.deadline) : "No deadline"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Team size</p>
                    <p className="mt-2 font-semibold">{team.length} members</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Health</p>
                    <p className="mt-2 font-semibold">{project.health}</p>
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
          {visibleProjects.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/20 p-6 text-sm text-muted-foreground dark:border-white/10">
              No projects match this filter yet.
            </div>
          ) : null}
        </div>
      )}

      <Dialog
        description="Create a project and assign the initial delivery team."
        onClose={() => setCreateOpen(false)}
        open={isCreateOpen}
        title="Create project"
      >
        <CreateProjectForm
          clients={clients}
          currentUserId={currentUserId}
          onSuccess={() => setCreateOpen(false)}
          users={users}
        />
      </Dialog>
    </>
  );
}
