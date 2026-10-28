import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, UserCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockedState } from "@/components/shared/locked-state";
import { RichText } from "@/components/shared/rich-text";
import { ItemStatusBadge } from "@/components/shared/status-badges";
import { LessonNavFooter } from "@/features/lessons/components/lesson-nav-footer";
import { LessonPlayer } from "@/features/lessons/components/lesson-player";
import { LessonResources } from "@/features/lessons/components/lesson-resources";
import { MarkCompleteButton } from "@/features/lessons/components/mark-complete-button";
import { moduleLabel } from "@/features/curriculum/lib";
import { getLessonContext } from "@/data/lessons";
import { formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";

type Params = Promise<{ lessonId: string }>;
type SearchParams = Promise<{ t?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lessonId } = await params;
  const ctx = await getLessonContext(lessonId);
  return { title: ctx?.lesson.title ?? "Lesson" };
}

export default async function LessonPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ lessonId }, { t }] = await Promise.all([params, searchParams]);
  const ctx = await getLessonContext(lessonId);
  if (!ctx) notFound();

  const { lesson, module: mod, topicTitle, prev, next, locked } = ctx;
  const requested = Number(t);
  const startSec = Number.isFinite(requested) && t !== undefined ? requested : lesson.watchedSec >= lesson.durationSec ? 0 : lesson.watchedSec;

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[
          { label: "Curriculum", href: routes.learn },
          { label: `${moduleLabel(mod)} · ${mod.title}`, href: routes.module(mod.id) },
          { label: topicTitle },
        ]}
        title={lesson.title}
        meta={
          <>
            <ItemStatusBadge status={lesson.status} />
            <Badge variant="secondary">
              <Clock /> {formatMinutes(Math.round(lesson.durationSec / 60))}
            </Badge>
            <span className="text-xs text-muted-foreground">Presented by an AI avatar · Script by {lesson.instructor}</span>
          </>
        }
        actions={!locked ? <MarkCompleteButton key={lesson.id} initialStatus={lesson.status} /> : undefined}
      />

      {locked ? (
        <LockedState
          title="This lesson is locked"
          description={`It opens when ${moduleLabel(mod)} · ${mod.title} unlocks.`}
          action={
            <Button variant="outline" asChild>
              <Link href={routes.module(mod.id)}>See what unlocks it</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Keyed so playback state resets when moving to another lesson or timestamp. */}
          <LessonPlayer
            key={`${lesson.id}-${startSec}`}
            lesson={lesson}
            moduleLabel={`${moduleLabel(mod)} · ${mod.title}`}
            startSec={startSec}
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <Card>
              <CardHeader>
                <CardTitle>About this lesson</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0 text-sm">
                <p className="leading-relaxed text-muted-foreground">
                  <RichText text={lesson.summary} />
                </p>
                <p className="flex gap-2 rounded-md bg-muted/60 p-3 text-[13px] text-muted-foreground">
                  <UserCheck className="mt-0.5 size-4 shrink-0" />
                  An expert outlined this lesson, the script was drafted with AI and reviewed by {lesson.instructor}, and the video was
                  generated with an avatar presenter.
                </p>
              </CardContent>
            </Card>
            <LessonResources resources={lesson.resources} />
          </div>

          <LessonNavFooter prev={prev} next={next} />
        </div>
      )}
    </PageContainer>
  );
}
