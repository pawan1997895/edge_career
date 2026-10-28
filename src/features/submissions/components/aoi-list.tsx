import { Bug, Gauge, Glasses, Paintbrush, ScanSearch, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/shared/rich-text";
import type { AoiCategory, AoiItem } from "@/types/practice";
import { cn } from "@/lib/utils";

const CATEGORY: Record<AoiCategory, { label: string; icon: LucideIcon }> = {
  edge_cases: { label: "Edge cases", icon: ScanSearch },
  readability: { label: "Readability", icon: Glasses },
  complexity: { label: "Complexity", icon: Gauge },
  correctness: { label: "Correctness", icon: Bug },
  style: { label: "Style", icon: Paintbrush },
};

const SEVERITY = {
  important: { label: "Important", variant: "destructive" },
  suggestion: { label: "Suggestion", variant: "warning" },
  info: { label: "Note", variant: "muted" },
} as const;

/** Areas of Improvement (AOIs) from the AI review, most severe first. */
export function AoiList({ aois, className }: { aois: AoiItem[]; className?: string }) {
  const order = { important: 0, suggestion: 1, info: 2 };
  const sorted = [...aois].sort((a, b) => order[a.severity] - order[b.severity]);
  return (
    <ul className={cn("space-y-2.5", className)}>
      {sorted.map((aoi) => {
        const { label, icon: Icon } = CATEGORY[aoi.category];
        const severity = SEVERITY[aoi.severity];
        return (
          <li key={aoi.id} className="rounded-md border p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {label}
              </span>
              <Badge variant={severity.variant}>{severity.label}</Badge>
              {aoi.line && <span className="ml-auto font-mono text-xs text-muted-foreground">Line {aoi.line}</span>}
            </div>
            <p className="mt-1.5 text-sm font-medium">{aoi.title}</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              <RichText text={aoi.detail} />
            </p>
          </li>
        );
      })}
    </ul>
  );
}
