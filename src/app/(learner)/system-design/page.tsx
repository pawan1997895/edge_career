import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, CircleDot, Gauge, Hourglass } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getModule } from "@/data/curriculum";
import { getDesignProblems } from "@/data/system-design";
import { DesignProblemList } from "@/features/system-design/components/design-problem-list";
import { GradingExplainer } from "@/features/system-design/components/grading-explainer";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "System design" };

export default async function SystemDesignPage() {
  const [problems, designModule] = await Promise.all([getDesignProblems(), getModule("system-design")]);
  const scored = problems.filter((p) => p.lastScore !== undefined);
  const averageScore = scored.length ? Math.round(scored.reduce((sum, p) => sum + (p.lastScore ?? 0), 0) / scored.length) : 0;

  return (
    <PageContainer>
      <PageHeader
        title="System design workbench"
        description="Practise high-level architecture on the design canvas and low-level object design in a multi-file workspace."
        meta={
          designModule && (
            <>
              <Badge variant="secondary">Module 4 · {designModule.title}</Badge>
              <Badge variant="info">{designModule.progress}% of module complete</Badge>
            </>
          )
        }
        actions={
          designModule && (
            <Button variant="outline" asChild>
              <Link href={routes.module(designModule.id)}>Open Module 4</Link>
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Passed" value={problems.filter((p) => p.status === "passed").length} icon={CircleCheck} hint={`of ${problems.length} problems`} />
        <StatCard label="In human review" value={problems.filter((p) => p.status === "in_review").length} icon={Hourglass} hint="Result within 24 h" />
        <StatCard label="In progress" value={problems.filter((p) => p.status === "in_progress").length} icon={CircleDot} />
        <StatCard label="Average score" value={`${averageScore}%`} icon={Gauge} hint="Pass bar 85%" />
      </div>

      <section className="mt-8">
        <SectionHeader title="Problems" description="Module 4 assignments count toward unlocking the checkpoint. Extra practice is optional." />
        <DesignProblemList problems={problems} />
      </section>

      <section className="mt-8">
        <SectionHeader title="How grading works" />
        <GradingExplainer />
      </section>
    </PageContainer>
  );
}
