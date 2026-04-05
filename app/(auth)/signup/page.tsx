import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Create account</p>
        <h1 className="text-4xl font-semibold tracking-tight">Launch a premium client ops workspace</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Choose the right role, add a profile image, and step into a CRM built for creative teams.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
