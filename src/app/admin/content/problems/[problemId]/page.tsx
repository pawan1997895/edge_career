import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-header";
import { getModules } from "@/data/curriculum";
import { getProblem } from "@/data/problems";
import {
  buildCiChecks,
  buildHiddenTestGroups,
  buildProblemHistory,
  getProblemFile,
  getRubric,
} from "@/data/admin-content";
import { ProblemEditor } from "@/features/admin/content/components/problem-editor";
import { judgeHarness, parseSignature, referenceSolution, schemaSetupSql, signatureYaml } from "@/features/admin/content/problem-file";
import type { CodeLanguage } from "@/types/practice";

export async function generateMetadata({ params }: { params: Promise<{ problemId: string }> }): Promise<Metadata> {
  const { problemId } = await params;
  const problem = await getProblem(problemId);
  return { title: problem ? `Edit: ${problem.title}` : "Problem not found" };
}

const CODE_LANGUAGES: CodeLanguage[] = ["python", "java", "cpp", "javascript", "go"];

export default async function AdminProblemPage({ params }: { params: Promise<{ problemId: string }> }) {
  const { problemId } = await params;
  const [problem, file, modules] = await Promise.all([getProblem(problemId), getProblemFile(problemId), getModules()]);
  if (!problem || !file) notFound();

  const rubric = (await getRubric(problem.kind === "sql" ? "sql" : "coding"))!;
  const signature = parseSignature(problem);
  const harnesses =
    problem.kind === "sql" ? {} : Object.fromEntries(CODE_LANGUAGES.map((lang) => [lang, judgeHarness(lang, signature)]));

  return (
    <PageContainer wide>
      <ProblemEditor
        problem={problem}
        file={file}
        checks={buildCiChecks(problem, file)}
        hiddenGroups={buildHiddenTestGroups(problem)}
        history={buildProblemHistory(file)}
        rubric={rubric}
        modules={modules.map((m) => ({ id: m.id, title: m.number ? `Module ${m.number}: ${m.title}` : m.title }))}
        signature={signatureYaml(problem, signature)}
        harnesses={harnesses}
        referenceSolution={referenceSolution(problem)}
        schemaSql={problem.kind === "sql" ? schemaSetupSql(problem) : ""}
      />
    </PageContainer>
  );
}
