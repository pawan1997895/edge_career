import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center border-b px-4 sm:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Compass className="size-6" />
        </span>
        <p className="mt-4 text-sm font-medium text-primary">404</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href={routes.dashboard}>Go to dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={routes.screens}>Browse all screens</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
