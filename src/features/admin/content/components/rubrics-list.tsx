import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Rubric } from "@/types/admin-content";

/** Versioned grading rubrics. A rubric change ships as its own pull request and re-runs grader accuracy checks. */
export function RubricsList({ rubrics }: { rubrics: Rubric[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rubrics.map((rubric) => {
        const total = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);
        return (
          <Card key={rubric.id}>
            <CardHeader>
              <CardTitle>
                {rubric.name} <code className="ml-1 text-xs font-normal text-muted-foreground">{rubric.version}</code>
              </CardTitle>
              <CardDescription>
                {rubric.appliesTo} · updated {formatDate(rubric.updatedAt)} by {rubric.author}
              </CardDescription>
              <CardAction>
                <Badge variant={rubric.status === "active" ? "success" : rubric.status === "draft" ? "warning" : "muted"} className="capitalize">
                  {rubric.status}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                {rubric.criteria.map((c, i) => (
                  <span
                    key={c.id}
                    className="h-full border-r border-card last:border-0"
                    style={{ width: `${c.weight}%`, background: `var(--chart-${(i % 5) + 1})` }}
                  />
                ))}
              </div>
              <ul className="space-y-2">
                {rubric.criteria.map((c, i) => (
                  <li key={c.id} className="flex gap-2.5 text-[13px]">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: `var(--chart-${(i % 5) + 1})` }} />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{c.criterion}</span>
                      <span className="block text-xs text-muted-foreground">{c.description}</span>
                    </span>
                    <span className="tabular-nums">{c.weight}%</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">Weights total {total}%.</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
