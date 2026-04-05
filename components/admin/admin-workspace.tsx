"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, ShieldCheck, UserRound } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActivityItem, Project, Task, UserProfile } from "@/lib/types";
import { formatLabel } from "@/lib/utils";

const tabs = ["users", "projects", "analytics"] as const;

export function AdminWorkspace({
  activity,
  currentUserId,
  projects,
  tasks,
  users,
}: {
  activity: ActivityItem[];
  currentUserId: string;
  projects: Project[];
  tasks: Task[];
  users: UserProfile[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("users");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isLogsOpen, setLogsOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [signupUrl, setSignupUrl] = useState("/signup");
  const [copied, setCopied] = useState(false);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()) &&
          (roleFilter === "all" || user.role === roleFilter),
      ),
    [query, roleFilter, users],
  );

  const filteredProjects = useMemo(
    () => projects.filter((project) => projectFilter === "all" || project.status === projectFilter),
    [projectFilter, projects],
  );

  async function updateUserRole(userId: string, role: UserProfile["role"]) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    await supabase.from("users").update({ role }).eq("id", userId);
    await supabase.from("activity_logs").insert({
      actor_id: currentUserId,
      entity_type: "user",
      entity_id: userId,
      action: `role_changed_to_${role}`,
      metadata: { title: "User role updated" },
    });
    router.refresh();
  }

  useEffect(() => {
    setSignupUrl(`${window.location.origin}/signup`);
  }, []);

  useEffect(() => {
    if (isInviteOpen) {
      setCopied(false);
    }
  }, [isInviteOpen]);

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button onClick={() => setLogsOpen(true)} variant="secondary">
              View logs
            </Button>
            <Button onClick={() => setInviteOpen(true)}>Invite user</Button>
          </>
        }
        badge="Admin only"
        description="Manage users, roles, project control, analytics, and system activity through one dedicated admin surface."
        eyebrow="Admin"
        title="Full control of the agency operating system"
      />

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
                    ? "bg-[linear-gradient(135deg,#4ab5b8,#2c9598)] text-white shadow-[0_14px_28px_rgba(74,181,184,0.28)]"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/8 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
                }`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {formatLabel(tab)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "users" ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <Input onChange={(event) => setQuery(event.target.value)} placeholder="Search users or roles" />
              <Select
                icon={<ShieldCheck className="size-3.5" />}
                onChange={(event) => setRoleFilter(event.target.value)}
                value={roleFilter}
              >
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
                  <div className="flex flex-wrap items-center gap-3">
                    <Select
                      defaultValue={user.role}
                      icon={<UserRound className="size-3.5" />}
                      onChange={(event) => updateUserRole(user.id, event.target.value as UserProfile["role"])}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="team_member">Team Member</option>
                    </Select>
                    <Badge>{user.availability}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "projects" ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)]">
              <Select
                icon={<BriefcaseBusiness className="size-3.5" />}
                onChange={(event) => setProjectFilter(event.target.value)}
                value={projectFilter}
              >
                <option value="all">All project statuses</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="at_risk">At risk</option>
                <option value="completed">Completed</option>
              </Select>
              <div className="rounded-[24px] border border-white/20 bg-background/45 px-4 py-3 dark:border-white/10">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Visible portfolio</p>
                <p className="mt-2 text-lg font-semibold">{filteredProjects.length} projects</p>
              </div>
            </div>
            {filteredProjects.map((project) => (
              <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10" key={project.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.description || "No project summary yet."}
                    </p>
                  </div>
                  <Badge variant={project.health === "Watch" ? "warning" : "success"}>
                    {project.health}
                  </Badge>
                </div>
                <div className="mt-4">
                  <Progress tone={project.health === "Watch" ? "amber" : "teal"} value={project.progress} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium dark:bg-white/5">
                    {formatLabel(project.status)}
                  </span>
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                    {project.clientName}
                  </span>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/20 p-4 text-sm text-muted-foreground dark:border-white/10">
                No projects match this admin filter.
              </div>
            ) : null}
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
                {tasks.length > 0
                  ? Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100)
                  : 0}
                %
              </h4>
            </Card>
          </div>
        ) : null}
      </Card>

      <Dialog
        description="Recent activity written by the real application."
        onClose={() => setLogsOpen(false)}
        open={isLogsOpen}
        title="System activity logs"
      >
        <div className="space-y-3">
          {activity.length > 0 ? (
            activity.map((item) => (
              <div className="rounded-2xl border border-white/20 p-4 dark:border-white/10" key={item.id}>
                <p className="text-sm">
                  <span className="font-semibold">{item.actor}</span> {item.message}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {item.context} | {item.timestamp}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No logs yet.</p>
          )}
        </div>
      </Dialog>

      <Dialog
        description="Use your public signup page to onboard a new teammate without a service-role key."
        onClose={() => setInviteOpen(false)}
        open={isInviteOpen}
        title="Invite a user"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this signup link with your teammate. They can create their account and you can assign
            their role from this admin panel.
          </p>
          <Input readOnly value={signupUrl} />
          <div className="flex justify-end">
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(signupUrl);
                setCopied(true);
                setInviteOpen(false);
              }}
              type="button"
            >
              {copied ? "Copied" : "Copy signup link"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
