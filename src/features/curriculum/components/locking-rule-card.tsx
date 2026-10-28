import Link from "next/link";
import { ClipboardCheck, ListChecks, LockOpen, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/routes";

const STEPS = [
  { icon: ListChecks, title: "Pass every required item", text: "Lessons, practice problems and assignments marked required." },
  { icon: ClipboardCheck, title: "Score 85% on the checkpoint", text: "Retakes draw a fresh, randomized question set." },
  { icon: LockOpen, title: "The next module unlocks", text: "Plus any electives that list it as a prerequisite." },
];

/** Explains the module-locking rule in three steps. */
export function LockingRuleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How modules unlock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <step.icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">
                  {i + 1}. {step.title}
                </p>
                <p className="text-[13px] text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex gap-3 rounded-md bg-muted/60 p-3 text-[13px] text-muted-foreground">
          <UserCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            Scores between 80% and 88%, or results the AI grader is unsure about, are checked by a human reviewer before a module
            locks or unlocks. Already experienced?{" "}
            <Link href={routes.placementTest} className="font-medium text-primary hover:underline">
              Take the placement test
            </Link>{" "}
            to test out of modules.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
