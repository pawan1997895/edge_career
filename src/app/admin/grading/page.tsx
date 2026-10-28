import type { Metadata } from "next";
import Link from "next/link";
import { Database, Gavel, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { getGraderAccuracy } from "@/data/admin-content";
import { AccuracyTable } from "@/features/admin/grading/components/accuracy-table";
import { AgreementTrendChart } from "@/features/admin/grading/components/agreement-trend-chart";
import { CalibrationScatter } from "@/features/admin/grading/components/calibration-scatter";
import { OverrideLog } from "@/features/admin/grading/components/override-log";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Grader accuracy" };

export default async function GraderAccuracyPage() {
  const data = await getGraderAccuracy();
  const measured = data.modules.filter((m) => m.gating !== "collecting");
  const totalSet = data.modules.reduce((sum, m) => sum + m.calibrationSize, 0);
  const weighted = measured.reduce((sum, m) => sum + m.withinFivePct * m.calibrationSize, 0) / measured.reduce((sum, m) => sum + m.calibrationSize, 0);
  const gated = data.modules.filter((m) => m.gating === "ai_enabled").length;
  const changed = data.overrides.filter((o) => o.finalScore !== o.aiScore).length;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Grader accuracy" }]}
        title="Grader accuracy"
        description="How closely Claude's grades match expert human grades. AI scores may only lock or unlock modules where agreement meets the target."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.admin.reviews}>
              <Gavel /> Review queue
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall agreement (±5)" value={`${weighted.toFixed(1)}%`} icon={Scale} hint={`Target ${data.target}%`} />
        <StatCard label="Human-graded calibration set" value={totalSet} icon={Database} hint="Submissions graded by experts" />
        <StatCard label="Modules where AI can gate" value={`${gated} of ${data.modules.length}`} icon={ShieldCheck} hint="Others need human confirmation" />
        <StatCard label="Scores changed by reviewers" value={`${changed} of ${data.overrides.length}`} icon={Gavel} hint="Last 7 days" />
      </div>

      <AccuracyTable modules={data.modules} target={data.target} minSet={data.minCalibrationSet} />

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI vs human scores</CardTitle>
            <CardDescription>One point per calibration submission. Points between the dashed lines agree within ±5.</CardDescription>
          </CardHeader>
          <CardContent>
            <CalibrationScatter points={data.points} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agreement over time</CardTitle>
            <CardDescription>Weekly share of AI scores within ±5 of the human grade</CardDescription>
          </CardHeader>
          <CardContent>
            <AgreementTrendChart data={data.trend} target={data.target} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <OverrideLog entries={data.overrides} />
      </div>
    </PageContainer>
  );
}
