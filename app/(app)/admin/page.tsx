import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function AdminPage() {
  const snapshot = await getWorkspaceSnapshot();
  if (!snapshot) return null;
  if (snapshot.viewer.role !== "admin") {
    return (
      <div className="glass-panel rounded-[32px] p-6">
        <p className="text-sm text-muted-foreground">Admin access required</p>
        <h1 className="mt-2 text-3xl font-semibold">You do not have permission to open this panel.</h1>
      </div>
    );
  }

  return (
    <AdminWorkspace
      activity={snapshot.activity}
      currentUserId={snapshot.viewer.id}
      projects={snapshot.projects}
      tasks={snapshot.tasks}
      users={snapshot.users}
    />
  );
}
