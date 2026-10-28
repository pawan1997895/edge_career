"use client";

import * as React from "react";
import Link from "next/link";
import { Funnel, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { CiStatusBadge } from "@/features/admin/content/content-badges";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ProblemFileMeta } from "@/types/admin-content";
import type { Module } from "@/types/curriculum";
import type { ProblemSummary } from "@/types/practice";

type Row = ProblemSummary & { file: ProblemFileMeta };

export function ProblemsTable({ problems, modules }: { problems: Row[]; modules: Pick<Module, "id" | "title" | "number">[] }) {
  const [query, setQuery] = React.useState("");
  const [kind, setKind] = React.useState("all");
  const [ci, setCi] = React.useState("all");
  const [moduleId, setModuleId] = React.useState("all");

  const moduleTitle = (id: string) => {
    const m = modules.find((x) => x.id === id);
    return m ? (m.number ? `M${m.number} · ${m.title}` : m.title) : id;
  };

  const filtered = problems.filter((p) => {
    const q = query.trim().toLowerCase();
    return (
      (!q || p.title.toLowerCase().includes(q) || p.id.includes(q)) &&
      (kind === "all" || p.kind === kind) &&
      (ci === "all" || p.file.ciStatus === ci) &&
      (moduleId === "all" || p.moduleId === moduleId)
    );
  });

  const reset = () => {
    setQuery("");
    setKind("all");
    setCi("all");
    setModuleId("all");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or id" className="pl-8" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger className="w-full lg:w-32" aria-label="Kind">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ci} onValueChange={setCi}>
            <SelectTrigger className="w-full lg:w-36" aria-label="Check status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All checks</SelectItem>
              <SelectItem value="passing">Passing</SelectItem>
              <SelectItem value="failing">Failing</SelectItem>
              <SelectItem value="running">Running</SelectItem>
            </SelectContent>
          </Select>
          <Select value={moduleId} onValueChange={setModuleId}>
            <SelectTrigger className="col-span-2 w-full sm:col-span-1 lg:w-56" aria-label="Module">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {moduleTitle(m.id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground lg:ml-auto">
          {filtered.length} of {problems.length} problem files
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Funnel}
          title="No problem files match these filters"
          description="Try a different module or check status."
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="text-right">Tests (sample / hidden)</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Rubric</TableHead>
                <TableHead>Last commit</TableHead>
                <TableHead>Checks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="min-w-56">
                    <Link href={routes.admin.problem(p.id)} className="font-medium hover:text-primary">
                      {p.title}
                    </Link>
                    <p className="font-mono text-[11px] text-muted-foreground">{p.id}</p>
                  </TableCell>
                  <TableCell className="uppercase text-xs text-muted-foreground">{p.kind}</TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[13px] text-muted-foreground">{moduleTitle(p.moduleId)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.file.sampleTests} / {p.file.hiddenTests}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.file.languages.length === 1 ? "SQL" : `${p.file.languages.length} languages`}</TableCell>
                  <TableCell>
                    <code className="text-xs">{p.file.rubricVersion}</code>
                  </TableCell>
                  <TableCell className="min-w-52">
                    <p className="truncate text-[13px]">
                      <code className="text-xs text-muted-foreground">{p.file.lastCommit.sha}</code> {p.file.lastCommit.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.file.lastCommit.author} · {formatRelative(p.file.lastCommit.at)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <CiStatusBadge status={p.file.ciStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
