export type Role = "admin" | "manager" | "team_member";
export type ClientStatus = "lead" | "active" | "inactive";
export type ProjectStatus = "planning" | "active" | "at_risk" | "completed";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  title: string;
  availability: string;
  createdAt?: string;
};

export type ActivityItem = {
  id: string;
  actor: string;
  message: string;
  context: string;
  timestamp: string;
  createdAt: string;
};

export type Client = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: ClientStatus;
  linkedProjectIds: string[];
  notes: string;
  industry: string;
  ownerId: string | null;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string;
  status: ProjectStatus;
  deadline: string | null;
  progress: number;
  budget: number;
  health: "Healthy" | "Watch" | "Critical";
  teamMemberIds: string[];
  ownerId: string | null;
  createdAt: string;
};

export type TaskComment = {
  id: string;
  authorId: string;
  message: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  assigneeName?: string;
  assigneeAvatarUrl?: string;
  dueDate: string | null;
  projectId: string;
  projectName: string;
  commentsCount: number;
  attachmentsCount: number;
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  kind: "mention" | "task" | "project";
  read: boolean;
  createdAt: string;
};

export type DashboardStats = {
  activeClients: number;
  activeProjects: number;
  tasksCompleted: number;
  teamMembers: number;
  atRiskProjects: number;
  overdueTasks: number;
  assignedTasks: number;
};

export type ThroughputPoint = {
  label: string;
  completed: number;
  active: number;
};

export type FocusPoint = {
  name: string;
  value: number;
};

export type WorkspaceSnapshot = {
  viewer: UserProfile;
  users: UserProfile[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  notifications: NotificationItem[];
  activity: ActivityItem[];
  stats: DashboardStats;
  throughput: ThroughputPoint[];
  focus: FocusPoint[];
};
