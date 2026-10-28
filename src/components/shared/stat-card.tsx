import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** A single headline number with a label and optional trend. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  /** Signed change, e.g. +4 or -2. Positive is shown in green. */
  trend?: { value: string; positive: boolean };
  className?: string;
}) {
  return (
    <Card className={cn("gap-1 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {(hint || trend) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {trend && (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", trend.positive ? "text-success" : "text-destructive")}>
              {trend.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend.value}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </Card>
  );
}
