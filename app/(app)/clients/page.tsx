import { ClientsWorkspace } from "@/components/clients/clients-workspace";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function ClientsPage() {
  const snapshot = await getWorkspaceSnapshot();
  if (!snapshot) return null;

  return (
    <ClientsWorkspace clients={snapshot.clients} projects={snapshot.projects} viewerId={snapshot.viewer.id} />
  );
}
