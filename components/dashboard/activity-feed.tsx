import { Card } from "@/components/ui/card";
import { activityFeed } from "@/lib/mock-data";

export function ActivityFeed() {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-sm text-muted-foreground">Activity</p>
        <h3 className="mt-2 text-2xl font-semibold">Recent team movement</h3>
      </div>
      <div className="space-y-4">
        {activityFeed.map((item) => (
          <div className="flex gap-4 rounded-2xl border border-white/20 p-4 dark:border-white/10" key={item.id}>
            <div className="mt-1 size-2 rounded-full bg-teal" />
            <div className="space-y-1">
              <p className="text-sm leading-6">
                <span className="font-semibold">{item.actor}</span> {item.message}
              </p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span>{item.context}</span>
                <span>{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
