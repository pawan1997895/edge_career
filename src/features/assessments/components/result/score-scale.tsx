/** Horizontal 0–100 scale showing the score against the pass line and the human-review band. */
export function ScoreScale({ score, passScore, band }: { score: number; passScore: number; band: { min: number; max: number } }) {
  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-sm bg-warning/35"
          style={{ left: `${band.min}%`, width: `${band.max - band.min}%` }}
          aria-hidden
        />
        <div className="absolute -inset-y-1.5 w-0.5 rounded bg-foreground/70" style={{ left: `${passScore}%` }} aria-hidden />
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow-sm"
          style={{ left: `${score}%` }}
          role="img"
          aria-label={`Score ${score}%, pass mark ${passScore}%`}
        />
      </div>
      <div className="relative mt-2 h-4 text-[11px] text-muted-foreground">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-full pr-1" style={{ left: `${band.min}%` }}>
          Review band
        </span>
        <span className="absolute pl-1 font-medium text-foreground" style={{ left: `${passScore}%` }}>
          Pass {passScore}
        </span>
        <span className="absolute right-0">100</span>
      </div>
    </div>
  );
}
