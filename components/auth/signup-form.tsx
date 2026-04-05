"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("team_member");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatedAvatar = useMemo(
    () => `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(name || "Agency User")}`,
    [name],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.push("/dashboard");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          avatar_url: generatedAvatar,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError(
        "Signup succeeded, but email confirmation is still enabled in Supabase. Disable Email Confirmations in Supabase Authentication settings to allow instant access.",
      );
      setLoading(false);
      return;
    }

    let avatarUrl = generatedAvatar;

    if (file && data.user) {
      const extension = file.name.split(".").pop() ?? "png";
      const filePath = `${data.user.id}/avatar-${Date.now()}.${extension}`;
      const upload = await supabase.storage.from("avatars").upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type || "image/png",
        upsert: true,
      });

      if (upload.error) {
        setError(
          `Account created, but avatar upload failed: ${upload.error.message}. Make sure the 'avatars' bucket exists and allows authenticated uploads.`,
        );
        setLoading(false);
        return;
      }

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath);
      avatarUrl = publicUrl.data.publicUrl;
    }

    if (data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        name,
        email,
        role,
        avatar_url: avatarUrl,
      });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 rounded-[28px] border border-white/20 bg-background/50 p-4 dark:border-white/10">
        <Avatar alt={name} className="size-16" src={generatedAvatar} />
        <div className="space-y-2">
          <p className="text-sm font-semibold">Profile image</p>
          <input
            accept="image/*"
            className="text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-teal/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-teal"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Full name</label>
        <Input onChange={(event) => setName(event.target.value)} placeholder="Avery Cole" value={name} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          onChange={(event) => setEmail(event.target.value)}
          placeholder="avery@agency.com"
          type="email"
          value={email}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a secure password"
          type="password"
          value={password}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <Select icon={<ShieldCheck className="size-3.5" />} onChange={(event) => setRole(event.target.value as Role)} value={role}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="team_member">Team Member</option>
        </Select>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Roles power task dispatch, project control, and access across the workspace.
        </p>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button className="w-full" size="lg" type="submit">
        {loading ? "Creating workspace..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-teal" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
