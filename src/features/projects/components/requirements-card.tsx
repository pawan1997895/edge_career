import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ProjectRequirement } from "@/types/projects";

const CHECKED_BY: Record<ProjectRequirement["checkedBy"], string> = {
  tests: "Hidden tests",
  live_check: "Live URL check",
  reviewer: "Reviewer",
  github: "GitHub",
};

/** Project requirements and how each one is verified. */
export function RequirementsCard({ requirements }: { requirements: ProjectRequirement[] }) {
  const done = requirements.filter((r) => r.done).length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requirements</CardTitle>
        <CardDescription>
          {done} of {requirements.length} met
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={(done / Math.max(1, requirements.length)) * 100} tone={done === requirements.length ? "success" : "primary"} />
        <ul className="space-y-3">
          {requirements.map((r) => (
            <li key={r.id} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                  r.done ? "border-success bg-success text-success-foreground" : "border-input",
                )}
              >
                {r.done && <Check className="size-3" />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm">{r.label}</span>
                <span className="block text-xs text-muted-foreground">Checked by: {CHECKED_BY[r.checkedBy]}</span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
