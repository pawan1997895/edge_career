import { CircleCheck, CircleDashed, CircleDot, CircleX, Hourglass, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DesignStatus } from "@/types/system-design";

const STATUS: Record<DesignStatus, { label: string; variant: "outline" | "info" | "warning" | "success" | "destructive"; icon: LucideIcon }> = {
  not_started: { label: "Not started", variant: "outline", icon: CircleDashed },
  in_progress: { label: "In progress", variant: "info", icon: CircleDot },
  in_review: { label: "In human review", variant: "warning", icon: Hourglass },
  passed: { label: "Passed", variant: "success", icon: CircleCheck },
  failed: { label: "Needs work", variant: "destructive", icon: CircleX },
};

export function DesignStatusBadge({ status }: { status: DesignStatus }) {
  const { label, variant, icon: Icon } = STATUS[status];
  return (
    <Badge variant={variant}>
      <Icon /> {label}
    </Badge>
  );
}
