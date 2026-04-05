"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Users2 } from "lucide-react";

import { CreateProjectForm } from "@/components/projects/create-project-form";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import type { WorkspaceSnapshot } from "@/lib/types";
import { formatRelativeDay } from "@/lib/utils";

const statIcons = [ArrowUpRight, BriefcaseBusiness, CheckCircle2, Users2];

export function DashboardWorkspace({ snapshot }: { snapshot: WorkspaceSnapshot }) {
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);

  const stats = useMemo(
    () => [
      {
        label: "Active clients",
        value: String(snapshot.stats.activeClients),
        change: `${snapshot.stats.atRiskProjects} projects at risk`,
      },
      {
        label: "Active projects",
        value: String(snapshot.stats.activeProjects),
        change: `${snapshot.stats.assignedTasks} tasks assigned`,
      },
      {
        label: "Tasks completed",
        value: String(snapshot.stats.tasksCompleted),
        change: `${snapshot.stats.overdueTasks} overdue`,
      },
      {
        label: "Team members",
        value: String(snapshot.stats.teamMembers),
        change: "Role-based dispatch ready",
      },
    ],
    [snapshot.stats],
  );

  function exportReport() {
    const payload = {
      exportedAt: new Date().toISOString(),
      stats: snapshot.stats,
      clients: snapshot.clients,
      projects: snapshot.projects,
      tasks: snapshot.tasks,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agency-dashboard-report.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button onClick={exportReport} variant="secondary">
              Export report
            </Button>
            <Button onClick={() => setCreateProjectOpen(true)}>New project</Button>
          </>
        }
        badge="Live workspace"
        description="Track delivery health, active clients, deadlines, assignments, and team momentum from one elegant command surface."
        eyebrow="Dashboard"
        title="Creative operations, without the chaos"
      />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index];

          return (
            <Card className="relative overflow-hidden p-6" key={stat.label}>
              <div className="absolute right-4 top-4 rounded-full bg-teal/15 p-3 text-teal">
                <Icon className="size-4" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="mt-6 text-3xl font-semibold">{stat.value}</h3>
              <Badge className="mt-4">{stat.change}</Badge>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <Card className="p-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Task throughput</p>
            <h3 className="mt-2 text-2xl font-semibold">Delivery performance over six weeks</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={snapshot.throughput}>
                <defs>
                  <linearGradient id="completedFillLive" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4ab5b8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#4ab5b8" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid opacity={0.12} strokeDasharray="4 4" vertical={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid rgba(74,181,184,0.18)",
                    backgroundColor: "rgba(10,16,19,0.9)",
                  }}
                />
                <Area
                  dataKey="completed"
                  fill="url(#completedFillLive)"
                  stroke="#4ab5b8"
                  strokeWidth={3}
                  type="monotone"
                />
                <Area
                  dataKey="active"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Focus distribution</p>
            <h3 className="mt-2 text-2xl font-semibold">How work is distributed right now</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={snapshot.focus}
                  dataKey="value"
                  innerRadius={64}
                  outerRadius={92}
                  paddingAngle={6}
                >
                  {snapshot.focus.map((item, index) => (
                    <Cell
                      fill={["#4ab5b8", "#8fd9db", "#1f7072", "#d9f3f4"][index]}
                      key={item.name}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid rgba(74,181,184,0.18)",
                    backgroundColor: "rgba(10,16,19,0.9)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3">
            {snapshot.focus.map((item) => (
              <div className="flex items-center justify-between text-sm" key={item.name}>
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 2xl:grid-cols-2">
        <Card className="p-6">
          <div className="mb-5">
            <p className="text-sm text-muted-foreground">My queue</p>
            <h3 className="mt-2 text-2xl font-semibold">Assigned tasks and deadlines</h3>
          </div>
          <div className="space-y-3">
            {snapshot.tasks.filter((task) => task.assigneeId === snapshot.viewer.id).slice(0, 5).map((task) => (
              <div
                className="rounded-2xl border border-white/20 bg-background/40 p-4 dark:border-white/10"
                key={task.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{task.projectName}</p>
                  </div>
                  <div className="text-right text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    <p>{task.priority}</p>
                    <p className="mt-2">{task.dueDate ? formatRelativeDay(task.dueDate) : "No due date"}</p>
                  </div>
                </div>
              </div>
            ))}
            {snapshot.tasks.filter((task) => task.assigneeId === snapshot.viewer.id).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 p-4 text-sm text-muted-foreground dark:border-white/10">
                You have no assigned tasks yet.
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5">
            <p className="text-sm text-muted-foreground">Activity</p>
            <h3 className="mt-2 text-2xl font-semibold">Recent team movement</h3>
          </div>
          <div className="space-y-4">
            {snapshot.activity.length > 0 ? (
              snapshot.activity.map((item) => (
                <div className="flex gap-4 rounded-2xl border border-white/20 p-4 dark:border-white/10" key={item.id}>
                  <div className="mt-1 size-2 rounded-full bg-teal" />
                  <div className="space-y-1">
                    <p className="text-sm leading-6">
                      <span className="font-semibold">{item.actor}</span> {item.message}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      <span>{item.context}</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 p-4 text-sm text-muted-foreground dark:border-white/10">
                No activity yet. New actions will appear here once your team starts creating records.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Dialog
        description="Create a real project record in Supabase and assign team members immediately."
        onClose={() => setCreateProjectOpen(false)}
        open={isCreateProjectOpen}
        title="Create project"
      >
        <CreateProjectForm
          clients={snapshot.clients}
          currentUserId={snapshot.viewer.id}
          onSuccess={() => setCreateProjectOpen(false)}
          users={snapshot.users}
        />
      </Dialog>
    </>
  );
}
