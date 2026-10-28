import type { Metadata } from "next";
import { Activity, ChartColumn, Info, TrendingUp, TriangleAlert } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { CategoryMasteryChart } from "@/features/insights/components/category-mastery-chart";
import { ProgressExplorer } from "@/features/insights/components/progress-explorer";
import { WeakestSkillsCard } from "@/features/insights/components/weakest-skills-card";
import { average } from "@/features/insights/lib";
import { getSkillMastery } from "@/data/insights";
import { SKILL_CATEGORIES } from "@/types/insights";

export const metadata: Metadata = { title: "Skill progress" };

export default async function ProgressPage() {
  const { skills, weeks } = await getSkillMastery();
  const avg = average(skills.map((s) => s.mastery));
  const avgChange = average(skills.map((s) => s.delta));
  const strong = skills.filter((s) => s.mastery >= 80).length;
  const improving = skills.filter((s) => s.delta > 0).length;
  const weak = skills.filter((s) => s.mastery < 60).length;
  const byCategory = SKILL_CATEGORIES.map((category) => ({
    category,
    mastery: average(skills.filter((s) => s.category === category).map((s) => s.mastery)),
  }));
  const weakest = [...skills].sort((a, b) => a.mastery - b.mastery).slice(0, 3);

  return (
    <PageContainer wide>
      <PageHeader
        title="Skill progress"
        description="Every graded result is tagged with the skills it tests. These scores show how well you know each one today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average mastery" value={avg} hint={`across ${skills.length} skills`} icon={ChartColumn} trend={{ value: `${avgChange >= 0 ? "+" : ""}${avgChange} in 4 weeks`, positive: avgChange >= 0 }} />
        <StatCard label="Interview-ready skills" value={strong} hint="mastery 80 or above" icon={Activity} />
        <StatCard label="Improving" value={improving} hint="gained in the last 4 weeks" icon={TrendingUp} />
        <StatCard label="Needs attention" value={weak} hint="mastery below 60" icon={TriangleAlert} />
      </div>

      <Alert variant="info" className="mt-6">
        <Info />
        <AlertTitle>How mastery is calculated</AlertTitle>
        <AlertDescription>
          Hidden tests, checkpoint questions, design reviews and interview scorecards all count. Recent results weigh more: a result from
          three weeks ago counts half as much as one from today, so skills you stop practising slowly drift down.
        </AlertDescription>
      </Alert>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <ProgressExplorer skills={skills} weeks={weeks} />
        </div>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>By category</CardTitle>
              <CardDescription>Average mastery. The dashed line marks 80.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <CategoryMasteryChart data={byCategory} />
            </CardContent>
          </Card>
          <WeakestSkillsCard skills={weakest} />
        </aside>
      </div>
    </PageContainer>
  );
}
