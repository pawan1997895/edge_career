import Link from "next/link";
import { CircleCheck, CircleX, Clock, FolderGit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectStatusBadge } from "@/features/projects/components/project-status-badge";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ProjectSummary } from "@/types/projects";

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return <EmptyState icon={FolderGit2} title="No projects yet" description="Projects appear here when Module 5 content is published." />;
  }
  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <li key={project.id}>
          <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={routes.project(project.id)} className="font-medium hover:text-primary">
                  {project.title}
                </Link>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{project.summary}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> ~{project.estimatedHours < 1 ? `${Math.round(project.estimatedHours * 60)} min` : `${project.estimatedHours} h`}
                </span>
                {project.repo && <span className="font-mono">{project.repo}</span>}
                {project.skills.map((s) => (
                  <Badge key={s} variant="muted">
                    {s}
                  </Badge>
                ))}
              </div>
              {project.lastRun && (
                <p className="mt-2 flex items-center gap-1.5 text-xs">
                  {project.lastRun.result === "passed" ? <CircleCheck className="size-3.5 text-success" /> : <CircleX className="size-3.5 text-destructive" />}
                  Last run {formatRelative(project.lastRun.at)}: {project.lastRun.testsPassed}/{project.lastRun.testsTotal} tests passed
                </p>
              )}
            </div>
            <Button variant={project.status === "passed" ? "outline" : "default"} size="sm" asChild>
              <Link href={routes.project(project.id)}>{project.status === "not_started" ? "Start" : project.status === "passed" ? "View" : "Continue"}</Link>
            </Button>
          </Card>
        </li>
      ))}
    </ul>
  );
}
