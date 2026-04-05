"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Client, ProjectStatus, UserProfile } from "@/lib/types";

export function CreateProjectForm({
  clients,
  currentUserId,
  users,
  onSuccess,
}: {
  clients: Client[];
  currentUserId: string;
  users: UserProfile[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedClients = useMemo(
    () => [...clients].sort((left, right) => left.companyName.localeCompare(right.companyName)),
    [clients],
  );

  function toggleMember(userId: string) {
    setSelectedMembers((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId],
    );
  }

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

    const payload = {
      client_id: String(formData.get("client_id") ?? ""),
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      status: String(formData.get("status") ?? "planning") as ProjectStatus,
      deadline: String(formData.get("deadline") ?? "").trim() || null,
      budget: Number(formData.get("budget") ?? 0),
      progress: Number(formData.get("progress") ?? 0),
      owner_id: currentUserId,
    };

    const { data, error: insertError } = await supabase
      .from("projects")
      .insert(payload)
      .select("id, name")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (selectedMembers.length > 0) {
      await supabase.from("project_members").insert(
        selectedMembers.map((userId) => ({
          project_id: data.id,
          user_id: userId,
          assigned_by: currentUserId,
        })),
      );
    }

    await supabase.from("activity_logs").insert({
      actor_id: currentUserId,
      entity_type: "project",
      entity_id: data.id,
      action: "created",
      metadata: { title: data.name },
    });

    router.refresh();
    onSuccess?.();
    setLoading(false);
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project name</label>
          <Input name="name" placeholder="Summer Campaign Launch" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Client</label>
          <Select name="client_id" required>
            <option value="">Select a client</option>
            {sortedClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select defaultValue="planning" name="status">
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Deadline</label>
          <Input name="deadline" type="date" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget (USD)</label>
          <Input min="0" name="budget" placeholder="12000" type="number" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea name="description" placeholder="Outline the scope and expected delivery." />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium">Assign team members</label>
        <div className="grid gap-3 md:grid-cols-2">
          {users.map((user) => (
            <label
              className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 text-sm dark:border-white/10"
              key={user.id}
            >
              <input
                checked={selectedMembers.includes(user.id)}
                className="size-4 accent-[#4ab5b8]"
                onChange={() => toggleMember(user.id)}
                type="checkbox"
              />
              <span>
                {user.name}
                <span className="ml-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {user.role.replace("_", " ")}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex justify-end">
        <Button disabled={loading} type="submit">
          {loading ? "Creating project..." : "Create project"}
        </Button>
      </div>
    </form>
  );
}
