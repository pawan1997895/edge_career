// Consistent badges and icons for the statuses used across the app.

import {
  BookOpen,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  ClipboardCheck,
  CodeXml,
  Hourglass,
  LoaderCircle,
  Lock,
  LockOpen,
  PencilRuler,
  type LucideIcon,
} from "lucide-react";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { ItemKind, ItemStatus, ModuleStatus } from "@/types/curriculum";
import type { Difficulty, Verdict } from "@/types/practice";
import { VERDICT_LABELS } from "@/types/practice";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const ITEM_STATUS: Record<ItemStatus, { label: string; variant: BadgeVariant; icon: LucideIcon }> = {
  locked: { label: "Locked", variant: "muted", icon: Lock },
  unlocked: { label: "Not started", variant: "outline", icon: CircleDashed },
  in_progress: { label: "In progress", variant: "info", icon: CircleDot },
  submitted: { label: "Submitted", variant: "warning", icon: Hourglass },
  passed: { label: "Passed", variant: "success", icon: CircleCheck },
  failed: { label: "Failed", variant: "destructive", icon: CircleX },
};

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const { label, variant, icon: Icon } = ITEM_STATUS[status];
  return (
    <Badge variant={variant}>
      <Icon /> {label}
    </Badge>
  );
}

/** Icon-only status marker for dense lists. */
export function ItemStatusIcon({ status, className }: { status: ItemStatus; className?: string }) {
  const { icon: Icon } = ITEM_STATUS[status];
  const color = {
    locked: "text-muted-foreground",
    unlocked: "text-muted-foreground",
    in_progress: "text-info",
    submitted: "text-warning",
    passed: "text-success",
    failed: "text-destructive",
  }[status];
  return <Icon className={`${color} ${className ?? "size-4"}`} aria-label={ITEM_STATUS[status].label} />;
}

const MODULE_STATUS: Record<ModuleStatus, { label: string; variant: BadgeVariant; icon: LucideIcon }> = {
  locked: { label: "Locked", variant: "muted", icon: Lock },
  unlocked: { label: "Unlocked", variant: "outline", icon: LockOpen },
  in_progress: { label: "In progress", variant: "info", icon: CircleDot },
  passed: { label: "Passed", variant: "success", icon: CircleCheck },
  tested_out: { label: "Tested out", variant: "success", icon: CircleCheck },
};

export function ModuleStatusBadge({ status }: { status: ModuleStatus }) {
  const { label, variant, icon: Icon } = MODULE_STATUS[status];
  return (
    <Badge variant={variant}>
      <Icon /> {label}
    </Badge>
  );
}

const DIFFICULTY: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: "Easy", className: "text-success" },
  medium: { label: "Medium", className: "text-warning-foreground dark:text-warning" },
  hard: { label: "Hard", className: "text-destructive" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, className } = DIFFICULTY[difficulty];
  return <span className={`text-xs font-medium ${className}`}>{label}</span>;
}

const VERDICT_VARIANT: Record<Verdict, BadgeVariant> = {
  accepted: "success",
  wrong_answer: "destructive",
  time_limit_exceeded: "warning",
  memory_limit_exceeded: "warning",
  runtime_error: "destructive",
  compile_error: "destructive",
  pending: "info",
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <Badge variant={VERDICT_VARIANT[verdict]}>
      {verdict === "accepted" && <CircleCheck />}
      {verdict === "pending" && <LoaderCircle className="animate-spin" />}
      {verdict !== "accepted" && verdict !== "pending" && <CircleX />}
      {VERDICT_LABELS[verdict]}
    </Badge>
  );
}

/** Marks screens whose real functionality ships in a later roadmap phase. */
export function PhaseBadge({ phase }: { phase: 0 | 1 | 2 | 3 }) {
  const label = phase === 0 ? "Foundation" : `Phase ${phase}`;
  const variant: BadgeVariant = phase <= 1 ? "secondary" : phase === 2 ? "info" : "default";
  return <Badge variant={variant}>{label}</Badge>;
}

const ITEM_KIND: Record<ItemKind, { label: string; icon: LucideIcon }> = {
  lesson: { label: "Lesson", icon: BookOpen },
  practice: { label: "Practice", icon: CodeXml },
  assignment: { label: "Assignment", icon: PencilRuler },
  checkpoint: { label: "Checkpoint exam", icon: ClipboardCheck },
};

export function itemKindMeta(kind: ItemKind) {
  return ITEM_KIND[kind];
}
