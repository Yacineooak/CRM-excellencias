"use client";

import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { projects, tasks, users } from "@/lib/mock-data";

const tabs = ["users", "projects", "analytics"] as const;

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("users");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()) &&
        (roleFilter === "all" || user.role === roleFilter),
      ),
    [query, roleFilter],
  );

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Control center</p>
          <h3 className="mt-2 text-2xl font-semibold">Admin management console</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeTab === tab
                  ? "bg-teal text-white shadow-teal"
                  : "bg-foreground/5 text-muted-foreground dark:bg-white/5"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "users" ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users or roles"
            />
            <Select onChange={(event) => setRoleFilter(event.target.value)} value={roleFilter}>
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="team_member">Team Member</option>
            </Select>
          </div>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/20 p-4 dark:border-white/10"
                key={user.id}
              >
                <div className="flex items-center gap-4">
                  <Avatar alt={user.name} className="size-12" src={user.avatarUrl} />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{user.role.replace("_", " ")}</Badge>
                  <span className="text-sm text-muted-foreground">{user.activity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "projects" ? (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-teal px-4 py-2 text-sm text-white shadow-teal" type="button">
              Create project
            </button>
            <button
              className="rounded-full bg-foreground/5 px-4 py-2 text-sm text-muted-foreground dark:bg-white/5"
              type="button"
            >
              Reassign members
            </button>
            <button
              className="rounded-full bg-foreground/5 px-4 py-2 text-sm text-muted-foreground dark:bg-white/5"
              type="button"
            >
              Archive completed
            </button>
          </div>
          {projects.map((project) => (
            <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10" key={project.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <Badge variant={project.health === "Watch" ? "warning" : "success"}>
                  {project.health}
                </Badge>
              </div>
              <div className="mt-4">
                <Progress tone={project.health === "Watch" ? "amber" : "teal"} value={project.progress} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "analytics" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">Total users</p>
            <h4 className="mt-4 text-3xl font-semibold">{users.length}</h4>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">Active projects</p>
            <h4 className="mt-4 text-3xl font-semibold">
              {projects.filter((project) => project.status === "active").length}
            </h4>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">Tasks progress</p>
            <h4 className="mt-4 text-3xl font-semibold">
              {Math.round(
                (tasks.filter((task) => task.status === "done").length / tasks.length) * 100,
              )}
              %
            </h4>
          </Card>
        </div>
      ) : null}
    </Card>
  );
}
