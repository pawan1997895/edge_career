"use client";

import * as React from "react";
import Link from "next/link";
import { Funnel, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { RenderStatusBadge, STAGES } from "@/features/admin/content/content-badges";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { PipelineLesson } from "@/types/admin-content";

/** Lesson production board: outline → Claude script draft → expert review → avatar video → published. */
export function LessonPipeline({ lessons }: { lessons: PipelineLesson[] }) {
  const [query, setQuery] = React.useState("");
  const [moduleId, setModuleId] = React.useState("all");
  const [owner, setOwner] = React.useState("all");

  const modules = Array.from(new Map(lessons.map((l) => [l.moduleId, l.moduleTitle])).entries());
  const owners = Array.from(new Set(lessons.map((l) => l.owner))).sort();

  const filtered = lessons.filter(
    (l) =>
      (!query.trim() || l.title.toLowerCase().includes(query.trim().toLowerCase())) &&
      (moduleId === "all" || l.moduleId === moduleId) &&
      (owner === "all" || l.owner === owner),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAGES.map((stage, i) => (
          <Card key={stage.id} className="p-3">
            <p className="text-xs text-muted-foreground">
              {i + 1}. {stage.who}
            </p>
            <p className="mt-0.5 text-sm font-medium">{stage.label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{lessons.filter((l) => l.stage === stage.id).length}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons" className="pl-8" />
        </div>
        <Select value={moduleId} onValueChange={setModuleId}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Module">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modules</SelectItem>
            {modules.map(([id, title]) => (
              <SelectItem key={id} value={id}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Owner">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {owners.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Funnel}
          title="No lessons match these filters"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setModuleId("all");
                setOwner("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop: one column per stage */}
          <div className="hidden gap-3 lg:grid lg:grid-cols-5">
            {STAGES.map((stage) => {
              const inStage = filtered.filter((l) => l.stage === stage.id);
              return (
                <div key={stage.id} className="flex min-w-0 flex-col rounded-lg bg-muted/50 p-2">
                  <p className="flex items-center justify-between px-1.5 pt-1 pb-2 text-xs font-medium text-muted-foreground">
                    {stage.label}
                    <span className="tabular-nums">{inStage.length}</span>
                  </p>
                  <div className="space-y-2">
                    {inStage.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                    {inStage.length === 0 && <p className="px-1.5 py-4 text-center text-xs text-muted-foreground">Nothing here</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile and tablet: grouped list */}
          <div className="space-y-5 lg:hidden">
            {STAGES.map((stage) => {
              const inStage = filtered.filter((l) => l.stage === stage.id);
              if (inStage.length === 0) return null;
              return (
                <section key={stage.id}>
                  <h3 className="mb-2 text-sm font-medium">
                    {stage.label} <span className="text-muted-foreground tabular-nums">· {inStage.length}</span>
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {inStage.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: PipelineLesson }) {
  return (
    <Link
      href={routes.admin.lessonScript(lesson.id)}
      className={cn("block rounded-md border bg-card p-3 shadow-xs transition-colors hover:border-primary/40")}
    >
      <p className="text-[13px] font-medium leading-snug">{lesson.title}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{lesson.moduleTitle}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {(lesson.stage === "avatar_video" || lesson.stage === "published") && (
          <RenderStatusBadge status={lesson.renderStatus} progress={lesson.renderProgress} />
        )}
        <span className="text-xs text-muted-foreground">{lesson.durationMin} min</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {lesson.owner} · {formatRelative(lesson.updatedAt)}
      </p>
    </Link>
  );
}
