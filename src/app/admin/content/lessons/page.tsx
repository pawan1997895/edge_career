import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getPipelineLessons } from "@/data/admin-content";
import { LessonPipeline } from "@/features/admin/content/components/lesson-pipeline";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Lesson production" };

export default async function LessonProductionPage() {
  const lessons = await getPipelineLessons();
  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "Lesson production" }]}
        title="Lesson production"
        description="An expert outlines each lesson, Claude drafts the script, the expert reviews it, and the approved script is rendered as an avatar video and published with a synced transcript."
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.admin.content}>
              <Layers /> Curriculum
            </Link>
          </Button>
        }
      />
      <LessonPipeline lessons={lessons} />
    </PageContainer>
  );
}
