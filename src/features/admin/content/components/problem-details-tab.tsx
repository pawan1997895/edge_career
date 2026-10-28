"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichText } from "@/components/shared/rich-text";
import type { ProblemDetail } from "@/types/practice";

export function ProblemDetailsTab({
  problem,
  modules,
  onChange,
}: {
  problem: ProblemDetail;
  modules: { id: string; title: string }[];
  onChange: () => void;
}) {
  const [statement, setStatement] = React.useState(problem.statement.join("\n\n"));
  const paragraphs = statement.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Stored in problem.yaml</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue={problem.title} onChange={onChange} />
          </div>
          <div className="grid gap-1.5">
            <Label>Difficulty</Label>
            <Select defaultValue={problem.difficulty} onValueChange={onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Module</Label>
            <Select defaultValue={problem.moduleId} onValueChange={onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="topics">Topics</Label>
            <Input id="topics" defaultValue={problem.topics.join(", ")} onChange={onChange} />
            <p className="text-xs text-muted-foreground">Comma separated. Used for skill mastery tags.</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="companies">Companies</Label>
            <Input id="companies" defaultValue={problem.companies.join(", ")} onChange={onChange} />
            <p className="text-xs text-muted-foreground">Shown to learners as &ldquo;asked at&rdquo;.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statement</CardTitle>
          <CardDescription>Blank lines separate paragraphs. Wrap inline code in `backticks`.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="statement">Source</Label>
            <Textarea
              id="statement"
              value={statement}
              onChange={(e) => {
                setStatement(e.target.value);
                onChange();
              }}
              className="min-h-56 font-mono text-[13px]"
            />
          </div>
          <div className="grid content-start gap-1.5">
            <span className="text-sm font-medium">Preview</span>
            <div className="min-h-56 space-y-3 rounded-md border bg-muted/30 p-3 text-sm leading-relaxed">
              {paragraphs.length === 0 ? (
                <p className="text-muted-foreground">The statement is empty.</p>
              ) : (
                paragraphs.map((p, i) => (
                  <p key={i}>
                    <RichText text={p} />
                  </p>
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm font-medium">Examples and constraints</p>
            <ul className="mt-2 space-y-2 text-[13px]">
              {problem.examples.map((ex, i) => (
                <li key={i} className="rounded-md border p-2.5">
                  <span className="text-muted-foreground">Input:</span> <code className="font-mono">{ex.input}</code>
                  <br />
                  <span className="text-muted-foreground">Output:</span> <code className="font-mono whitespace-pre-line">{ex.output}</code>
                </li>
              ))}
            </ul>
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[13px] text-muted-foreground">
              {problem.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
