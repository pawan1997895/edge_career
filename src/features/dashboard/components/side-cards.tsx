import Link from "next/link";
import { ArrowRight, Hourglass, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReadinessBar } from "@/features/insights/components/readiness-bar";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { LatestInterview, PendingItem } from "@/types/dashboard";
import type { CompanyReadiness, SkillMastery } from "@/types/insights";

export function PendingReviewsCard({ items }: { items: PendingItem[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="border-warning/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hourglass className="size-4 text-warning" /> Waiting on review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="block rounded-md border p-3 hover:bg-accent/50">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{item.title}</span>
              <Badge variant="warning">{item.status}</Badge>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{item.detail}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function LatestInterviewCard({ interview, minutesLeft, minutesTotal }: { interview: LatestInterview; minutesLeft: number; minutesTotal: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="size-4 text-muted-foreground" /> Latest mock interview
        </CardTitle>
        <CardDescription>
          {interview.title} · {interview.mode} · {formatRelative(interview.at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums">{interview.score}</span>
          <span className="text-sm text-muted-foreground">/ {interview.outOf} overall</span>
        </div>
        <p className="text-[13px] text-muted-foreground">{interview.highlight}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Interview minutes left</span>
            <span className="tabular-nums">
              {minutesLeft} / {minutesTotal}
            </span>
          </div>
          <Progress value={(minutesLeft / minutesTotal) * 100} aria-label="Interview minutes left" />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium">
          <Link href={routes.interviewScorecard(interview.sessionId)} className="text-primary hover:underline">
            Open scorecard
          </Link>
          <Link href={routes.interviewSetup()} className="text-primary hover:underline">
            Start a new interview
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReadinessSummaryCard({ companies }: { companies: CompanyReadiness[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Readiness</CardTitle>
        <CardDescription>Your target companies</CardDescription>
        <CardAction>
          <Badge variant="warning">Estimate</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {companies.map((c) => (
          <div key={c.company}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span>{c.company}</span>
              <span className="tabular-nums text-muted-foreground">
                {c.score} / {c.target}
              </span>
            </div>
            <ReadinessBar score={c.score} target={c.target} label={`${c.company} readiness`} />
          </div>
        ))}
        <Link href={routes.readiness} className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
          See gaps to close <ArrowRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function MasterySnapshotCard({ strongest, weakest }: { strongest: SkillMastery[]; weakest: SkillMastery[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill mastery</CardTitle>
        <CardAction>
          <Link href={routes.progress} className="text-[13px] font-medium text-primary hover:underline">
            Heatmap
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <SkillList title="Strongest" skills={strongest} tone="success" />
        <SkillList title="Needs work" skills={weakest} tone="warning" />
      </CardContent>
    </Card>
  );
}

function SkillList({ title, skills, tone }: { title: string; skills: SkillMastery[]; tone: "success" | "warning" }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <ul className="space-y-2.5">
        {skills.map((s) => (
          <li key={s.skill}>
            <div className="mb-1 flex justify-between gap-2 text-[13px]">
              <span className="truncate">{s.skill}</span>
              <span className="tabular-nums text-muted-foreground">{s.mastery}</span>
            </div>
            <Progress value={s.mastery} tone={tone} aria-label={`${s.skill} mastery`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
