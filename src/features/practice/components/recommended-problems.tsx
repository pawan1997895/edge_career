import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { routes } from "@/lib/routes";
import type { ProblemSummary } from "@/types/practice";
import type { ProblemRecommendation } from "@/types/submissions";

/** Problems picked by adaptive selection, each with the reason it was chosen. */
export function RecommendedProblems({ recommendations }: { recommendations: (ProblemRecommendation & { problem: ProblemSummary })[] }) {
  if (recommendations.length === 0) return null;
  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="size-4 text-primary" /> Recommended for you
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Adaptive selection picks these from your weakest skills, recent results and target companies.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {recommendations.slice(0, 4).map(({ problem, skill, reason }) => (
          <Card key={problem.id} className="group relative p-4 transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="default">{skill}</Badge>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <Link href={routes.problem(problem.id)} className="mt-3 text-sm font-medium leading-snug after:absolute after:inset-0">
              {problem.title}
            </Link>
            <p className="mt-1 flex-1 text-[13px] text-muted-foreground">{reason}</p>
            <span className="mt-3 flex items-center gap-1 text-[13px] font-medium text-primary">
              {problem.progress === "solved" ? "Solve again" : problem.progress === "attempted" ? "Continue" : "Start"}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
