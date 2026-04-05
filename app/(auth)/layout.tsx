import { BrandLogo } from "@/components/brand/logo";
import { AuthShowcase } from "@/components/auth/auth-showcase";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <AuthShowcase />
      <div className="flex min-h-screen items-center justify-center p-6 lg:p-10">
        <div className="glass-panel w-full max-w-xl rounded-[36px] p-8 sm:p-10">
          <BrandLogo />
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
