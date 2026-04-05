"use client";

import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ClientStatus } from "@/lib/types";

export function CreateClientForm({
  ownerId,
  onSuccess,
}: {
  ownerId: string;
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

    const payload = {
      company_name: String(formData.get("company_name") ?? "").trim(),
      contact_name: String(formData.get("contact_name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      status: String(formData.get("status") ?? "lead") as ClientStatus,
      industry: String(formData.get("industry") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      owner_id: ownerId,
    };

    const { data, error: insertError } = await supabase
      .from("clients")
      .insert(payload)
      .select("id, company_name")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    await supabase.from("activity_logs").insert({
      actor_id: ownerId,
      entity_type: "client",
      entity_id: data.id,
      action: "created",
      metadata: { title: data.company_name },
    });

    router.refresh();
    onSuccess?.();
    setLoading(false);
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company name</label>
          <Input name="company_name" placeholder="Northstar Atelier" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact name</label>
          <Input name="contact_name" placeholder="Ari Bennett" required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input name="email" placeholder="contact@company.com" required type="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input name="phone" placeholder="+1 555 000 0000" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Industry</label>
          <Input name="industry" placeholder="Luxury retail" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select defaultValue="lead" icon={<BriefcaseBusiness className="size-3.5" />} name="status">
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea name="notes" placeholder="Add context, preferences, and account notes." />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex justify-end">
        <Button disabled={loading} type="submit">
          {loading ? "Creating client..." : "Create client"}
        </Button>
      </div>
    </form>
  );
}
