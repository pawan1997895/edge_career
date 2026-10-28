"use client";

import { BookOpen, Database, Lightbulb, ListChecks } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HintLadder } from "@/features/practice/components/hint-ladder";
import { ProblemDescription } from "@/features/practice/components/problem-description";
import { ProblemSubmissions } from "@/features/practice/components/problem-submissions";
import { SqlSchema } from "@/features/practice/components/sql-schema";
import type { ProblemDetail, Submission } from "@/types/practice";
import type { ProblemHint } from "@/types/submissions";

/** Left side of the workspace: description, schema (SQL), hints and this problem's submissions. */
export function ProblemPane({
  problem,
  moduleLabel,
  hints,
  revealedHints,
  onRevealHint,
  submissions,
  latestSubmission,
  latestHref,
}: {
  problem: ProblemDetail;
  moduleLabel?: string;
  hints: ProblemHint[];
  revealedHints: number;
  onRevealHint: () => void;
  submissions: Submission[];
  latestSubmission?: Submission;
  latestHref: string;
}) {
  const count = submissions.length + (latestSubmission ? 1 : 0);
  return (
    <Tabs defaultValue="description" className="flex min-h-0 flex-1 flex-col gap-0 bg-card">
      <div className="shrink-0 border-b px-4">
        <TabsList variant="line" className="border-0">
          <TabsTrigger value="description">
            <BookOpen /> Description
          </TabsTrigger>
          {problem.schema && (
            <TabsTrigger value="schema">
              <Database /> Schema
            </TabsTrigger>
          )}
          <TabsTrigger value="hints">
            <Lightbulb /> Hints
            {revealedHints > 0 && <span className="text-xs text-muted-foreground">{revealedHints}/4</span>}
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <ListChecks /> Submissions
            {count > 0 && <span className="text-xs text-muted-foreground">{count}</span>}
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="description" className="min-h-0 flex-1 overflow-y-auto">
        <ProblemDescription problem={problem} moduleLabel={moduleLabel} />
      </TabsContent>
      {problem.schema && (
        <TabsContent value="schema" className="min-h-0 flex-1 overflow-y-auto">
          <SqlSchema tables={problem.schema} />
        </TabsContent>
      )}
      <TabsContent value="hints" className="min-h-0 flex-1 overflow-y-auto">
        <HintLadder hints={hints} revealed={revealedHints} onReveal={onRevealHint} problemId={problem.id} />
      </TabsContent>
      <TabsContent value="submissions" className="min-h-0 flex-1 overflow-y-auto">
        <ProblemSubmissions submissions={submissions} latest={latestSubmission} latestHref={latestHref} />
      </TabsContent>
    </Tabs>
  );
}
