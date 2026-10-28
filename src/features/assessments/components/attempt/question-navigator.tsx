import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamQuestion } from "@/types/assessments";

export interface NavigatorState {
  answered: boolean;
  flagged: boolean;
}

function QuestionButton({
  number,
  state,
  current,
  onClick,
}: {
  number: number;
  state: NavigatorState;
  current: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={current ? "step" : undefined}
      aria-label={`Question ${number}${state.answered ? ", answered" : ""}${state.flagged ? ", flagged" : ""}`}
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-md border text-sm font-medium tabular-nums transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        state.answered ? "border-primary/30 bg-primary/10 text-primary" : "bg-card hover:bg-accent",
        current && "ring-2 ring-primary ring-offset-1 ring-offset-background",
      )}
    >
      {number}
      {state.flagged && <Flag className="absolute -top-1.5 -right-1.5 size-3.5 fill-warning text-warning" />}
    </button>
  );
}

/** Desktop sidebar: questions grouped by section, with a legend and progress summary. */
export function QuestionNavigator({
  questions,
  states,
  current,
  onSelect,
}: {
  questions: ExamQuestion[];
  states: NavigatorState[];
  current: number;
  onSelect: (index: number) => void;
}) {
  const sections = [...new Set(questions.map((q) => q.sectionTitle))];
  const answered = states.filter((s) => s.answered).length;
  const flagged = states.filter((s) => s.flagged).length;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <p className="text-sm font-medium">
          {answered} of {questions.length} answered
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>
        {flagged > 0 && <p className="mt-2 text-xs text-muted-foreground">{flagged} flagged for review</p>}
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {sections.map((section) => (
          <div key={section}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{section}</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) =>
                q.sectionTitle === section ? (
                  <QuestionButton key={q.id} number={i + 1} state={states[i]!} current={i === current} onClick={() => onSelect(i)} />
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 border-t p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="size-3 rounded-sm border border-primary/30 bg-primary/10" /> Answered
        </p>
        <p className="flex items-center gap-2">
          <span className="size-3 rounded-sm border bg-card" /> Not answered
        </p>
        <p className="flex items-center gap-2">
          <Flag className="size-3 fill-warning text-warning" /> Flagged for review
        </p>
      </div>
    </div>
  );
}

/** Phone/tablet: a single scrollable row of question numbers. */
export function QuestionStrip({
  states,
  current,
  onSelect,
}: {
  states: NavigatorState[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1.5">
      {states.map((state, i) => (
        <QuestionButton key={i} number={i + 1} state={state} current={i === current} onClick={() => onSelect(i)} />
      ))}
    </div>
  );
}
