import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { PersonalQueue } from "@/components/dashboard/personal-queue";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <Button variant="secondary">Export report</Button>
            <Button>New project</Button>
          </>
        }
        badge="Live workspace"
        description="Track agency delivery, active clients, deadlines, and team velocity from one elegant command surface."
        eyebrow="Dashboard"
        title="Creative operations, without the chaos"
      />
      <StatsGrid />
      <DashboardChart />
      <div className="grid gap-4 2xl:grid-cols-2">
        <PersonalQueue />
        <ActivityFeed />
      </div>
    </>
  );
}
