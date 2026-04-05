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
import { CalendarClock, Filter, FolderKanban, MessageSquare, Paperclip, Search, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
      className={`flex min-h-[360px] min-w-[290px] flex-col p-4 transition sm:min-w-0 ${
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
      <div className="space-y-3">
        {count > 0 ? (
          children
        ) : (
          <div className="rounded-[22px] border border-dashed border-white/20 bg-background/30 px-4 py-6 text-sm text-muted-foreground dark:border-white/10">
            Drop a task here to move it into {title.toLowerCase()}.
          </div>
        )}
      </div>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState<"all" | "mine" | "urgent">("all");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filteredItems = useMemo(
    () =>
      items.filter(
        (task) =>
          `${task.title} ${task.description} ${task.projectName}`.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (assigneeFilter === "all" || task.assigneeId === assigneeFilter) &&
          (projectFilter === "all" || task.projectId === projectFilter) &&
          (focusFilter !== "mine" || task.assigneeId === currentUserId) &&
          (focusFilter !== "urgent" || task.priority === "urgent" || task.priority === "high"),
      ),
    [assigneeFilter, currentUserId, focusFilter, items, projectFilter, searchQuery],
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

  const myTaskCount = filteredItems.filter((task) => task.assigneeId === currentUserId).length;
  const urgentCount = filteredItems.filter(
    (task) => task.priority === "urgent" || task.priority === "high",
  ).length;
  const dueSoonCount = filteredItems.filter((task) => {
    if (!task.dueDate || task.status === "done") return false;
    const daysUntilDue = Math.ceil(
      (new Date(task.dueDate).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24),
    );
    return daysUntilDue <= 3;
  }).length;

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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,0.55fr))]">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Dispatch search</p>
          <h3 className="mt-2 text-2xl font-semibold">Find the right task instantly</h3>
          <div className="relative mt-5">
            <Search className="absolute left-4 top-5 size-4 text-muted-foreground" />
            <Input
              className="pl-10"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search title, project, or context"
              value={searchQuery}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: "all", label: "All work" },
              { id: "mine", label: "Assigned to me" },
              { id: "urgent", label: "High priority" },
            ].map((option) => (
              <button
                className={`rounded-full px-4 py-2 text-sm transition ${
                  focusFilter === option.id
                    ? "bg-[linear-gradient(135deg,#4ab5b8,#2c9598)] text-white shadow-[0_14px_28px_rgba(74,181,184,0.28)]"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/8 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
                }`}
                key={option.id}
                onClick={() => setFocusFilter(option.id as "all" | "mine" | "urgent")}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Assigned to me</p>
          <h3 className="mt-3 text-3xl font-semibold">{myTaskCount}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Live count based on the current board filters.</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Priority queue</p>
          <h3 className="mt-3 text-3xl font-semibold">{urgentCount}</h3>
          <p className="mt-2 text-sm text-muted-foreground">High and urgent tasks needing close attention.</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Due soon</p>
          <h3 className="mt-3 text-3xl font-semibold">{dueSoonCount}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Tasks due within the next three days.</p>
        </Card>
      </div>

      {showFilters ? (
        <Card className="p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Select
                icon={<UserRound className="size-3.5" />}
                onChange={(event) => setAssigneeFilter(event.target.value)}
                value={assigneeFilter}
              >
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
              <Select
                icon={<FolderKanban className="size-3.5" />}
                onChange={(event) => setProjectFilter(event.target.value)}
                value={projectFilter}
              >
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
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4 xl:grid xl:min-w-0 xl:[grid-template-columns:repeat(4,minmax(0,1fr))]">
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
