import Link from "next/link";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { STAGES } from "@/features/admin/content/content-badges";
import { routes } from "@/lib/routes";
import type { CiStatus, PipelineLesson } from "@/types/admin-content";

export function ContentPipelineStatus({ ciStatuses, lessons }: { ciStatuses: CiStatus[]; lessons: PipelineLesson[] }) {
  const passing = ciStatuses.filter((s) => s === "passing").length;
  const failing = ciStatuses.filter((s) => s === "failing").length;
  const running = ciStatuses.filter((s) => s === "running").length;
  const maxStage = Math.max(...STAGES.map((s) => lessons.filter((l) => l.stage === s.id).length));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content pipeline</CardTitle>
        <CardDescription>Problem files and lessons in the content repository</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href={routes.admin.content}>Manage</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">Problems passing automatic checks</span>
            <span className="tabular-nums text-muted-foreground">
              {passing} / {ciStatuses.length}
            </span>
          </div>
          <Progress className="mt-2" value={(passing / ciStatuses.length) * 100} tone="success" />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {failing} failing · {running} running
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">Lessons by stage</span>
            <Link href={routes.admin.lessons} className="text-xs text-primary hover:underline">
              View board
            </Link>
          </div>
          <ul className="mt-2 space-y-1.5">
            {STAGES.map((stage) => {
              const count = lessons.filter((l) => l.stage === stage.id).length;
              return (
                <li key={stage.id} className="grid grid-cols-[7rem_1fr_1.5rem] items-center gap-2 text-[13px]">
                  <span className="text-muted-foreground">{stage.label}</span>
                  <span className="h-1.5 rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${(count / maxStage) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
