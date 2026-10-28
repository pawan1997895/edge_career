"use client";

import * as React from "react";
import Link from "next/link";
import { Funnel, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/shared/empty-state";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { ProblemStatusIcon } from "@/features/practice/components/problem-status-icon";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ModuleStatus } from "@/types/curriculum";
import type { ProblemSummary } from "@/types/practice";

/** What the problem bank needs to know about each module. */
export interface ModuleRef {
  id: string;
  title: string;
  number?: number;
  status: ModuleStatus;
}

const ALL = "all";

interface Filters {
  query: string;
  difficulty: string;
  status: string;
  kind: string;
  moduleId: string;
  topic: string;
}

const EMPTY_FILTERS: Filters = { query: "", difficulty: ALL, status: ALL, kind: ALL, moduleId: ALL, topic: ALL };

export function ProblemBank({ problems, modules }: { problems: ProblemSummary[]; modules: ModuleRef[] }) {
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const moduleById = new Map(modules.map((m) => [m.id, m]));
  const isLocked = (p: ProblemSummary) => p.locked === true || moduleById.get(p.moduleId)?.status === "locked";

  const topics = [...new Set(problems.flatMap((p) => p.topics))].sort();
  const moduleOptions = modules.filter((m) => problems.some((p) => p.moduleId === m.id));

  const filtered = problems.filter((p) => {
    const q = filters.query.trim().toLowerCase();
    return (
      (q === "" || p.title.toLowerCase().includes(q) || p.topics.some((t) => t.toLowerCase().includes(q))) &&
      (filters.difficulty === ALL || p.difficulty === filters.difficulty) &&
      (filters.status === ALL || (filters.status === "locked" ? isLocked(p) : !isLocked(p) && p.progress === filters.status)) &&
      (filters.kind === ALL || p.kind === filters.kind) &&
      (filters.moduleId === ALL || p.moduleId === filters.moduleId) &&
      (filters.topic === ALL || p.topics.includes(filters.topic))
    );
  });

  const update = (key: keyof Filters) => (value: string) => setFilters((f) => ({ ...f, [key]: value }));
  const filtersActive = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <Card className="overflow-hidden">
      <div className="space-y-2 border-b p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative lg:max-w-xs lg:flex-1">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.query}
              onChange={(e) => update("query")(e.target.value)}
              placeholder="Search problems or topics"
              className="pl-8"
              aria-label="Search problems"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
            <FilterSelect
              label="Difficulty"
              value={filters.difficulty}
              onChange={update("difficulty")}
              options={[
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
              ]}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={update("status")}
              options={[
                { value: "solved", label: "Solved" },
                { value: "attempted", label: "Attempted" },
                { value: "not_started", label: "Not started" },
                { value: "locked", label: "Locked" },
              ]}
            />
            <FilterSelect
              label="Type"
              value={filters.kind}
              onChange={update("kind")}
              options={[
                { value: "code", label: "Code" },
                { value: "sql", label: "SQL" },
              ]}
            />
            <FilterSelect
              label="Module"
              value={filters.moduleId}
              onChange={update("moduleId")}
              options={moduleOptions.map((m) => ({ value: m.id, label: moduleLabel(m) }))}
            />
            <FilterSelect label="Topic" value={filters.topic} onChange={update("topic")} options={topics.map((t) => ({ value: t, label: t }))} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {problems.length} problems
          </span>
          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Funnel}
          title="No problems match these filters"
          description="Try another topic or difficulty, or clear the filters to see the whole bank."
          action={
            <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </Button>
          }
          className="m-4"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <span className="sr-only">Status</span>
              </TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Topics</TableHead>
              <TableHead className="hidden text-right sm:table-cell">Acceptance</TableHead>
              <TableHead className="hidden xl:table-cell">Asked at</TableHead>
              <TableHead className="hidden lg:table-cell">Module</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <ProblemRow key={p.id} problem={p} module={moduleById.get(p.moduleId)} locked={isLocked(p)} />
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

function ProblemRow({ problem: p, module: mod, locked }: { problem: ProblemSummary; module?: ModuleRef; locked: boolean }) {
  return (
    <TableRow className={cn(locked && "text-muted-foreground")}>
      <TableCell>
        <ProblemStatusIcon progress={p.progress} locked={locked} />
      </TableCell>
      <TableCell className="max-w-52 sm:max-w-sm">
        <div className="flex items-center gap-2">
          {locked ? (
            <Tooltip content={`Unlocks when you reach ${mod ? moduleLabel(mod) : "its module"}`}>
              <span className="cursor-not-allowed truncate font-medium" tabIndex={0}>
                {p.title}
              </span>
            </Tooltip>
          ) : (
            <Link href={routes.problem(p.id)} className="truncate font-medium hover:text-primary">
              {p.title}
            </Link>
          )}
          {p.kind === "sql" && <Badge variant="muted">SQL</Badge>}
          {p.recommended && !locked && (
            <Badge variant="default" className="hidden sm:inline-flex">
              For you
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <DifficultyBadge difficulty={p.difficulty} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <TagList items={p.topics} />
      </TableCell>
      <TableCell className="hidden text-right tabular-nums sm:table-cell">{p.acceptanceRate}%</TableCell>
      <TableCell className="hidden xl:table-cell">
        <span className="text-[13px] text-muted-foreground">
          {p.companies.slice(0, 2).join(", ")}
          {p.companies.length > 2 && ` +${p.companies.length - 2}`}
        </span>
      </TableCell>
      <TableCell className="hidden text-[13px] text-muted-foreground lg:table-cell">{mod ? moduleLabel(mod) : "—"}</TableCell>
    </TableRow>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, 2).map((t) => (
        <Badge key={t} variant="secondary" className="font-normal">
          {t}
        </Badge>
      ))}
      {items.length > 2 && <span className="text-xs text-muted-foreground">+{items.length - 2}</span>}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full lg:w-auto lg:min-w-32" aria-label={label}>
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function moduleLabel(m: ModuleRef) {
  return m.number ? `M${m.number} · ${m.title}` : m.title;
}
