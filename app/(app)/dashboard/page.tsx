import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function DashboardPage() {
  const snapshot = await getWorkspaceSnapshot();
  if (!snapshot) return null;

  return <DashboardWorkspace snapshot={snapshot} />;
}
