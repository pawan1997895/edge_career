import { Bot, Inbox, Scale, Send, Users } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { formatNumber, formatUSD } from "@/lib/format";
import type { OverviewStats } from "@/types/admin-content";

export function OverviewKpis({ stats }: { stats: OverviewStats }) {
  const budgetUsed = Math.round((stats.aiCostMonthUsd / stats.aiBudgetMonthUsd) * 100);
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Active learners (7 days)"
        value={formatNumber(stats.activeLearners)}
        icon={Users}
        trend={{ value: `+${stats.activeLearnersChange}%`, positive: true }}
        hint="vs previous week"
      />
      <StatCard
        label="Submissions today"
        value={formatNumber(stats.submissionsToday)}
        icon={Send}
        trend={{ value: `+${stats.submissionsChange}%`, positive: true }}
        hint="vs same day last week"
      />
      <StatCard
        label="Human review backlog"
        value={stats.reviewBacklog}
        icon={Inbox}
        hint={<span className={stats.oldestWaitingHours > 24 ? "text-destructive" : undefined}>Oldest waiting {stats.oldestWaitingHours}h (SLA 24h)</span>}
      />
      <StatCard
        label="AI cost today"
        value={formatUSD(stats.aiCostTodayUsd)}
        icon={Bot}
        hint={`${formatUSD(stats.aiCostMonthUsd, 0)} this month · ${budgetUsed}% of budget`}
      />
      <StatCard
        label="Grader agreement"
        value={`${stats.graderAgreementPct}%`}
        icon={Scale}
        hint="AI within ±5 of human · target 90%"
      />
    </div>
  );
}
