import { ProfileWorkspace } from "@/components/profile/profile-workspace";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function ProfilePage() {
  const snapshot = await getWorkspaceSnapshot();
  if (!snapshot) return null;

  return <ProfileWorkspace activity={snapshot.activity} viewer={snapshot.viewer} />;
}
