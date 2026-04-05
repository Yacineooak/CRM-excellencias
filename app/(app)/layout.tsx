import { NotificationCenter } from "@/components/notifications/notification-center";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { CommandPalette } from "@/components/app-shell/command-palette";
import { Topbar } from "@/components/app-shell/topbar";
import { getWorkspaceSnapshot } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const snapshot = await getWorkspaceSnapshot();

  if (!snapshot) {
    return null;
  }

  return (
    <div className="container relative grid-noise py-4 xl:grid xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">
      <AppSidebar taskCount={snapshot.tasks.length} viewer={snapshot.viewer} />
      <main className="min-w-0">
        <Topbar viewer={snapshot.viewer} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">{children}</div>
          <div className="space-y-6">
            <NotificationCenter initialItems={snapshot.notifications} userId={snapshot.viewer.id} />
          </div>
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}
