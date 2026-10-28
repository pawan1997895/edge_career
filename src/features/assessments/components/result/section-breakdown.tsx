import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SectionResult } from "@/types/assessments";

export function SectionBreakdown({ sections, passScore }: { sections: SectionResult[]; passScore: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section breakdown</CardTitle>
        <CardDescription>Your total is the weighted average of these sections.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sections.map((s) => (
            <li key={s.title}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{s.title}</span>
                <span className="flex items-baseline gap-2">
                  <span className="text-xs text-muted-foreground">weight {s.weight}%</span>
                  <span className="font-semibold tabular-nums">{s.score}%</span>
                </span>
              </div>
              <Progress
                className="mt-2"
                value={s.score}
                tone={s.score >= passScore ? "success" : s.score >= passScore - 5 ? "warning" : "destructive"}
                aria-label={`${s.title} score`}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
