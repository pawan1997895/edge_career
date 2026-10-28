import { cn } from "@/lib/utils";

/**
 * Circular score out of 100. Colour reflects the pass bar: green at or above
 * `passScore`, amber in the human-review band just below it, red otherwise.
 */
export function ScoreRing({
  score,
  passScore = 85,
  size = 96,
  label,
  className,
}: {
  score: number;
  passScore?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const stroke = size >= 80 ? 8 : 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);
  const tone = score >= passScore ? "text-success" : score >= passScore - 5 ? "text-warning" : "text-destructive";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("stroke-current transition-[stroke-dashoffset]", tone)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-semibold tabular-nums", size >= 80 ? "text-2xl" : "text-sm")}>{Math.round(score)}</span>
        {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
