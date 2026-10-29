import Link from "next/link";
import { Logo } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { routes } from "@/lib/routes";

// Email verification: a minimal centered layout.
// Sign-in, sign-up and onboarding use the animated AI layout in (auth-entry).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo href={routes.home} />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">{children}</main>
      <footer className="px-4 py-6 text-center text-xs text-muted-foreground">
        Need help? Write to support@edgecareer.example ·{" "}
        <Link href={routes.home} className="hover:text-foreground">
          Back to home
        </Link>
      </footer>
    </div>
  );
}
