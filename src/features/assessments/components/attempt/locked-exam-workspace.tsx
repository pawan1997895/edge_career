import Link from "next/link";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { LockedState } from "@/components/shared/locked-state";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { ExamDetail } from "@/types/assessments";

/** Shown instead of the exam when someone opens the attempt link for a locked checkpoint. */
export function LockedExamWorkspace({ exam }: { exam: ExamDetail }) {
  return (
    <>
      <WorkspaceHeader backHref={routes.assessments} backLabel="Assessments" title={exam.title} />
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
        <LockedState
          className="w-full max-w-lg"
          title="You can't start this exam yet"
          description="The checkpoint opens when every requirement below is met."
          requirements={exam.requirements}
          action={
            <Button variant="outline" asChild>
              <Link href={routes.exam(exam.id)}>Back to exam details</Link>
            </Button>
          }
        />
      </div>
    </>
  );
}
