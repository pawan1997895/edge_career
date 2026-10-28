import Link from "next/link";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleMarker } from "@/features/curriculum/components/module-marker";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Module, ModuleStatus } from "@/types/curriculum";

const STATUS_TEXT: Record<ModuleStatus, string> = {
  locked: "Locked",
  unlocked: "Ready",
  in_progress: "In progress",
  passed: "Passed",
  tested_out: "Tested out",
};

/** Six core modules at a glance. */
export function TrackProgressCard({ modules }: { modules: Module[] }) {
  const done = modules.filter((m) => m.status === "passed" || m.status === "tested_out").length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core track</CardTitle>
        <CardDescription>
          {done} of {modules.length} modules complete
        </CardDescription>
        <CardAction>
          <Link href={routes.learn} className="text-[13px] font-medium text-primary hover:underline">
            View curriculum
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                href={routes.module(m.id)}
                className={cn(
                  "flex h-full flex-col gap-2 rounded-md border p-3 transition-colors hover:bg-accent/50",
                  m.status === "in_progress" && "border-primary/50 bg-accent/40",
                )}
              >
                <ModuleMarker number={m.number} status={m.status} className="size-7" />
                <span className={cn("text-[13px] leading-snug font-medium", m.status === "locked" && "text-muted-foreground")}>{m.title}</span>
                <span className="mt-auto text-xs text-muted-foreground">
                  {STATUS_TEXT[m.status]}
                  {m.status === "in_progress" && ` · ${m.progress}%`}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
