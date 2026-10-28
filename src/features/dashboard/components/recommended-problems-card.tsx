import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { routes } from "@/lib/routes";
import type { ProblemSummary } from "@/types/practice";

/** Problems picked by adaptive selection, each with the reason it was chosen. */
export function RecommendedProblemsCard({ problems, reasons }: { problems: ProblemSummary[]; reasons: Record<string, string> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> Recommended practice
        </CardTitle>
        <CardDescription>Picked for you from your weakest skills and target companies.</CardDescription>
        <CardAction>
          <Link href={routes.practice} className="text-[13px] font-medium text-primary hover:underline">
            Problem bank
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-3">
        <ul className="divide-y">
          {problems.slice(0, 4).map((p) => (
            <li key={p.id}>
              <Link href={routes.problem(p.id)} className="group flex items-center gap-3 rounded-md px-2 py-3 hover:bg-accent/50">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium">{p.title}</span>
                    <DifficultyBadge difficulty={p.difficulty} />
                    {p.kind === "sql" && <span className="text-xs text-muted-foreground">SQL</span>}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">{reasons[p.id] ?? p.topics.join(", ")}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
