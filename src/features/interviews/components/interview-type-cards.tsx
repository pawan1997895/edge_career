import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import { INTERVIEW_TYPE_LABELS, type InterviewSummary, type InterviewType } from "@/types/interviews";
import { formatInterviewScore, INTERVIEW_TYPE_ICONS } from "./interview-badges";

const TYPE_DETAILS: Record<InterviewType, { description: string; length: string }> = {
  dsa: { description: "Solve a coding problem live while explaining your approach and complexity.", length: "45 min" },
  lld: { description: "Model classes for a real system and extend them as requirements change.", length: "60 min" },
  hld: { description: "Design a large-scale system on the canvas: APIs, data, scaling and trade-offs.", length: "60 min" },
  behavioral: { description: "Answer ownership, conflict and leadership questions with structured stories.", length: "30 min" },
};

export const INTERVIEW_TYPES: InterviewType[] = ["dsa", "lld", "hld", "behavioral"];

/** One card per interview type, with the modes available and the latest score. */
export function InterviewTypeCards({ history }: { history: InterviewSummary[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {INTERVIEW_TYPES.map((type) => {
        const Icon = INTERVIEW_TYPE_ICONS[type];
        const last = history.find((s) => s.type === type && s.overallScore !== undefined);
        return (
          <Card key={type} className="gap-3 p-4">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </span>
              <span className="text-xs text-muted-foreground">{TYPE_DETAILS[type].length}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold">{INTERVIEW_TYPE_LABELS[type]}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">{TYPE_DETAILS[type].description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline">
                <Check /> Text
              </Badge>
              <Badge variant="outline">
                <Check /> Voice
              </Badge>
              <Badge variant="muted">Avatar · Phase 2 preview</Badge>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
              <span className="text-xs text-muted-foreground">
                Last score <span className="font-medium text-foreground tabular-nums">{formatInterviewScore(last?.overallScore)}</span>
              </span>
              <Button size="sm" asChild>
                <Link href={routes.interviewSetup(type)}>Start</Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
