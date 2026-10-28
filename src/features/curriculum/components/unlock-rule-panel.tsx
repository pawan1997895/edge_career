import { Check, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Module } from "@/types/curriculum";

/** The module's unlock rule with live progress against each condition. */
export function UnlockRulePanel({
  mod,
  required,
  unlocks,
}: {
  mod: Module;
  required: { passed: number; total: number };
  unlocks: Module[];
}) {
  const { checkpoint } = mod;
  const itemsDone = required.total > 0 && required.passed === required.total;
  const checkpointDone = checkpoint.status === "passed";
  const unlockNames = unlocks.map((m) => (m.number ? `Module ${m.number} · ${m.title}` : m.title));

  const conditions = [
    {
      done: itemsDone,
      label: "Pass every required item",
      detail: `${required.passed} of ${required.total} required items passed`,
    },
    {
      done: checkpointDone,
      label: `Score ${checkpoint.passScore}% or more on the checkpoint`,
      detail:
        checkpoint.bestScore !== undefined
          ? `Best score ${checkpoint.bestScore}% after ${checkpoint.attempts} attempt${checkpoint.attempts === 1 ? "" : "s"}`
          : "Not attempted yet",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unlock rule</CardTitle>
        <CardDescription>
          {unlockNames.length > 0 ? <>Passing this module unlocks {unlockNames.join(", ")}.</> : <>This is the last module in its track.</>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-3">
          {conditions.map((c) => (
            <li key={c.label} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                  c.done ? "border-success bg-success text-success-foreground" : "border-input",
                )}
              >
                {c.done && <Check className="size-3" />}
              </span>
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-[13px] text-muted-foreground">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="flex gap-2 rounded-md bg-muted/60 p-3 text-[13px] text-muted-foreground">
          <UserCheck className="mt-0.5 size-4 shrink-0" />
          Scores from 80% to 88%, or results the AI grader is unsure about, go to a human reviewer before the module unlocks.
        </p>
      </CardContent>
    </Card>
  );
}
