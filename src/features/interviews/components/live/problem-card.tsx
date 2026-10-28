import { RichText } from "@/components/shared/rich-text";
import type { LiveSession } from "@/types/interviews";

/** The problem the interviewer presented, pinned for reference during the session. */
export function ProblemCard({ problem }: { problem: LiveSession["problem"] }) {
  return (
    <div className="space-y-4 p-4 text-sm">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Problem</p>
        <h2 className="mt-1 font-semibold">{problem.title}</h2>
      </div>
      <div className="space-y-2 leading-relaxed">
        {problem.statement.map((p, i) => (
          <p key={i}>
            <RichText text={p} />
          </p>
        ))}
      </div>
      {problem.examples.map((ex, i) => (
        <div key={i} className="rounded-md border bg-muted/40 p-3 font-mono text-[12.5px] leading-relaxed">
          <p>
            <span className="text-muted-foreground">Input:</span> {ex.input}
          </p>
          <p>
            <span className="text-muted-foreground">Output:</span> {ex.output}
          </p>
          {ex.explanation && <p className="mt-1 font-sans text-[13px] text-muted-foreground">{ex.explanation}</p>}
        </div>
      ))}
      <ul className="list-disc space-y-1 pl-5 text-[13px] text-muted-foreground">
        {problem.constraints.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
