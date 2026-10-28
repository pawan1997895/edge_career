import Link from "next/link";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { Button } from "@/components/ui/button";
import { LockedState } from "@/components/shared/locked-state";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";
import type { ProblemSummary } from "@/types/practice";

/** Shown instead of the editor when the problem's module isn't unlocked yet. */
export function LockedWorkspace({ problem, module: mod, prerequisites }: { problem: ProblemSummary; module?: Module; prerequisites: Module[] }) {
  const moduleName = mod ? `${mod.number ? `Module ${mod.number}: ` : ""}${mod.title}` : "its module";
  return (
    <>
      <WorkspaceHeader backHref={routes.practice} backLabel="Problem bank" title={problem.title} />
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
        <LockedState
          className="w-full max-w-lg"
          title={`Part of ${moduleName}`}
          description="This problem opens when its module unlocks. Modules in the core track unlock in order: pass every required item and score 85% or more on the checkpoint."
          requirements={[
            ...prerequisites.map((p) => ({
              label: `Pass ${p.number ? `Module ${p.number}: ` : ""}${p.title}`,
              done: p.status === "passed" || p.status === "tested_out",
            })),
            { label: `Start ${moduleName}`, done: false },
          ]}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {prerequisites[0] && (
                <Button asChild>
                  <Link href={routes.module(prerequisites[0].id)}>Go to {prerequisites[0].title}</Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={routes.practice}>Back to problem bank</Link>
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
}
