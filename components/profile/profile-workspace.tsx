"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActivityItem, UserProfile } from "@/lib/types";
import { fileToDataUrl, formatLabel } from "@/lib/utils";

export function ProfileWorkspace({
  activity,
  viewer,
}: {
  activity: ActivityItem[];
  viewer: UserProfile;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(viewer.name);
  const [title, setTitle] = useState(viewer.title);
  const [bio, setBio] = useState(viewer.bio);
  const [availability, setAvailability] = useState(viewer.availability);
  const [avatarUrl, setAvatarUrl] = useState(viewer.avatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  async function saveProfile() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    setError(null);

    let nextAvatarUrl = avatarUrl;

    if (file) {
      const extension = file.name.split(".").pop() ?? "png";
      const path = `${viewer.id}/avatar-${Date.now()}.${extension}`;
      const upload = await supabase.storage.from("avatars").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type || "image/png",
        upsert: true,
      });

      if (upload.error) {
        nextAvatarUrl = await fileToDataUrl(file);
      } else {
        nextAvatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        title,
        bio,
        activity_status: availability,
        avatar_url: nextAvatarUrl,
      })
      .eq("id", viewer.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.from("activity_logs").insert({
      actor_id: viewer.id,
      entity_type: "profile",
      entity_id: viewer.id,
      action: "updated",
      metadata: { title: name },
    });

    setAvatarUrl(nextAvatarUrl);
    setFile(null);
    setPreviewUrl(null);
    router.refresh();
    setLoading(false);
  }

  function exportActivity() {
    const csv = [
      ["actor", "message", "context", "timestamp"].join(","),
      ...activity.map((item) =>
        [item.actor, item.message, item.context, item.timestamp]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "profile-activity.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        actions={
          <Button onClick={exportActivity} variant="secondary">
            View activity export
          </Button>
        }
        badge="Profile"
        description="Update your identity, role context, and working notes while keeping a clean history of team activity."
        eyebrow="My profile"
        title="Personal workspace settings and history"
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative">
            <Avatar alt={name} className="size-24" src={previewUrl ?? avatarUrl} />
            <button
              className="absolute bottom-0 right-0 rounded-full bg-teal p-2 text-white shadow-teal"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <Camera className="size-4" />
            </button>
            <input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;

                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }

                setFile(nextFile);
                setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
              }}
              type="file"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold">{name}</h3>
              <Badge>{formatLabel(viewer.role)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{availability}</p>
            {file ? (
              <p className="text-xs uppercase tracking-[0.18em] text-teal">New avatar ready to save</p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>
            <Input onChange={(event) => setName(event.target.value)} value={name} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input disabled value={viewer.email} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input onChange={(event) => setTitle(event.target.value)} value={title} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Availability</label>
            <Select
              icon={<Sparkles className="size-3.5" />}
              onChange={(event) => setAvailability(event.target.value)}
              value={availability}
            >
              <option value="Available">Available</option>
              <option value="Focused">Focused</option>
              <option value="In review">In review</option>
              <option value="In meetings">In meetings</option>
              <option value="Offline">Offline</option>
            </Select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Profile summary</label>
          <Textarea
            onChange={(event) => setBio(event.target.value)}
            placeholder="Describe your specialty, role focus, and how teammates should work with you."
            value={bio}
          />
        </div>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        <div className="mt-6 flex justify-end">
          <Button disabled={loading} onClick={saveProfile} type="button">
            {loading ? "Saving profile..." : "Save profile"}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-sm text-muted-foreground">History</p>
        <h3 className="mt-2 text-2xl font-semibold">Recent profile activity</h3>
        <div className="mt-6 space-y-4">
          {activity.length > 0 ? (
            activity.map((item) => (
              <div className="rounded-[24px] border border-white/20 p-4 dark:border-white/10" key={item.id}>
                <p className="text-sm leading-6">
                  <span className="font-semibold">{item.actor}</span> {item.message}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {item.context} | {item.timestamp}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/20 p-4 text-sm text-muted-foreground dark:border-white/10">
              No activity has been recorded yet.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
