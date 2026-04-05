import { ActivityHistory } from "@/components/profile/activity-history";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        actions={<Button variant="secondary">View activity export</Button>}
        badge="Profile"
        description="Update your identity, role context, and working notes while keeping a clean history of team activity."
        eyebrow="My profile"
        title="Personal workspace settings and history"
      />
      <ProfileEditor />
      <ActivityHistory />
    </>
  );
}
