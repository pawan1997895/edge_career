import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CompanyBarsEditor } from "@/features/admin/ops/components/readiness/company-bars-editor";
import { OutcomesTable } from "@/features/admin/ops/components/readiness/outcomes-table";
import { SalaryBars } from "@/features/admin/ops/components/readiness/salary-bars";
import { getReadinessCalibration } from "@/data/admin-ops";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Readiness calibration" };

export default async function ReadinessCalibrationPage() {
  const { bars, salaryBars, outcomes } = await getReadinessCalibration();
  const calibrated = outcomes.filter((o) => o.outcomes >= o.required).length;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Operations" }, { label: "Readiness calibration" }]}
        title="Readiness calibration"
        description="Bars behind the company and salary readiness scores learners see on their dashboard."
      />

      <Alert variant="info" className="mb-6">
        <Info />
        <AlertTitle>Learners see these scores as estimates</AlertTitle>
        <AlertDescription>
          Readiness is labelled &ldquo;Estimate&rdquo; everywhere in the learner app. {calibrated} of {outcomes.length} companies have enough
          reported outcomes to calibrate; the rest use expert-set bars.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <CompanyBarsEditor bars={bars} />
        <SalaryBars bars={salaryBars} />
      </div>

      <div className="mt-6">
        <OutcomesTable outcomes={outcomes} />
      </div>
    </PageContainer>
  );
}
