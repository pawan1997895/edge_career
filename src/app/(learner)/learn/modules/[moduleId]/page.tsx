import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CircleCheck, ListTree } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { LockedState, type UnlockRequirement } from "@/components/shared/locked-state";
import { ModuleStatusBadge, PhaseBadge } from "@/components/shared/status-badges";
import { CheckpointCard } from "@/features/curriculum/components/checkpoint-card";
import { ModuleDetailsAside } from "@/features/curriculum/components/module-details-aside";
import { TopicList } from "@/features/curriculum/components/topic-list";
import { UnlockRulePanel } from "@/features/curriculum/components/unlock-rule-panel";
import { lockReason, moduleLabel, unlockedBy, unmetPrerequisites } from "@/features/curriculum/lib";
import { getModule, getModules, requiredItemCounts } from "@/data/curriculum";
import { itemHref, routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = await getModule(moduleId);
  return { title: mod?.title ?? "Module" };
}

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const [mod, all] = await Promise.all([getModule(moduleId), getModules()]);
  if (!mod) notFound();

  const required = requiredItemCounts(mod);
  const prerequisites = mod.prerequisiteIds.map((id) => all.find((m) => m.id === id)).filter((m): m is Module => !!m);
  const locked = mod.status === "locked";
  const items = mod.topics.flatMap((t) => t.items);
  const nextItem =
    items.find((i) => i.status === "in_progress") ??
    items.find((i) => i.status === "unlocked" && i.required) ??
    items.find((i) => i.status === "unlocked");

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Curriculum", href: routes.learn }, { label: moduleLabel(mod) }]}
        title={mod.title}
        description={mod.summary}
        meta={
          <>
            <ModuleStatusBadge status={mod.status} />
            <Badge variant="secondary">
              <CalendarDays /> {mod.weeks} weeks
            </Badge>
            {required.total > 0 && (
              <Badge variant="secondary">
                {required.passed}/{required.total} required items passed
              </Badge>
            )}
            {mod.releasePhase > 1 && <PhaseBadge phase={mod.releasePhase} />}
          </>
        }
        actions={
          !locked && nextItem ? (
            <Button asChild>
              <Link href={itemHref(nextItem)}>
                {nextItem.status === "in_progress" ? "Continue" : "Start"}: {nextItem.title}
              </Link>
            </Button>
          ) : undefined
        }
      />

      <ModuleStateBanner mod={mod} all={all} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {!locked && required.total > 0 && (
            <Card className="flex-row items-center gap-4 p-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Module progress</span>
                  <span className="tabular-nums text-muted-foreground">{mod.progress}%</span>
                </div>
                <Progress value={mod.progress} tone={mod.progress === 100 ? "success" : "primary"} aria-label="Module progress" />
              </div>
            </Card>
          )}

          {mod.topics.length === 0 ? (
            <EmptyState
              icon={ListTree}
              title="Outline coming soon"
              description="Our experts are still writing this module. Topics appear here once they pass content review."
            />
          ) : (
            <>
              {locked && <p className="text-sm text-muted-foreground">Preview of what this module covers. Items open once it unlocks.</p>}
              <TopicList topics={mod.topics} muted={locked} />
            </>
          )}
        </div>

        <aside className="space-y-4">
          <CheckpointCard checkpoint={mod.checkpoint} moduleLocked={locked} />
          <UnlockRulePanel mod={mod} required={required} unlocks={unlockedBy(mod, all)} />
          <ModuleDetailsAside mod={mod} prerequisites={prerequisites} />
        </aside>
      </div>
    </PageContainer>
  );
}

/** Locked, tested-out or passed banner above the outline. */
function ModuleStateBanner({ mod, all }: { mod: Module; all: Module[] }) {
  if (mod.status === "locked") {
    const blockers = unmetPrerequisites(mod, all);
    const blocker = blockers[0];
    const requirements: UnlockRequirement[] = mod.prerequisiteIds.flatMap((id) => {
      const p = all.find((m) => m.id === id);
      if (!p) return [];
      const name = `${p.number ? `Module ${p.number} · ` : ""}${p.title}`;
      // When the blocking module is underway, spell out its two remaining conditions.
      if (p.status === "in_progress") {
        const counts = requiredItemCounts(p);
        return [
          { label: `${name}: pass every required item (${counts.passed}/${counts.total})`, done: counts.passed === counts.total },
          {
            label: `${name}: score ${p.checkpoint.passScore}%+ on the checkpoint${p.checkpoint.bestScore !== undefined ? ` (best so far ${p.checkpoint.bestScore}%)` : ""}`,
            done: p.checkpoint.status === "passed",
          },
        ];
      }
      return [{ label: `Pass ${name}`, done: p.status === "passed" || p.status === "tested_out" }];
    });

    return (
      <LockedState
        className="mb-6"
        title={`${moduleLabel(mod)} is locked`}
        description={lockReason(mod, all)}
        requirements={requirements}
        action={
          blocker ? (
            <Button variant="outline" asChild>
              <Link href={routes.module(blocker.id)}>
                Go to {blocker.number ? `Module ${blocker.number}` : blocker.title}
              </Link>
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (mod.status === "tested_out") {
    return (
      <Alert variant="success" className="mb-6">
        <CircleCheck />
        <AlertTitle>You tested out of this module</AlertTitle>
        <AlertDescription>
          You scored {mod.checkpoint.bestScore}% on the placement test, so every item is marked as passed. Lessons stay open if you want a
          refresher.{" "}
          <Link href={routes.placementTest} className="font-medium text-primary hover:underline">
            View placement result
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (mod.status === "passed") {
    return (
      <Alert variant="success" className="mb-6">
        <CircleCheck />
        <AlertTitle>Module passed</AlertTitle>
        <AlertDescription>
          Checkpoint score {mod.checkpoint.bestScore}%. Everything here stays open for review and extra practice.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
