import { Card } from "@/components/ui/card";
import { tasks, users } from "@/lib/mock-data";
import { formatRelativeDay } from "@/lib/utils";

export function PersonalQueue() {
  const queue = tasks.slice(0, 4);

  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-sm text-muted-foreground">My queue</p>
        <h3 className="mt-2 text-2xl font-semibold">Assigned tasks and deadlines</h3>
      </div>
      <div className="space-y-3">
        {queue.map((task) => {
          const assignee = users.find((user) => user.id === task.assigneeId);

          return (
            <div
              className="rounded-2xl border border-white/20 bg-background/40 p-4 dark:border-white/10"
              key={task.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <p>{task.priority}</p>
                  <p className="mt-2">{formatRelativeDay(task.dueDate)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-teal">
                Assignee: {assignee?.name}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
