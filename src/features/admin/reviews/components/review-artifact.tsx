"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/shared/code-editor";
import { CheckStatusIcon } from "@/features/admin/content/content-badges";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LANGUAGE_LABELS } from "@/types/practice";
import type { ReviewArtifact as Artifact } from "@/types/admin-content";

/** The learner's work being reviewed: code, a design write-up, exam answers or an interview transcript. */
export function ReviewArtifact({ artifact }: { artifact: Artifact }) {
  switch (artifact.kind) {
    case "code":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Submitted code</CardTitle>
            <CardDescription>
              <code className="text-xs">{artifact.fileName}</code> · {LANGUAGE_LABELS[artifact.language]} · read-only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-hidden rounded-md border">
              <CodeEditor value={artifact.code} language={artifact.language} readOnly />
            </div>
          </CardContent>
        </Card>
      );
    case "design":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Submitted design</CardTitle>
            <CardDescription>Diagram components and written sections from the HLD canvas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Diagram components</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {artifact.components.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Automatic checks</p>
              <ul className="mt-2 space-y-1.5">
                {artifact.checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-[13px]">
                    <CheckStatusIcon status={c.status} /> {c.label}
                  </li>
                ))}
              </ul>
            </div>
            {artifact.sections.map((s) => (
              <div key={s.title}>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    case "exam":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Exam answers</CardTitle>
            <CardDescription>Questions from this learner&apos;s randomised set</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="divide-y rounded-md border">
              {artifact.questions.map((q) => (
                <li key={q.id} className={cn("flex items-start justify-between gap-3 px-3 py-2.5 text-[13px]", q.disputed && "bg-warning/8")}>
                  <span>
                    {q.prompt}
                    {q.disputed && (
                      <Badge variant="warning" className="ml-2">
                        Disputed
                      </Badge>
                    )}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {q.awarded} / {q.points}
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Answer under dispute</p>
              <div className="h-56 overflow-hidden rounded-md border">
                <CodeEditor value={artifact.disputedAnswer.code} language={artifact.disputedAnswer.language} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    case "interview":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Transcript excerpts</CardTitle>
            <CardDescription>Moments the AI scorecard cited as evidence</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {artifact.excerpts.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{formatClock(e.atSec)}</span>
                  <span>
                    <span className="font-medium capitalize">{e.speaker}: </span>
                    {e.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
  }
}
