"use client";

import * as React from "react";
import { Bot, CircleCheck, FileText, LoaderCircle, Pencil, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RichText } from "@/components/shared/rich-text";
import { stageLabel, STAGES } from "@/features/admin/content/content-badges";
import { AvatarVideoCard } from "@/features/admin/content/components/avatar-video-card";
import { RequestChangesDialog } from "@/features/admin/content/components/request-changes-dialog";
import { ScriptSectionCard } from "@/features/admin/content/components/script-section-card";
import { VersionHistory } from "@/features/admin/content/components/version-history";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { DEMO_NOW } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { LessonScript, LessonStage, ScriptSection } from "@/types/admin-content";

export function ScriptReview({ script }: { script: LessonScript }) {
  const { toast } = useToast();
  const [stage, setStage] = React.useState<LessonStage>(script.stage);
  const [sections, setSections] = React.useState<ScriptSection[]>(script.sections);
  const [editing, setEditing] = React.useState(false);
  const [video, setVideo] = React.useState(script.video);
  const [changesNote, setChangesNote] = React.useState<string | null>(null);
  const [versions, setVersions] = React.useState(script.versions);

  const draft = useSimulatedAction(
    () =>
      script.outline.map((point, i) => ({
        id: `gen-${i}`,
        title: point.replace(/`/g, ""),
        body: `Draft paragraph for "${point.replace(/`/g, "")}". Claude writes this from the expert's outline using lesson-script prompt v4; the expert edits it before approval.`,
        comments: [],
      })),
    1800,
  );

  // Once the draft is generated, show it and move to expert review.
  const [appliedDraft, setAppliedDraft] = React.useState(false);
  if (draft.status === "success" && draft.data && !appliedDraft) {
    setAppliedDraft(true);
    setSections(draft.data);
    setStage("expert_review");
  }

  // Simulated render progress for the avatar video.
  React.useEffect(() => {
    if (video.status !== "queued" && video.status !== "rendering") return;
    const timer = setInterval(() => {
      setVideo((v) => {
        if (v.status === "queued") return { ...v, status: "rendering", progress: 5 };
        const progress = Math.min(100, v.progress + 7);
        return progress >= 100 ? { ...v, status: "ready", progress: 100, durationSec: 22 * 60 + 14 } : { ...v, progress };
      });
    }, 900);
    return () => clearInterval(timer);
  }, [video.status]);

  const openComments = sections.flatMap((s) => s.comments).filter((c) => !c.resolved).length;
  const canApprove = (stage === "expert_review" || stage === "script_draft") && sections.length > 0;
  const transcriptSync = video.status === "ready" ? "synced" : script.transcriptSync;

  function approve() {
    setStage("avatar_video");
    setChangesNote(null);
    setEditing(false);
    setVideo((v) => ({ ...v, status: "queued", progress: 0 }));
    setVersions((list) => [{ sha: "c0ffee1", message: "Script approved, avatar render queued", author: script.reviewer, at: DEMO_NOW }, ...list]);
    toast({ title: "Script approved", description: "The avatar video render has been queued.", variant: "success" });
  }

  function publish() {
    setStage("published");
    toast({ title: "Lesson published", description: "Video, transcript and chapters are live on the CDN.", variant: "success" });
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: routes.admin.overview },
          { label: "Lesson production", href: routes.admin.lessons },
          { label: script.title },
        ]}
        title={script.title}
        description={`${script.moduleTitle} · expert ${script.expert} · reviewer ${script.reviewer}`}
        meta={
          <>
            <Badge variant={stage === "published" ? "success" : "secondary"}>{stageLabel(stage)}</Badge>
            {openComments > 0 && <Badge variant="warning">{openComments} open comments</Badge>}
            {changesNote && <Badge variant="destructive">Changes requested</Badge>}
          </>
        }
        actions={
          <>
            {sections.length > 0 && stage !== "published" && (
              <Button variant="ghost" onClick={() => setEditing((e) => !e)}>
                <Pencil /> {editing ? "Done editing" : "Edit script"}
              </Button>
            )}
            {canApprove && (
              <>
                <RequestChangesDialog
                  onSubmit={(note, redraft) => {
                    setChangesNote(note);
                    toast({ title: "Sent back to the expert", description: redraft ? "Claude will prepare a revised draft." : undefined });
                  }}
                />
                <Button onClick={approve} disabled={openComments > 0}>
                  <CircleCheck /> Approve script
                </Button>
              </>
            )}
            {stage === "avatar_video" && video.status === "ready" && (
              <Button onClick={publish}>
                <CircleCheck /> Publish lesson
              </Button>
            )}
          </>
        }
      />

      <StageTracker stage={stage} />

      {canApprove && openComments > 0 && (
        <p className="mb-4 text-xs text-muted-foreground">Resolve all open comments before approving.</p>
      )}
      {changesNote && (
        <Alert variant="warning" className="mb-4">
          <FileText />
          <AlertTitle>Changes requested</AlertTitle>
          <AlertDescription>{changesNote}</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expert outline</CardTitle>
              <CardDescription>Written by {script.expert}. Claude drafts the script from these points.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm">
                {script.outline.map((point) => (
                  <li key={point}>
                    <RichText text={point} />
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Script</CardTitle>
              <CardDescription>
                <span className="inline-flex items-center gap-1">
                  <Bot className="size-3.5" /> Drafted by Claude (lesson-script prompt v4), edited by the expert
                </span>
              </CardDescription>
              {editing && (
                <CardAction>
                  <Badge variant="info">Editing</Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No script yet"
                  description="Generate a first draft from the outline. The expert reviews every line before it is recorded."
                  action={
                    <Button onClick={draft.run} disabled={draft.isLoading}>
                      {draft.isLoading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                      {draft.isLoading ? "Drafting with Claude…" : "Generate script draft"}
                    </Button>
                  }
                />
              ) : (
                <div className="divide-y">
                  {sections.map((section, i) => (
                    <ScriptSectionCard
                      key={section.id}
                      index={i}
                      section={section}
                      editing={editing}
                      onBodyChange={(body) => setSections((list) => list.map((s) => (s.id === section.id ? { ...s, body } : s)))}
                      onToggleComment={(commentId) =>
                        setSections((list) =>
                          list.map((s) =>
                            s.id === section.id
                              ? { ...s, comments: s.comments.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c)) }
                              : s,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <AvatarVideoCard video={video} onRetry={() => setVideo((v) => ({ ...v, status: "queued", progress: 0 }))} />
          <Card>
            <CardHeader>
              <CardTitle>Transcript sync</CardTitle>
              <CardDescription>Timestamps for the lesson player&apos;s synced transcript and &ldquo;Ask about this moment&rdquo;.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={transcriptSync === "synced" ? "success" : transcriptSync === "out_of_date" ? "warning" : "muted"}>
                {transcriptSync === "synced" ? "Synced to video" : transcriptSync === "out_of_date" ? "Out of date" : "Waiting for video"}
              </Badge>
            </CardContent>
          </Card>
          <VersionHistory commits={versions} />
        </aside>
      </div>
    </>
  );
}

function StageTracker({ stage }: { stage: LessonStage }) {
  const current = STAGES.findIndex((s) => s.id === stage);
  return (
    <ol className="mb-6 grid grid-cols-5 gap-1.5" aria-label="Production stage">
      {STAGES.map((s, i) => (
        <li key={s.id} className="min-w-0">
          <span className={cn("block h-1.5 rounded-full", i <= current ? "bg-primary" : "bg-muted")} />
          <span className={cn("mt-1.5 block truncate text-xs", i === current ? "font-medium" : "text-muted-foreground")}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}
