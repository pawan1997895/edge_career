import { CircleCheck, CircleDashed, CircleDot, CircleX, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NotebookStatus, ProjectStatus } from "@/types/projects";

const STATUS: Record<ProjectStatus | NotebookStatus, { label: string; variant: "outline" | "info" | "warning" | "success" | "destructive"; icon: LucideIcon }> = {
  not_started: { label: "Not started", variant: "outline", icon: CircleDashed },
  in_progress: { label: "In progress", variant: "info", icon: CircleDot },
  submitted: { label: "Submitted", variant: "warning", icon: CircleDot },
  passed: { label: "Passed", variant: "success", icon: CircleCheck },
  failed: { label: "Failed", variant: "destructive", icon: CircleX },
};

/** Status for both projects and notebooks. */
export function ProjectStatusBadge({ status }: { status: ProjectStatus | NotebookStatus }) {
  const { label, variant, icon: Icon } = STATUS[status];
  return (
    <Badge variant={variant}>
      <Icon /> {label}
    </Badge>
  );
}
