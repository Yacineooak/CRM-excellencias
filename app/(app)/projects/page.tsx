import { ProjectsWorkspace } from "@/components/projects/projects-workspace";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function ProjectsPage() {
  const snapshot = await getWorkspaceSnapshot();
  if (!snapshot) return null;

  return (
    <ProjectsWorkspace
      clients={snapshot.clients}
      currentUserId={snapshot.viewer.id}
      projects={snapshot.projects}
      users={snapshot.users}
    />
  );
}
