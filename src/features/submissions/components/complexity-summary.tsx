import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/shared/rich-text";
import { ComplexityChart } from "@/features/submissions/components/complexity-chart";
import type { ComplexityEstimate } from "@/types/practice";

const CONFIDENCE_VARIANT = { high: "success", medium: "warning", low: "destructive" } as const;

/**
 * Estimated time and space complexity. Always labelled as an estimate: it combines
 * timing on growing inputs with the AI reading the code. Large hidden tests enforce limits.
 */
export function ComplexitySummary({ complexity, timeLimitMs }: { complexity: ComplexityEstimate; timeLimitMs?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Estimate</Badge>
        <Badge variant={CONFIDENCE_VARIANT[complexity.confidence]}>{complexity.confidence} confidence</Badge>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-md border p-3">
          <dt className="text-xs text-muted-foreground">Time</dt>
          <dd className="mt-0.5 font-mono text-base font-semibold">{complexity.time}</dd>
        </div>
        <div className="rounded-md border p-3">
          <dt className="text-xs text-muted-foreground">Space</dt>
          <dd className="mt-0.5 font-mono text-base font-semibold">{complexity.space}</dd>
        </div>
      </dl>
      <ComplexityChart samples={complexity.samples} timeLimitMs={timeLimitMs} />
      <p className="text-[13px] text-muted-foreground">
        <RichText text={complexity.note} />
      </p>
      <p className="flex gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Measured by timing your code on growing input sizes, then checked by the AI reviewer reading your code. Large hidden tests are what
        actually enforce the time limit.
      </p>
    </div>
  );
}
