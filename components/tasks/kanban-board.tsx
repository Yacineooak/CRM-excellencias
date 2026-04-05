"use client";

import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, MessageSquare, Paperclip } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { tasks as initialTasks, users } from "@/lib/mock-data";
import type { Task, TaskStatus } from "@/lib/types";
import { formatRelativeDay } from "@/lib/utils";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

function SortableTaskCard({ task }: { task: Task }) {
  const assignee = users.find((user) => user.id === task.assigneeId);
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
          <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
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
        {task.tags.map((tag) => (
          <span
            className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground dark:bg-white/5"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <CalendarClock className="size-3.5" />
          {formatRelativeDay(task.dueDate)}
        </span>
        <span className="flex items-center gap-2">
          <MessageSquare className="size-3.5" />
          {task.comments.length}
        </span>
        <span className="flex items-center gap-2">
          <Paperclip className="size-3.5" />
          {task.attachments}
        </span>
      </div>
      {assignee ? (
        <div className="mt-4 flex items-center gap-3">
          <Avatar alt={assignee.name} className="size-9" src={assignee.avatarUrl} />
          <div>
            <p className="text-sm font-semibold">{assignee.name}</p>
            <p className="text-xs text-muted-foreground">{assignee.title}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function KanbanBoard() {
  const [items, setItems] = useState(initialTasks);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const grouped = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        tasks: items.filter((task) => task.status === column.id),
      })),
    [items],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeTask = items.find((task) => task.id === active.id);
    const overTask = items.find((task) => task.id === over.id);

    if (!activeTask) {
      return;
    }

    if (!overTask) {
      const status = String(over.id) as TaskStatus;
      setItems((previous) =>
        previous.map((task) =>
          task.id === activeTask.id
            ? {
                ...task,
                status,
              }
            : task,
        ),
      );
      return;
    }

    const activeIndex = items.findIndex((task) => task.id === active.id);
    const overIndex = items.findIndex((task) => task.id === over.id);

    const reordered = arrayMove(items, activeIndex, overIndex).map((task) =>
      task.id === activeTask.id ? { ...task, status: overTask.status } : task,
    );

    setItems(reordered);
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid gap-4 xl:grid-cols-4">
        {grouped.map((column) => (
          <Card className="p-4" key={column.id}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{column.title}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {column.tasks.length} tasks
                </p>
              </div>
              <Badge variant="muted">{column.tasks.length}</Badge>
            </div>
            <SortableContext items={column.tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <SortableTaskCard key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </Card>
        ))}
      </div>
    </DndContext>
  );
}
