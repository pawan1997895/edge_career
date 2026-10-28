import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ExamRequirement } from "@/types/assessments";

/** Checklist of what must be passed before the checkpoint opens. */
export function EligibilityCard({ requirements }: { requirements: ExamRequirement[] }) {
  const done = requirements.filter((r) => r.done).length;
  const eligible = done === requirements.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility</CardTitle>
        <CardDescription>
          {requirements.length === 0
            ? "No prerequisites. Anyone can take this test."
            : eligible
              ? `All ${requirements.length} requirements met.`
              : `${done} of ${requirements.length} requirements met.`}
        </CardDescription>
      </CardHeader>
      {requirements.length > 0 && (
        <CardContent className="space-y-4">
          <Progress value={(done / requirements.length) * 100} tone={eligible ? "success" : "primary"} aria-label="Requirements met" />
          <ul className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
            {requirements.map((r) => (
              <li key={r.label} className="flex items-start gap-2.5 text-sm">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                    r.done ? "border-success bg-success text-success-foreground" : "border-input",
                  )}
                >
                  {r.done && <Check className="size-3" />}
                </span>
                {r.href ? (
                  <Link href={r.href} className={cn("hover:text-primary", r.done && "text-muted-foreground")}>
                    {r.label}
                  </Link>
                ) : (
                  <span className={cn(r.done && "text-muted-foreground")}>{r.label}</span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
