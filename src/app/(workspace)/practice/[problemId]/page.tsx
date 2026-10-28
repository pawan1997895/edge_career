import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodingWorkspace } from "@/features/practice/components/coding-workspace";
import { LockedWorkspace } from "@/features/practice/components/locked-workspace";
import { getModule } from "@/data/curriculum";
import { getProblem, getProblemHints, getSqlJudgeData } from "@/data/problems";
import { getSubmissionsForProblem } from "@/data/submissions";
import type { Module } from "@/types/curriculum";

type Props = { params: Promise<{ problemId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = await getProblem((await params).problemId);
  return { title: problem?.title ?? "Problem" };
}

export default async function ProblemWorkspacePage({ params }: Props) {
  const { problemId } = await params;
  const problem = await getProblem(problemId);
  if (!problem) notFound();

  const mod = await getModule(problem.moduleId);
  if (problem.locked || mod?.status === "locked") {
    const prerequisites = (await Promise.all((mod?.prerequisiteIds ?? []).map((id) => getModule(id)))).filter((m): m is Module => !!m);
    return <LockedWorkspace problem={problem} module={mod} prerequisites={prerequisites} />;
  }

  const [submissions, hints, sqlJudge] = await Promise.all([
    getSubmissionsForProblem(problem.id),
    getProblemHints(problem),
    problem.kind === "sql" ? getSqlJudgeData(problem.id) : Promise.resolve(undefined),
  ]);
  const moduleLabel = mod ? `${mod.number ? `Module ${mod.number} · ` : ""}${mod.title}` : undefined;

  return <CodingWorkspace problem={problem} moduleLabel={moduleLabel} submissions={submissions} hints={hints} sqlJudge={sqlJudge} />;
}
