import { TasksWorkspace } from "@/components/tasks/tasks-workspace";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function TasksPage() {
  const snapshot = await getWorkspaceSnapshot();
  if (!snapshot) return null;

  return (
    <TasksWorkspace
      currentUserId={snapshot.viewer.id}
      projects={snapshot.projects}
      tasks={snapshot.tasks}
      users={snapshot.users}
    />
  );
}
