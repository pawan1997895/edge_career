import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, CircleDot, Flame, ListChecks } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { ProblemBank, type ModuleRef } from "@/features/practice/components/problem-bank";
import { RecommendedProblems } from "@/features/practice/components/recommended-problems";
import { getModules } from "@/data/curriculum";
import { getProblems, getRecommendations } from "@/data/problems";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticePage() {
  const [problems, modules, recommendations] = await Promise.all([getProblems(), getModules(), getRecommendations()]);
  const moduleRefs: ModuleRef[] = modules.map((m) => ({ id: m.id, title: m.title, number: m.number, status: m.status }));

  const solved = problems.filter((p) => p.progress === "solved").length;
  const attempted = problems.filter((p) => p.progress === "attempted").length;
  const hardSolved = problems.filter((p) => p.progress === "solved" && p.difficulty === "hard").length;

  return (
    <PageContainer wide>
      <PageHeader
        title="Practice"
        description="LeetCode-style coding and SQL problems, judged in a sealed sandbox (2 s, 256 MB) with AI feedback on every submission."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.submissions}>
              <ListChecks /> My submissions
            </Link>
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Solved" value={solved} icon={CircleCheck} hint={`of ${problems.length} problems`} />
        <StatCard label="Attempted" value={attempted} icon={CircleDot} hint="Not accepted yet" />
        <StatCard label="Hard solved" value={hardSolved} icon={Flame} hint="Most signal in interviews" />
        <StatCard label="Acceptance" value="78%" hint="Your accepted ÷ submitted" trend={{ value: "+6%", positive: true }} />
      </div>
      <RecommendedProblems recommendations={recommendations} />
      <ProblemBank problems={problems} modules={moduleRefs} />
    </PageContainer>
  );
}
