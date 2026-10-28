import type { Metadata } from "next";
import { Copy, Flag, Layers, ShieldAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ExamIntegrityTable } from "@/features/admin/ops/components/integrity/exam-integrity-table";
import { PoolCoverage } from "@/features/admin/ops/components/integrity/pool-coverage";
import { SimilarityMatches } from "@/features/admin/ops/components/integrity/similarity-matches";
import { getExamIntegrity, getQuestionPools, getSimilarityMatches } from "@/data/admin-ops";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Integrity" };

export default async function IntegrityPage() {
  const [matches, attempts, { pools, repeatTarget }] = await Promise.all([getSimilarityMatches(), getExamIntegrity(), getQuestionPools()]);
  const openMatches = matches.filter((m) => m.status === "open").length;
  const escalated = matches.filter((m) => m.status === "escalated").length;
  const highRisk = attempts.filter((a) => a.risk === "high").length;
  const avgRepeat = Math.round(pools.reduce((sum, p) => sum + p.repeatRate, 0) / pools.length);

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Grading" }, { label: "Integrity" }]}
        title="Exam and code integrity"
        description="Code similarity checks, exam activity logs and randomized question pools. Nothing here changes a score on its own; escalations go to the human review queue."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open similarity matches" value={openMatches} icon={Copy} hint="Above 75% similarity" />
        <StatCard label="High-risk exam attempts" value={highRisk} icon={ShieldAlert} hint="Last 14 days" />
        <StatCard label="Escalated to review" value={escalated} icon={Flag} hint="Awaiting a reviewer" />
        <StatCard label="Average pool repeat rate" value={`${avgRepeat}%`} icon={Layers} hint={`Target below ${repeatTarget}%`} />
      </div>
      <div className="mt-6 space-y-6">
        <SimilarityMatches matches={matches} />
        <ExamIntegrityTable attempts={attempts} />
        <PoolCoverage pools={pools} repeatTarget={repeatTarget} />
      </div>
    </PageContainer>
  );
}
