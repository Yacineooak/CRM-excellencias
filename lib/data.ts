import { unstable_noStore as noStore } from "next/cache";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActivityItem,
  Client,
  DashboardStats,
  FocusPoint,
  NotificationItem,
  Project,
  Role,
  Task,
  ThroughputPoint,
  UserProfile,
  WorkspaceSnapshot,
} from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

type DbUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  avatar_url: string | null;
  title: string | null;
  bio: string | null;
  activity_status: string | null;
  created_at: string;
};

type DbClient = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  status: Client["status"];
  industry: string | null;
  notes: string | null;
  owner_id: string | null;
  created_at: string;
};

type DbProject = {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: Project["status"];
  deadline: string | null;
  progress: number;
  owner_id: string | null;
  created_at: string;
};

type DbProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
};

type DbTask = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: Task["status"];
  priority: Task["priority"];
  assignee_id: string | null;
  due_date: string | null;
  attachments_count: number;
  created_at: string;
};

type DbComment = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

type DbNotification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  kind: NotificationItem["kind"];
  read: boolean;
  created_at: string;
};

type DbActivity = {
  id: string;
  actor_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function mapUser(row: DbUser): UserProfile {
  return {
    id: row.id,
    name: row.name ?? "Unnamed user",
    email: row.email ?? "",
    role: row.role,
    avatarUrl:
      row.avatar_url ??
      `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(row.name ?? row.email ?? row.id)}`,
    title: row.title ?? "Team member",
    bio: row.bio ?? "",
    availability: row.activity_status ?? "Available",
    createdAt: row.created_at,
  };
}

function deriveProjectHealth(project: DbProject): Project["health"] {
  if (project.status === "at_risk") return "Critical";

  if (project.deadline) {
    const daysUntilDeadline = Math.ceil(
      (new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilDeadline <= 3 && project.status !== "completed" && project.progress < 80) {
      return "Watch";
    }
  }

  return "Healthy";
}

function buildThroughput(tasks: DbTask[]): ThroughputPoint[] {
  const weeks: ThroughputPoint[] = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset * 7);
    const weekStart = new Date(date);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const inWeek = tasks.filter((task) => {
      const createdAt = new Date(task.created_at).getTime();
      return createdAt >= weekStart.getTime() && createdAt < weekEnd.getTime();
    });

    weeks.push({
      label: weekStart.toLocaleDateString("en", { month: "short", day: "numeric" }),
      completed: inWeek.filter((task) => task.status === "done").length,
      active: inWeek.filter((task) => task.status !== "done").length,
    });
  }

  return weeks;
}

function buildFocus(tasks: DbTask[]): FocusPoint[] {
  const total = tasks.length || 1;

  const buckets = [
    { name: "To do", count: tasks.filter((task) => task.status === "todo").length },
    { name: "In progress", count: tasks.filter((task) => task.status === "in_progress").length },
    { name: "Review", count: tasks.filter((task) => task.status === "review").length },
    { name: "Done", count: tasks.filter((task) => task.status === "done").length },
  ];

  return buckets.map((bucket) => ({
    name: bucket.name,
    value: Math.round((bucket.count / total) * 100),
  }));
}

function buildStats(projects: DbProject[], tasks: DbTask[], users: DbUser[]): DashboardStats {
  const activeClients = new Set(
    projects.filter((project) => project.status === "active").map((project) => project.client_id),
  ).size;
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const tasksCompleted = tasks.filter((task) => task.status === "done").length;
  const overdueTasks = tasks.filter(
    (task) => task.due_date && new Date(task.due_date).getTime() < Date.now() && task.status !== "done",
  ).length;
  const assignedTasks = tasks.filter((task) => Boolean(task.assignee_id)).length;

  return {
    activeClients,
    activeProjects,
    tasksCompleted,
    teamMembers: users.length,
    atRiskProjects: projects.filter((project) => project.status === "at_risk").length,
    overdueTasks,
    assignedTasks,
  };
}

