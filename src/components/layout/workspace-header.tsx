import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Slim top bar for full-screen workspaces (coding, design canvas, interview room, exams).
 * The back link returns to the page the workspace was opened from.
 */
export function WorkspaceHeader({
  backHref,
  backLabel,
  title,
  meta,
  center,
  actions,
}: {
  backHref: string;
  backLabel: string;
  title: React.ReactNode;
  /** Badges next to the title. */
  meta?: React.ReactNode;
  /** Middle slot, e.g. an exam timer or interview stage. */
  center?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-3 sm:px-4">
      <Logo href="/dashboard" compact className="hidden sm:flex" />
      <Link
        href={backHref}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span className="hidden md:inline">{backLabel}</span>
      </Link>
      <div className="h-5 w-px bg-border" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h1 className="truncate text-sm font-semibold">{title}</h1>
        {meta && <div className="hidden items-center gap-1.5 sm:flex">{meta}</div>}
      </div>
      {center && <div className="hidden items-center md:flex">{center}</div>}
      <div className="flex items-center gap-1.5">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
