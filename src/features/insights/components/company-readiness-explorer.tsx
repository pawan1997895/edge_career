"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Building, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadinessBar } from "@/features/insights/components/readiness-bar";
import { READINESS_STATUS_LABEL, readinessStatus } from "@/features/insights/lib";
import { cn } from "@/lib/utils";
import type { CompanyReadiness } from "@/types/insights";

/** Company list with readiness bars; selecting a company shows the gaps to close. */
export function CompanyReadinessExplorer({ companies }: { companies: CompanyReadiness[] }) {
  const [selected, setSelected] = React.useState(companies[0]?.company);
  const current = companies.find((c) => c.company === selected) ?? companies[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card>
        <CardHeader>
          <CardTitle>By company</CardTitle>
          <CardDescription>The marker on each bar is the level our experts set for that company and role.</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-2 sm:px-3">
          <ul className="space-y-1">
            {companies.map((c) => {
              const status = READINESS_STATUS_LABEL[readinessStatus(c.score, c.target)];
              const active = c.company === current?.company;
              return (
                <li key={c.company}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.company)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-md px-3 py-3 text-left outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/40",
                      active && "bg-accent/70",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{c.company}</span>
                      <span className="text-xs text-muted-foreground">{c.level}</span>
                      {c.isTarget && <Badge variant="default">Target</Badge>}
                      <span className="ml-auto flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <span className="w-16 text-right text-sm tabular-nums">
                          {c.score}
                          <span className="text-muted-foreground"> / {c.target}</span>
                        </span>
                      </span>
                    </div>
                    <ReadinessBar score={c.score} target={c.target} label={`${c.company} readiness`} className="mt-2.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {current && <GapsCard company={current} />}
    </div>
  );
}

function GapsCard({ company }: { company: CompanyReadiness }) {
  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="size-4 text-muted-foreground" /> {company.company} · {company.level}
        </CardTitle>
        <CardDescription>{company.focus}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Estimated readiness</span>
          <span className="font-semibold tabular-nums">
            {company.score} <span className="font-normal text-muted-foreground">/ bar {company.target}</span>
          </span>
        </div>

        {company.gaps.length === 0 ? (
          <div className="flex items-start gap-2 rounded-md bg-success/10 p-3 text-sm">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
            <p>No skill gaps against this bar. Keep your mastery up with mock interviews.</p>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Gaps to close</p>
            <ul className="divide-y rounded-md border">
              {company.gaps.map((gap) => (
                <li key={gap.skill}>
                  <Link href={gap.href} className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{gap.skill}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        Mastery {gap.current} · needs {gap.needed}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
