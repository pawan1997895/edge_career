import Link from "next/link";
import { Check, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";
import type { NextUnlock } from "@/types/dashboard";

/** What stands between the learner and the next module. */
export function NextUnlockCard({
  data,
  current,
  next,
  required,
}: {
  data: NextUnlock;
  current: Module;
  next?: Module;
  required: { passed: number; total: number };
}) {
  const itemsDone = required.passed === required.total;
  return (
    <Card className="justify-between gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Next unlock</p>
          <h3 className="mt-1.5 font-semibold">{next ? `Module ${next.number} · ${next.title}` : "Track complete"}</h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Pass the Module {current.number} checkpoint with {data.passScore}% or more.
          </p>
        </div>
        <ScoreRing score={data.lastScore} passScore={data.passScore} size={64} label="last" />
      </div>
      <ul className="space-y-1.5 text-[13px]">
        <li className="flex items-center gap-2">
          <Check className={itemsDone ? "size-3.5 text-success" : "size-3.5 text-muted-foreground"} />
          Required items {required.passed}/{required.total} passed
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <Shuffle className="size-3.5" />
          Retake draws a fresh, randomized question set
        </li>
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={routes.exam(data.examId)}>Retake checkpoint</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href={routes.examResult(data.examId)}>Last result</Link>
        </Button>
      </div>
    </Card>
  );
}
