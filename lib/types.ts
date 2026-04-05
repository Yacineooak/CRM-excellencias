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
  activity: string;
  availability: "Available" | "Focused" | "In review";
};

export type ActivityItem = {
  id: string;
  actor: string;
  message: string;
  context: string;
  timestamp: string;
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
  spend: string;
};

export type Project = {
  id: string;
  name: string;
  clientId: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
  progress: number;
  budget: string;
  health: "Healthy" | "Watch" | "Critical";
  teamMemberIds: string[];
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
  assigneeId: string;
  dueDate: string;
  projectId: string;
  tags: string[];
  comments: TaskComment[];
  attachments: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  kind: "mention" | "task" | "project";
  read: boolean;
  createdAt: string;
};
