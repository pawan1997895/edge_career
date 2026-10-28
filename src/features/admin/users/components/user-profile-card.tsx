import { Mail, MapPin } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GitHubIcon } from "@/components/shared/brand-icons";
import { formatDate } from "@/lib/format";
import type { AdminUserDetail } from "@/types/admin-ops";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS } from "@/types/user";

export function UserProfileCard({ user }: { user: AdminUserDetail }) {
  const staff = user.role !== "learner";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile and onboarding</CardTitle>
        <CardDescription>Answers from onboarding drive placement and readiness targets.</CardDescription>
      </CardHeader>
      <div className="space-y-2 px-5 pt-4 text-sm">
        <p className="flex items-center gap-2">
          <Mail className="size-4 text-muted-foreground" /> {user.email}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" /> {user.city}
        </p>
        <p className="flex items-center gap-2">
          <GitHubIcon className="size-4 text-muted-foreground" />
          {user.githubUsername ? user.githubUsername : <span className="text-muted-foreground">GitHub not connected</span>}
        </p>
      </div>
      <dl className="divide-y px-5 pt-2 pb-3 text-sm">
        <Row label="Joined" value={formatDate(user.joinedAt)} />
        {!staff && (
          <>
            <Row label="Persona" value={PERSONA_LABELS[user.persona]} />
            <Row label="Current level" value={LEVEL_LABELS[user.level]} />
            <Row label="Target companies" value={user.targetCompanies.join(", ") || "—"} />
            <Row label="Target salary" value={SALARY_LABELS[user.targetSalary]} />
          </>
        )}
      </dl>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export function UserMinutesCard({ user }: { user: AdminUserDetail }) {
  if (user.minutesCap === 0) return null;
  const pct = (user.minutesUsed / user.minutesCap) * 100;
  return (
    <Card className="p-5">
      <p className="text-sm font-medium">Interview minutes this cycle</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">
        {user.minutesUsed} <span className="text-base font-normal text-muted-foreground">/ {user.minutesCap} min</span>
      </p>
      <Progress value={pct} tone={pct >= 100 ? "destructive" : pct > 80 ? "warning" : "primary"} className="mt-3" aria-label="Minutes used" />
      <p className="mt-2 text-xs text-muted-foreground">
        {pct >= 100 ? "Cap reached. The learner sees an upgrade prompt." : `${user.minutesCap - user.minutesUsed} minutes left until renewal.`}
      </p>
    </Card>
  );
}
