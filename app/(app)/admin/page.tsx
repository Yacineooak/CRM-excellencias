import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <Button variant="secondary">View logs</Button>
            <Button>Invite user</Button>
          </>
        }
        badge="Admin only"
        description="Manage users, roles, project control, analytics, and system activity through one dedicated admin surface."
        eyebrow="Admin"
        title="Full control of the agency operating system"
      />
      <AdminDashboard />
    </>
  );
}
