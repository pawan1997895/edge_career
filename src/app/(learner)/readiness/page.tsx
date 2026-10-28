import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyReadinessExplorer } from "@/features/insights/components/company-readiness-explorer";
import { OutcomesSection } from "@/features/insights/components/outcomes-section";
import { SalaryReadinessCard } from "@/features/insights/components/salary-readiness-card";
import { getCompanyReadiness, getReportedOutcomes, getSalaryReadiness } from "@/data/insights";
import { getCurrentUser } from "@/data/user";
import { SALARY_LABELS } from "@/types/user";

export const metadata: Metadata = { title: "Readiness" };

const INPUTS = [
  { title: "Skill mastery", text: "Weighted by what each company's interviews focus on." },
  { title: "Checkpoint scores", text: "Module checkpoints taken under exam conditions." },
  { title: "Mock interviews", text: "The four scorecard metrics from your recent sessions." },
];

export default async function ReadinessPage() {
  const [user, companies, bands, outcomes] = await Promise.all([
    getCurrentUser(),
    getCompanyReadiness(),
    getSalaryReadiness(),
    getReportedOutcomes(),
  ]);

  return (
    <PageContainer wide>
      <PageHeader
        title="Interview readiness"
        description={`How close you are to the bar at your target companies (${user.targetCompanies.join(", ")}) and the ${SALARY_LABELS[user.targetSalary]} band.`}
        meta={<Badge variant="warning">Estimate</Badge>}
      />

      <Alert variant="info" className="mb-6">
        <Info />
        <AlertTitle>These scores are estimates</AlertTitle>
        <AlertDescription>
          Today, each company&apos;s bar is set by our panel of engineers who interview at these companies. As learners report real interview
          results, we will calibrate the bars against actual outcomes. Use this to decide what to practise, not as a prediction of an offer.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <CompanyReadinessExplorer companies={companies} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <SalaryReadinessCard bands={bands} />
          <Card>
            <CardHeader>
              <CardTitle>What goes into the estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {INPUTS.map((input) => (
                  <li key={input.title} className="text-sm">
                    <p className="font-medium">{input.title}</p>
                    <p className="text-[13px] text-muted-foreground">{input.text}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <OutcomesSection initialOutcomes={outcomes} />
      </div>
    </PageContainer>
  );
}
