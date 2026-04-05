import { Card } from "@/components/ui/card";
import { activityFeed } from "@/lib/mock-data";

export function ActivityHistory() {
  return (
    <Card className="p-6">
      <p className="text-sm text-muted-foreground">History</p>
      <h3 className="mt-2 text-2xl font-semibold">Recent profile activity</h3>
      <div className="mt-6 space-y-4">
        {activityFeed.map((item) => (
          <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10" key={item.id}>
            <p className="text-sm leading-6">
              <span className="font-semibold">{item.actor}</span> {item.message}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {item.context} | {item.timestamp}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
