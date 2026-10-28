import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModule } from "@/data/curriculum";
import { getGitHubConnection, getProject } from "@/data/projects";
import { GitHubConnectionCard } from "@/features/projects/components/github-connection-card";
import { LiveChecksCard } from "@/features/projects/components/live-checks-card";
import { ModulePreviewBanner } from "@/features/projects/components/module-preview-banner";
import { ProjectStatusBadge } from "@/features/projects/components/project-status-badge";
import { RepoTestRunner } from "@/features/projects/components/repo-test-runner";
import { RequirementsCard } from "@/features/projects/components/requirements-card";
import { RunHistoryCard } from "@/features/projects/components/run-history-card";
import { routes } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
  const project = await getProject((await params).projectId);
  return { title: project?.title ?? "Project not found" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [project, connection, productionModule] = await Promise.all([getProject(projectId), getGitHubConnection(), getModule("production-engineering")]);
  if (!project || !productionModule) notFound();
  const prerequisite = await getModule(productionModule.prerequisiteIds[0] ?? "");
  // The GitHub setup project has no repository to test; it's complete once the app is connected.
  const isSetupProject = project.repositories.length === 0;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Projects", href: routes.projects }, { label: project.title }]}
        title={project.title}
        description={project.summary}
        meta={
          <>
            <ProjectStatusBadge status={project.status} />
            <Badge variant="secondary">Module 5</Badge>
            {project.skills.map((s) => (
              <Badge key={s} variant="muted">
                {s}
              </Badge>
            ))}
          </>
        }
      />
      <ModulePreviewBanner module={productionModule} prerequisite={prerequisite} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Brief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              {project.brief.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </CardContent>
          </Card>
          {isSetupProject ? (
            <GitHubConnectionCard connection={connection} />
          ) : (
            <>
              <RepoTestRunner project={project} />
              <LiveChecksCard liveUrl={project.liveUrl} checks={project.liveChecks} />
            </>
          )}
        </div>
        <aside className="space-y-6">
          <RequirementsCard requirements={project.requirements} />
          {!isSetupProject && <RunHistoryCard runs={project.runs} />}
        </aside>
      </div>
    </PageContainer>
  );
}
