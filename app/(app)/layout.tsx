import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { CommandPalette } from "@/components/app-shell/command-palette";
import { Topbar } from "@/components/app-shell/topbar";
import { NotificationCenter } from "@/components/notifications/notification-center";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative grid-noise py-4 xl:grid xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">
      <AppSidebar />
      <main className="min-w-0">
        <Topbar />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">{children}</div>
          <div className="space-y-6">
            <NotificationCenter />
          </div>
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}
