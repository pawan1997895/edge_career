import Link from "next/link";
import { Boxes, Building, Clock, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { DesignStatusBadge } from "@/features/system-design/components/design-status-badge";
import { formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { DesignKind, DesignProblemSummary, DesignStatus } from "@/types/system-design";

const ACTION_LABEL: Record<DesignStatus, string> = {
  not_started: "Start",
  in_progress: "Continue",
  in_review: "View submission",
  passed: "Open",
  failed: "Revise",
};

export function DesignProblemList({ problems }: { problems: DesignProblemSummary[] }) {
  const byKind = (kind: DesignKind) => problems.filter((p) => p.kind === kind);
  return (
    <Tabs defaultValue="hld">
      <TabsList variant="line">
        <TabsTrigger value="hld">
          <Network /> High-level design
          <span className="text-xs text-muted-foreground tabular-nums">{byKind("hld").length}</span>
        </TabsTrigger>
        <TabsTrigger value="lld">
          <Boxes /> Low-level design
          <span className="text-xs text-muted-foreground tabular-nums">{byKind("lld").length}</span>
        </TabsTrigger>
      </TabsList>
      {(["hld", "lld"] as const).map((kind) => (
        <TabsContent key={kind} value={kind} className="space-y-3">
          {byKind(kind).map((problem) => (
            <DesignProblemRow key={problem.id} problem={problem} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DesignProblemRow({ problem }: { problem: DesignProblemSummary }) {
  const href = problem.kind === "hld" ? routes.hld(problem.id) : routes.lld(problem.id);
  const Icon = problem.kind === "hld" ? Network : Boxes;
  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <span className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground sm:flex">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={href} className="font-medium hover:text-primary">
            {problem.title}
          </Link>
          <Badge variant={problem.required ? "secondary" : "outline"}>{problem.required ? "Module 4 assignment" : "Extra practice"}</Badge>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{problem.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {formatMinutes(problem.estimatedMin)}
          </span>
          <span className="flex items-center gap-1">
            <Building className="size-3.5" /> {problem.companies.join(", ")}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <DesignStatusBadge status={problem.status} />
        {problem.lastScore !== undefined && (
          <span className="text-xs text-muted-foreground">
            Last score <span className="font-medium text-foreground tabular-nums">{problem.lastScore}%</span>
          </span>
        )}
      </div>
      <Button variant={problem.status === "not_started" || problem.status === "in_progress" ? "default" : "outline"} size="sm" asChild>
        <Link href={href}>{ACTION_LABEL[problem.status]}</Link>
      </Button>
    </Card>
  );
}
