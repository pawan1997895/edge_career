"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { RichText } from "@/components/shared/rich-text";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/types/assessments";

export function SingleChoiceQuestion({ question, value, onChange }: { question: ExamQuestion; value: string; onChange: (value: string) => void }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} aria-label="Answer options">
      {question.options?.map((o, i) => (
        <RadioCard key={o.id} value={o.id} title={<RichText text={`${String.fromCharCode(65 + i)}.  ${o.label}`} />} />
      ))}
    </RadioGroup>
  );
}

export function MultiChoiceQuestion({
  question,
  value,
  onChange,
}: {
  question: ExamQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(id: string, checked: boolean) {
    onChange(checked ? [...value, id] : value.filter((v) => v !== id));
  }

  return (
    <div className="grid gap-3" role="group" aria-label="Answer options (select all that apply)">
      {question.options?.map((o, i) => {
        const checked = value.includes(o.id);
        return (
          <label
            key={o.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-4 text-sm shadow-xs transition-colors hover:bg-accent/50",
              checked && "border-primary bg-accent",
            )}
          >
            <Checkbox checked={checked} onCheckedChange={(c) => toggle(o.id, c === true)} className="mt-0.5" />
            <RichText text={`${String.fromCharCode(65 + i)}.  ${o.label}`} className="font-medium" />
          </label>
        );
      })}
    </div>
  );
}
