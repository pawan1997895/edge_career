import Link from "next/link";
import { Clock, Database, NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/features/projects/components/project-status-badge";
import { formatMinutes, formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { NotebookSummary } from "@/types/projects";

export function NotebookList({ notebooks }: { notebooks: NotebookSummary[] }) {
  if (notebooks.length === 0) {
    return <EmptyState icon={NotebookPen} title="No notebooks yet" description="Notebooks appear here when Module 6 content is published." />;
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {notebooks.map((nb) => (
        <li key={nb.id}>
          <Card className="flex h-full flex-col p-4">
            <div className="flex items-start justify-between gap-3">
              <Link href={routes.notebook(nb.id)} className="font-medium hover:text-primary">
                {nb.title}
              </Link>
              <ProjectStatusBadge status={nb.status} />
            </div>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{nb.summary}</p>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Database className="size-3.5" /> <span className="font-mono">{nb.dataset}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> ~{formatMinutes(nb.estimatedMin)}
                {nb.lastEditedAt && ` · edited ${formatRelative(nb.lastEditedAt)}`}
              </p>
            </div>
            <Button variant={nb.status === "passed" ? "outline" : "default"} size="sm" className="mt-4 self-start" asChild>
              <Link href={routes.notebook(nb.id)}>{nb.status === "not_started" ? "Open notebook" : nb.status === "passed" ? "Review" : "Continue"}</Link>
            </Button>
          </Card>
        </li>
      ))}
    </ul>
  );
}
