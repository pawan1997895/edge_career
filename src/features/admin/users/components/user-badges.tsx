import { Badge } from "@/components/ui/badge";
import type { AccountStatus, UserFlag } from "@/types/admin-ops";
import type { Role } from "@/types/user";

const FLAG: Record<UserFlag, { label: string; variant: "destructive" | "warning" | "info" | "muted" }> = {
  similarity: { label: "Similarity", variant: "destructive" },
  integrity: { label: "Integrity", variant: "destructive" },
  appeal: { label: "Appeal open", variant: "info" },
  payment_failed: { label: "Payment failed", variant: "warning" },
  minutes_cap: { label: "At minutes cap", variant: "muted" },
};

export function UserFlags({ flags }: { flags: UserFlag[] }) {
  if (flags.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <Badge key={f} variant={FLAG[f].variant}>
          {FLAG[f].label}
        </Badge>
      ))}
    </div>
  );
}

const STATUS = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
  invited: { label: "Invited", variant: "muted" },
} as const;

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return <Badge variant={STATUS[status].variant}>{STATUS[status].label}</Badge>;
}

export const ROLE_LABELS: Record<Role, string> = { learner: "Learner", reviewer: "Reviewer", admin: "Admin" };

export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant={role === "learner" ? "outline" : "secondary"}>{ROLE_LABELS[role]}</Badge>;
}
