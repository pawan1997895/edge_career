"use client";

import * as React from "react";
import Link from "next/link";
import { Funnel, ListChecks, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { VerdictBadge } from "@/components/shared/status-badges";
import { ReviewStatusBadge } from "@/features/submissions/components/review-status";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Language, Submission, Verdict } from "@/types/practice";
import { LANGUAGE_LABELS, VERDICT_LABELS } from "@/types/practice";

const ALL = "all";

/** Filterable table of every submission the learner has made. */
export function SubmissionHistory({ submissions }: { submissions: Submission[] }) {
  const [query, setQuery] = React.useState("");
  const [verdict, setVerdict] = React.useState<string>(ALL);
  const [language, setLanguage] = React.useState<string>(ALL);
  const [kind, setKind] = React.useState<string>(ALL);

  const verdicts = unique(submissions.map((s) => s.verdict));
  const languages = unique(submissions.map((s) => s.language));

  const filtered = submissions.filter(
    (s) =>
      (query === "" || s.problemTitle.toLowerCase().includes(query.toLowerCase())) &&
      (verdict === ALL || s.verdict === verdict) &&
      (language === ALL || s.language === language) &&
      (kind === ALL || s.kind === kind),
  );
  const filtersActive = query !== "" || verdict !== ALL || language !== ALL || kind !== ALL;

  function clearFilters() {
    setQuery("");
    setVerdict(ALL);
    setLanguage(ALL);
    setKind(ALL);
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No submissions yet"
        description="Submit a solution in the coding workspace and your results, scores and AI feedback will appear here."
        action={
          <Button asChild>
            <Link href={routes.practice}>Open the problem bank</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-2 border-b p-4 md:flex-row md:items-center">
        <div className="relative md:max-w-xs md:flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by problem" className="pl-8" aria-label="Search submissions" />
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex">
          <FilterSelect label="Verdict" value={verdict} onChange={setVerdict} options={verdicts.map((v) => ({ value: v, label: VERDICT_LABELS[v as Verdict] }))} />
          <FilterSelect label="Language" value={language} onChange={setLanguage} options={languages.map((l) => ({ value: l, label: LANGUAGE_LABELS[l as Language] }))} />
          <FilterSelect
            label="Type"
            value={kind}
            onChange={setKind}
            options={[
              { value: "code", label: "Code" },
              { value: "sql", label: "SQL" },
            ]}
          />
        </div>
        {filtersActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="md:ml-auto">
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Funnel}
          title="No submissions match these filters"
          description="Try a different verdict or language, or clear the filters."
          action={
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          }
          className="m-4"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Problem</TableHead>
              <TableHead className="hidden sm:table-cell">Language</TableHead>
              <TableHead>Verdict</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="hidden text-right md:table-cell">Runtime</TableHead>
              <TableHead className="hidden lg:table-cell">Review</TableHead>
              <TableHead className="hidden text-right sm:table-cell">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="max-w-56 sm:max-w-xs">
                  <Link href={routes.submission(s.id)} className="block truncate font-medium hover:text-primary">
                    {s.problemTitle}
                  </Link>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {s.id}
                    {s.kind === "sql" && <Badge variant="muted">SQL</Badge>}
                  </span>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{LANGUAGE_LABELS[s.language]}</TableCell>
                <TableCell>
                  <VerdictBadge verdict={s.verdict} />
                </TableCell>
                <TableCell className={cn("text-right font-medium tabular-nums", s.score.total < 60 && "text-destructive")}>{s.score.total}</TableCell>
                <TableCell className="hidden text-right text-muted-foreground tabular-nums md:table-cell">
                  {s.verdict === "compile_error" ? "—" : `${s.runtimeMs} ms`}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <ReviewStatusBadge review={s.review} />
                </TableCell>
                <TableCell className="hidden text-right text-muted-foreground sm:table-cell">{formatRelative(s.submittedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
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
      <SelectTrigger size="sm" className="w-full md:w-40" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All {label.toLowerCase()}s</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
