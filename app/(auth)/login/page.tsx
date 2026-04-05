import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Welcome back</p>
        <h1 className="text-4xl font-semibold tracking-tight">Sign into your agency workspace</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Access CRM records, live Kanban boards, and team-wide project operations.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
