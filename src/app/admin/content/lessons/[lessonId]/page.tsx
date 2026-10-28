import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-header";
import { getLessonScript } from "@/data/admin-content";
import { ScriptReview } from "@/features/admin/content/components/script-review";

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const script = await getLessonScript(lessonId);
  return { title: script ? `Script: ${script.title}` : "Lesson not found" };
}

export default async function LessonScriptPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const script = await getLessonScript(lessonId);
  if (!script) notFound();

  return (
    <PageContainer wide>
      <ScriptReview script={script} />
    </PageContainer>
  );
}
