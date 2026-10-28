import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { PhaseBadge } from "@/components/shared/status-badges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModule } from "@/data/curriculum";
import { getGitHubConnection, getProjects } from "@/data/projects";
import { GitHubConnectionCard } from "@/features/projects/components/github-connection-card";
import { ModulePreviewBanner } from "@/features/projects/components/module-preview-banner";
import { ProjectList } from "@/features/projects/components/project-list";

export const metadata: Metadata = { title: "Projects" };

const GRADING = [
  { title: "Hidden test suite", detail: "Runs against your repository on every push or when you click Run tests." },
  { title: "Live URL checks", detail: "Your deployment is probed every 10 minutes from three regions." },
  { title: "Reviewer checks", detail: "A reviewer confirms items tests can't, such as README quality." },
];

export default async function ProjectsPage() {
  const [projects, connection, productionModule] = await Promise.all([getProjects(), getGitHubConnection(), getModule("production-engineering")]);
  if (!productionModule) notFound();
  const prerequisite = await getModule(productionModule.prerequisiteIds[0] ?? "");

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Build real services in your own GitHub repositories. We run the tests and check your deployed URL."
        meta={
          <>
            <Badge variant="secondary">Module 5 · {productionModule.title}</Badge>
            <PhaseBadge phase={productionModule.releasePhase} />
          </>
        }
      />
      <ModulePreviewBanner module={productionModule} prerequisite={prerequisite} />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionHeader title="Module 5 projects" />
          <ProjectList projects={projects} />
        </section>
        <aside className="space-y-4">
          <GitHubConnectionCard connection={connection} />
          <Card>
            <CardHeader>
              <CardTitle>How projects are graded</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {GRADING.map((g) => (
                  <li key={g.title} className="text-sm">
                    <p className="font-medium">{g.title}</p>
                    <p className="text-muted-foreground">{g.detail}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