export async function getWorkspaceSnapshot(): Promise<WorkspaceSnapshot | null> {
  noStore();

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [
    currentUserResponse,
    usersResponse,
    clientsResponse,
    projectsResponse,
    projectMembersResponse,
    tasksResponse,
    commentsResponse,
    notificationsResponse,
    activityResponse,
  ] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("project_members").select("*"),
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("comments").select("*").order("created_at", { ascending: false }),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(12),
  ]);

  const dbUsers = (usersResponse.data ?? []) as DbUser[];
  const dbClients = (clientsResponse.data ?? []) as DbClient[];
  const dbProjects = (projectsResponse.data ?? []) as DbProject[];
  const dbProjectMembers = (projectMembersResponse.data ?? []) as DbProjectMember[];
  const dbTasks = (tasksResponse.data ?? []) as DbTask[];
  const dbComments = (commentsResponse.data ?? []) as DbComment[];
  const dbNotifications = (notificationsResponse.data ?? []) as DbNotification[];
  const dbActivity = (activityResponse.data ?? []) as DbActivity[];

  const users = dbUsers.map(mapUser);
  const projectsById = new Map(dbProjects.map((project) => [project.id, project]));
  const fallbackViewer: UserProfile = {
    id: user.id,
    name: String(user.user_metadata.name ?? user.email?.split("@")[0] ?? "User"),
    email: user.email ?? "",
    role: (user.user_metadata.role as Role | undefined) ?? "team_member",
    avatarUrl:
      user.user_metadata.avatar_url ??
      `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
        String(user.user_metadata.name ?? user.email ?? user.id),
      )}`,
    title: "Team member",
    bio: "",
    availability: "Available",
  };
  const viewer = currentUserResponse.data ? mapUser(currentUserResponse.data as DbUser) : fallbackViewer;
  const normalizedUsers = users.some((profile) => profile.id === viewer.id) ? users : [viewer, ...users];
  const usersById = new Map(normalizedUsers.map((profile) => [profile.id, profile]));

  const projects: Project[] = dbProjects.map((project) => ({
    id: project.id,
    clientId: project.client_id,
    clientName:
      dbClients.find((client) => client.id === project.client_id)?.company_name ?? "Unassigned client",
    name: project.name,
    description: project.description ?? "",
    status: project.status,
    deadline: project.deadline,
    progress: project.progress,
    health: deriveProjectHealth(project),
    teamMemberIds: dbProjectMembers
      .filter((member) => member.project_id === project.id)
      .map((member) => member.user_id),
    ownerId: project.owner_id,
    createdAt: project.created_at,
  }));

  const clients: Client[] = dbClients.map((client) => {
    const clientProjects = dbProjects.filter((project) => project.client_id === client.id);

    return {
      id: client.id,
      companyName: client.company_name,
      contactName: client.contact_name,
      email: client.email,
      phone: client.phone ?? "",
      status: client.status,
      linkedProjectIds: clientProjects.map((project) => project.id),
      notes: client.notes ?? "",
      industry: client.industry ?? "Creative services",
      ownerId: client.owner_id,
      createdAt: client.created_at,
    };
  });

  const tasks: Task[] = dbTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    assigneeId: task.assignee_id,
    assigneeName: task.assignee_id ? usersById.get(task.assignee_id)?.name : undefined,
    assigneeAvatarUrl: task.assignee_id ? usersById.get(task.assignee_id)?.avatarUrl : undefined,
    dueDate: task.due_date,
    projectId: task.project_id,
    projectName: projectsById.get(task.project_id)?.name ?? "Unknown project",
    commentsCount: dbComments.filter((comment) => comment.task_id === task.id).length,
    attachmentsCount: task.attachments_count,
    createdAt: task.created_at,
  }));

  const notifications: NotificationItem[] = dbNotifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    body: notification.body,
    kind: notification.kind,
    read: notification.read,
    createdAt: formatRelativeTime(notification.created_at),
  }));

  const activity: ActivityItem[] = dbActivity.map((entry) => ({
    id: entry.id,
    actor: entry.actor_id ? usersById.get(entry.actor_id)?.name ?? "System" : "System",
    message: `${entry.action.replaceAll("_", " ")} ${entry.entity_type.replaceAll("_", " ")}`,
    context:
      typeof entry.metadata?.title === "string"
        ? String(entry.metadata.title)
        : entry.entity_type.replaceAll("_", " "),
    timestamp: formatRelativeTime(entry.created_at),
    createdAt: entry.created_at,
  }));

  return {
    viewer,
    users: normalizedUsers,
    clients,
    projects,
    tasks,
    notifications,
    activity,
    stats: buildStats(dbProjects, dbTasks, dbUsers),
    throughput: buildThroughput(dbTasks),
    focus: buildFocus(dbTasks),
  };
}
