import type { Metadata } from "next";
import Link from "next/link";
import { GitBranch, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getModules, getTracks } from "@/data/curriculum";
import { getModulePublishStatus, getProblemFiles, getRubrics } from "@/data/admin-content";
import { CurriculumTree } from "@/features/admin/content/components/curriculum-tree";
import { ProblemsTable } from "@/features/admin/content/components/problems-table";
import { RubricsList } from "@/features/admin/content/components/rubrics-list";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Curriculum & problems" };

const TABS = ["curriculum", "problems", "rubrics"] as const;

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const [tracks, modules, publishStatus, problems, rubrics] = await Promise.all([
    getTracks(),
    getModules(),
    getModulePublishStatus(),
    getProblemFiles(),
    getRubrics(),
  ]);
  const failing = problems.filter((p) => p.file.ciStatus === "failing").length;

  return (
    <PageContainer wide>
      <PageHeader
        title="Curriculum & problems"
        description="Modules, lessons, problems, tests and rubrics are stored as files in the content repository and reviewed like code."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.admin.lessons}>
              <Video /> Lesson production
            </Link>
          </Button>
        }
      />

      <Alert variant="info" className="mb-6">
        <GitBranch />
        <AlertTitle>Edits open a pull request against content/</AlertTitle>
        <AlertDescription>
          Every change runs automatic checks (schema, reference solution within 2 s / 256 MB, boilerplate builds, rubric weights) before it can
          merge. {failing > 0 ? `${failing} problem files are failing checks right now.` : "All problem files pass their checks."}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue={TABS.includes(tab as (typeof TABS)[number]) ? tab : "curriculum"}>
        <TabsList variant="line">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="problems">
            Problems <span className="text-xs text-muted-foreground tabular-nums">{problems.length}</span>
          </TabsTrigger>
          <TabsTrigger value="rubrics">
            Rubrics <span className="text-xs text-muted-foreground tabular-nums">{rubrics.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="curriculum">
          <CurriculumTree tracks={tracks} modules={modules} publishStatus={publishStatus} />
        </TabsContent>
        <TabsContent value="problems">
          <ProblemsTable problems={problems} modules={modules.map(({ id, title, number }) => ({ id, title, number }))} />
        </TabsContent>
        <TabsContent value="rubrics">
          <RubricsList rubrics={rubrics} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
