import type { Metadata } from "next";
import { Bot, Database, ShieldCheck, Wallet } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Progress } from "@/components/ui/progress";
import { AiCostChart } from "@/features/admin/ops/components/ai-usage/ai-cost-chart";
import { AiLatencyChart } from "@/features/admin/ops/components/ai-usage/ai-latency-chart";
import { AiUsageTable } from "@/features/admin/ops/components/ai-usage/ai-usage-table";
import { BudgetAlerts } from "@/features/admin/ops/components/ai-usage/budget-alerts";
import { InjectionAttempts } from "@/features/admin/ops/components/ai-usage/injection-attempts";
import { PromptVersions } from "@/features/admin/ops/components/ai-usage/prompt-versions";
import { getAiUsage } from "@/data/admin-ops";
import { formatNumber, formatUSD } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "AI usage & cost" };

export default async function AiUsagePage() {
  const report = await getAiUsage();
  const calls = report.features.reduce((sum, f) => sum + f.calls, 0);
  const inputTokens = report.features.reduce((sum, f) => sum + f.inputTokens, 0);
  const cacheHit = Math.round(report.features.reduce((sum, f) => sum + f.cacheHitRate * f.inputTokens, 0) / inputTokens);
  const budgetUsed = (report.monthToDateUsd / report.monthlyBudgetUsd) * 100;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Operations" }, { label: "AI usage & cost" }]}
        title="AI usage and cost"
        description="Every Claude call goes through the AI layer, which logs cost, response time and cache hits per feature."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Spend this month"
          value={formatUSD(report.monthToDateUsd, 0)}
          icon={Wallet}
          hint={
            <span className="flex w-full items-center gap-2">
              <Progress value={budgetUsed} tone={budgetUsed > 90 ? "destructive" : "primary"} className="w-20" aria-label="Budget used" />
              {Math.round(budgetUsed)}% of {formatUSD(report.monthlyBudgetUsd, 0)}
            </span>
          }
        />
        <StatCard label="Claude calls" value={formatNumber(calls)} icon={Bot} hint={report.periodLabel} />
        <StatCard label="Cache hit rate" value={`${cacheHit}%`} icon={Database} hint="Weighted by input tokens" trend={{ value: "−4 pts", positive: false }} />
        <StatCard label="Manipulation attempts blocked" value={report.injectionsThisMonth} icon={ShieldCheck} hint="No score changed" />
      </div>

      <div className="mt-6">
        <BudgetAlerts alerts={report.alerts} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AiCostChart daily={report.daily} features={report.features} />
        <AiLatencyChart features={report.features} />
      </div>

      <div className="mt-6 space-y-6">
        <AiUsageTable features={report.features} periodLabel={report.periodLabel} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
          <PromptVersions prompts={report.prompts} />
          <InjectionAttempts attempts={report.injections} monthCount={report.injectionsThisMonth} />
        </div>
      </div>
    </PageContainer>
  );
}
