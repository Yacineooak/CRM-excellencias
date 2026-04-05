import { KanbanBoard } from "@/components/tasks/kanban-board";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <Button variant="secondary">Filter tasks</Button>
            <Button>Create task</Button>
          </>
        }
        badge="Kanban"
        description="Drag, review, and complete work across touch-friendly columns with clear ownership and due dates."
        eyebrow="Tasks"
        title="Beautiful task management for creative delivery"
      />
      <KanbanBoard />
    </>
  );
}
