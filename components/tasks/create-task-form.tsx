"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BriefcaseBusiness, Flag, ListTodo, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Project, TaskPriority, TaskStatus, UserProfile } from "@/lib/types";

export function CreateTaskForm({
  currentUserId,
  projects,
  users,
  onSuccess,
}: {
  currentUserId: string;
  projects: Project[];
  users: UserProfile[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const assigneeId = String(formData.get("assignee_id") ?? "").trim();

    const payload = {
      project_id: String(formData.get("project_id") ?? ""),
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      status: String(formData.get("status") ?? "todo") as TaskStatus,
      priority: String(formData.get("priority") ?? "medium") as TaskPriority,
      assignee_id: assigneeId || null,
      due_date: String(formData.get("due_date") ?? "").trim() || null,
      created_by: currentUserId,
    };

    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert(payload)
      .select("id, title")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    await supabase.from("activity_logs").insert({
      actor_id: currentUserId,
      entity_type: "task",
      entity_id: data.id,
      action: "created",
      metadata: { title: data.title },
    });

    router.refresh();
    onSuccess?.();
    setLoading(false);
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Task title</label>
          <Input name="title" placeholder="Finalize homepage interaction states" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <Select icon={<BriefcaseBusiness className="size-3.5" />} name="project_id" required>
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select defaultValue="todo" icon={<ListTodo className="size-3.5" />} name="status">
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select defaultValue="medium" icon={<Flag className="size-3.5" />} name="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Due date</label>
          <Input name="due_date" type="date" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Assignee</label>
        <Select icon={<UserRound className="size-3.5" />} name="assignee_id">
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea name="description" placeholder="Describe the work, expected delivery, and context." />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex justify-end">
        <Button disabled={loading} type="submit">
          {loading ? "Creating task..." : "Create task"}
        </Button>
      </div>
    </form>
  );
}
