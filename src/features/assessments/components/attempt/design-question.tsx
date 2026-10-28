"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/types/assessments";
import { wordCount } from "./attempt-types";

/** Written system-design answer with a soft word limit. */
export function DesignQuestion({ question, value, onChange }: { question: ExamQuestion; value: string; onChange: (value: string) => void }) {
  const words = wordCount(value);
  const limit = question.wordLimit ?? 250;
  const over = words > limit;

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        placeholder="Structure your answer: data model, key generation, read path, failure handling…"
        aria-label="Your answer"
        aria-invalid={over || undefined}
        className="min-h-72 resize-y leading-relaxed"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Graded against the rubric: correctness, trade-offs, scalability, failure handling.</span>
        <span className={cn("shrink-0 tabular-nums", over && "font-medium text-destructive")}>
          {words} / {limit} words
        </span>
      </div>
    </div>
  );
}
