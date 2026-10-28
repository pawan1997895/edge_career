import Link from "next/link";
import { CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ContinueLearning } from "@/types/dashboard";

export function ContinueLearningCard({ data }: { data: ContinueLearning }) {
  const percent = Math.round((data.atSec / data.durationSec) * 100);
  return (
    <Card className="justify-between gap-4 p-5">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Continue where you left off</p>
        <h3 className="mt-1.5 font-semibold">{data.title}</h3>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{data.moduleLabel}</p>
      </div>
      <div className="space-y-2">
        <Progress value={percent} aria-label="Lesson progress" />
        <p className="text-xs tabular-nums text-muted-foreground">
          {formatClock(data.atSec)} of {formatClock(data.durationSec)} watched
        </p>
      </div>
      <Button asChild className="self-start">
        <Link href={routes.lesson(data.lessonId, data.atSec)}>
          <CirclePlay /> Resume lesson
        </Link>
      </Button>
    </Card>
  );
}
