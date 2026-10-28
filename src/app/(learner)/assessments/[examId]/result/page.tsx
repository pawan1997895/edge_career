import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getModules } from "@/data/curriculum";
import { getExam, getExamQuestions, getExamResult } from "@/data/assessments";
import { ExamResultView } from "@/features/assessments/components/result/exam-result-view";
import { routes } from "@/lib/routes";
import type { ResultOutcome } from "@/types/assessments";

const OUTCOMES: ResultOutcome[] = ["pass", "review", "fail"];

export async function generateMetadata({ params }: { params: Promise<{ examId: string }> }): Promise<Metadata> {
  const exam = await getExam((await params).examId);
  return { title: exam ? `Result · ${exam.shortTitle}` : "Result" };
}

export default async function ExamResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ examId: string }>;
  searchParams: Promise<{ outcome?: string }>;
}) {
  const [{ examId }, { outcome }] = await Promise.all([params, searchParams]);
  const exam = await getExam(examId);
  if (!exam) notFound();
  if (exam.status === "locked" && exam.attempts.length === 0) redirect(routes.exam(examId));

  const selected = OUTCOMES.includes(outcome as ResultOutcome) ? (outcome as ResultOutcome) : "pass";
  const [result, questions, modules] = await Promise.all([getExamResult(examId, selected), getExamQuestions(examId), getModules()]);
  if (!result) notFound();

  const current = modules.find((m) => m.id === exam.moduleId);
  const next = current?.number ? modules.find((m) => m.trackId === "core" && m.number === current.number! + 1) : undefined;

  return <ExamResultView result={result} nextModuleId={next?.id} questionCount={questions.length} />;
}
