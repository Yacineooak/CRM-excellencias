"use client";

import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, Filter, MessageSquare, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";

import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Project, Task, TaskStatus, UserProfile } from "@/lib/types";
import { formatRelativeDay } from "@/lib/utils";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

function SortableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="rounded-[24px] border border-white/20 bg-background/60 p-4 dark:border-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{task.description || task.projectName}</p>
        </div>
        <Badge
          variant={
            task.priority === "urgent" ? "danger" : task.priority === "high" ? "warning" : "default"
          }
        >
          {task.priority}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground dark:bg-white/5">
          {task.projectName}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <CalendarClock className="size-3.5" />
          {task.dueDate ? formatRelativeDay(task.dueDate) : "No due date"}
        </span>
        <span className="flex items-center gap-2">
          <MessageSquare className="size-3.5" />
          {task.commentsCount}
        </span>
        <span className="flex items-center gap-2">
          <Paperclip className="size-3.5" />
          {task.attachmentsCount}
        </span>
      </div>
      {task.assigneeName ? (
        <div className="mt-4 flex items-center gap-3">
          <Avatar alt={task.assigneeName} className="size-9" src={task.assigneeAvatarUrl ?? ""} />
          <div>
            <p className="text-sm font-semibold">{task.assigneeName}</p>
            <p className="text-xs text-muted-foreground">Assigned</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function KanbanColumn({
  children,
  count,
  id,
  title,
}: {
  children: React.ReactNode;
  count: number;
  id: TaskStatus;
  title: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <Card
      className={`flex min-h-[320px] flex-col p-4 transition ${
        isOver ? "border-teal/60 shadow-teal" : ""
      }`}
      ref={setNodeRef}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{count} tasks</p>
        </div>
        <Badge variant="muted">{count}</Badge>
      </div>
      <div className="space-y-3">{children}</div>
    </Card>
  );
}

export function TasksWorkspace({
  currentUserId,
  projects,
  tasks: initialTasks,
  users,
}: {
  currentUserId: string;
  projects: Project[];
  tasks: Task[];
  users: UserProfile[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialTasks);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filteredItems = useMemo(
    () =>
      items.filter(
        (task) =>
          (assigneeFilter === "all" || task.assigneeId === assigneeFilter) &&
          (projectFilter === "all" || task.projectId === projectFilter),
      ),
    [assigneeFilter, items, projectFilter],
  );

  const grouped = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        tasks: filteredItems.filter((task) => task.status === column.id),
      })),
    [filteredItems],
  );

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    await supabase.from("tasks").update({ status }).eq("id", taskId);
    await supabase.from("activity_logs").insert({
      actor_id: currentUserId,
      entity_type: "task",
      entity_id: taskId,
      action: `moved_to_${status}`,
      metadata: { title: "Task status updated" },
    });
    router.refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeTask = items.find((task) => task.id === active.id);
    const overTask = items.find((task) => task.id === over.id);

    if (!activeTask) {
      return;
    }

    const nextStatus = overTask ? overTask.status : (String(over.id) as TaskStatus);

    setItems((previous) =>
      previous.map((task) => (task.id === activeTask.id ? { ...task, status: nextStatus } : task)),
    );

    await updateTaskStatus(activeTask.id, nextStatus);
  }

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button onClick={() => setShowFilters((current) => !current)} variant="secondary">
              <Filter className="mr-2 size-4" />
              Filter tasks
            </Button>
            <Button onClick={() => setCreateOpen(true)}>Create task</Button>
          </>
        }
        badge="Kanban"
        description="Drag, review, and complete work across touch-friendly columns with clear ownership and due dates."
        eyebrow="Tasks"
        title="Beautiful task management for creative delivery"
      />

      {showFilters ? (
        <Card className="p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Select onChange={(event) => setAssigneeFilter(event.target.value)} value={assigneeFilter}>
                <option value="all">All assignees</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select onChange={(event) => setProjectFilter(event.target.value)} value={projectFilter}>
                <option value="all">All projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>
      ) : null}

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {grouped.map((column) => (
            <KanbanColumn count={column.tasks.length} id={column.id} key={column.id} title={column.title}>
              <SortableContext items={column.tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
                {column.tasks.map((task) => (
                  <SortableTaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
      </DndContext>

      <Dialog
        description="Create a task directly in the live Kanban board."
        onClose={() => setCreateOpen(false)}
        open={isCreateOpen}
        title="Create task"
      >
        <CreateTaskForm
          currentUserId={currentUserId}
          onSuccess={() => setCreateOpen(false)}
          projects={projects}
          users={users}
        />
      </Dialog>
    </>
  );
}
