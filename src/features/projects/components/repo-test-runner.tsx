"use client";

import * as React from "react";
import { ChevronRight, CircleCheck, CircleX, FlaskConical, GitBranch, GitCommitHorizontal, LoaderCircle, Play } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProjectDetail, TestSuiteResult } from "@/types/projects";

/** What the runner reports when a repository has no compose file yet (first run of a new project). */
const BUILD_FAILURE: TestSuiteResult[] = [
  {
    id: "build",
    name: "Build & start",
    passed: 0,
    failed: 1,
    durationMs: 8400,
    log: "$ docker compose up --build -d\nno configuration file provided: not found\n\nAdd a docker-compose.yml at the repository root that starts the service on port 8080.",
  },
];

/** Pick a repository and branch, run the hidden test suite against it and read the results. */
export function RepoTestRunner({ project }: { project: ProjectDetail }) {
  const [repo, setRepo] = React.useState(project.repo ?? project.repositories[0] ?? "");
  const [branch, setBranch] = React.useState(project.branches[0] ?? "main");
  const run = useSimulatedAction(() => (project.suites.length ? project.suites : BUILD_FAILURE), 2600);

  const suites = run.data ?? (project.suites.length ? project.suites : undefined);
  const commit = project.latestCommit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="size-4 text-muted-foreground" /> Repository tests
        </CardTitle>
        <CardDescription>We clone the branch, start it with docker compose and run the hidden API test suite. Limit: 10 minutes per run.</CardDescription>
        <CardAction>
          <Button size="sm" onClick={run.run} disabled={run.isLoading || !repo}>
            {run.isLoading ? <LoaderCircle className="animate-spin" /> : <Play />} Run tests
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select value={repo} onValueChange={setRepo}>
            <SelectTrigger className="w-full font-mono text-[12.5px]" aria-label="Repository">
              <SelectValue placeholder="Choose a repository" />
            </SelectTrigger>
            <SelectContent>
              {project.repositories.map((r) => (
                <SelectItem key={r} value={r} className="font-mono text-[12.5px]">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-full" aria-label="Branch">
              <GitBranch className="text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {project.branches.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {commit && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-muted/60 px-3 py-2 text-[13px]">
            <GitCommitHorizontal className="size-4 text-muted-foreground" />
            <code className="text-xs">{commit.sha}</code>
            <span className="min-w-0 flex-1 truncate">{commit.message}</span>
            <span className="text-xs text-muted-foreground">
              {commit.author} · {formatRelative(commit.at)}
            </span>
          </div>
        )}

        {run.isLoading ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin text-primary" /> Cloning {repo}@{branch}, building containers and running tests…
            </p>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-11" />
            ))}
          </div>
        ) : suites ? (
          <SuiteResults suites={suites} fresh={run.status === "success"} />
        ) : (
          <EmptyState icon={FlaskConical} title="No test runs yet" description="Run the tests to see which requirements your code already meets." />
        )}
      </CardContent>
    </Card>
  );
}

function SuiteResults({ suites, fresh }: { suites: TestSuiteResult[]; fresh: boolean }) {
  const passed = suites.reduce((s, x) => s + x.passed, 0);
  const total = suites.reduce((s, x) => s + x.passed + x.failed, 0);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">
          {passed} of {total} tests passed
        </span>
        {fresh && <Badge variant="info">Just now</Badge>}
      </div>
      <Progress value={(passed / total) * 100} tone={passed === total ? "success" : "warning"} />
      <ul className="divide-y rounded-lg border">
        {suites.map((suite) => (
          <SuiteRow key={suite.id} suite={suite} />
        ))}
      </ul>
    </div>
  );
}

function SuiteRow({ suite }: { suite: TestSuiteResult }) {
  const [open, setOpen] = React.useState(suite.failed > 0);
  const ok = suite.failed === 0;
  return (
    <li>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-muted/40">
        <ChevronRight className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} />
        {ok ? <CircleCheck className="size-4 shrink-0 text-success" /> : <CircleX className="size-4 shrink-0 text-destructive" />}
        <span className="min-w-0 flex-1 truncate text-sm">{suite.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {suite.passed}/{suite.passed + suite.failed} · {(suite.durationMs / 1000).toFixed(1)} s
        </span>
      </button>
      {open && <pre className="mx-3 mb-3 overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-[12px] leading-relaxed whitespace-pre">{suite.log}</pre>}
    </li>
  );
}
