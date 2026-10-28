"use client";

import { Flag } from "lucide-react";
import { RichText } from "@/components/shared/rich-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/types/assessments";
import type { Language } from "@/types/practice";
import type { Answer } from "./attempt-types";
import { MultiChoiceQuestion, SingleChoiceQuestion } from "./choice-question";
import { CodingQuestion } from "./coding-question";
import { DesignQuestion } from "./design-question";

const KIND_HINT: Record<ExamQuestion["kind"], string> = {
  single: "Choose one answer",
  multi: "Select all that apply",
  code: "Write and test your code",
  design: "Written answer",
};

export function QuestionPanel({
  question,
  number,
  total,
  answer,
  language,
  flagged,
  onAnswer,
  onLanguageChange,
  onToggleFlag,
}: {
  question: ExamQuestion;
  number: number;
  total: number;
  answer: Answer | undefined;
  language: Language;
  flagged: boolean;
  onAnswer: (answer: Answer) => void;
  onLanguageChange: (language: Language) => void;
  onToggleFlag: () => void;
}) {
  return (
    <article className={cn("mx-auto w-full px-4 py-6 sm:px-6", question.kind === "code" ? "max-w-5xl" : "max-w-3xl")}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted-foreground">
            Question {number} of {total} · {question.sectionTitle}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{KIND_HINT[question.kind]}</Badge>
            <Badge variant="outline">{question.points} points</Badge>
          </div>
        </div>
        <Button variant={flagged ? "secondary" : "ghost"} size="sm" onClick={onToggleFlag} aria-pressed={flagged}>
          <Flag className={cn(flagged && "fill-warning text-warning")} /> {flagged ? "Flagged" : "Flag for review"}
        </Button>
      </header>

      <div className="mt-5 text-[15px] leading-relaxed">
        <RichText text={question.prompt} />
      </div>

      <div className="mt-6">
        {question.kind === "single" && (
          <SingleChoiceQuestion question={question} value={typeof answer === "string" ? answer : ""} onChange={onAnswer} />
        )}
        {question.kind === "multi" && (
          <MultiChoiceQuestion question={question} value={Array.isArray(answer) ? answer : []} onChange={onAnswer} />
        )}
        {question.kind === "code" && (
          <CodingQuestion
            question={question}
            language={language}
            code={typeof answer === "string" ? answer : (question.starterCode?.[language] ?? "")}
            onCodeChange={onAnswer}
            onLanguageChange={onLanguageChange}
          />
        )}
        {question.kind === "design" && (
          <DesignQuestion question={question} value={typeof answer === "string" ? answer : ""} onChange={onAnswer} />
        )}
      </div>
    </article>
  );
}
