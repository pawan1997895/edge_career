import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExam, getExamQuestions } from "@/data/assessments";
import { ExamAttempt } from "@/features/assessments/components/attempt/exam-attempt";
import { LockedExamWorkspace } from "@/features/assessments/components/attempt/locked-exam-workspace";

export async function generateMetadata({ params }: { params: Promise<{ examId: string }> }): Promise<Metadata> {
  const exam = await getExam((await params).examId);
  return { title: exam ? `${exam.shortTitle} · in progress` : "Exam" };
}

export default async function ExamAttemptPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const exam = await getExam(examId);
  if (!exam) notFound();
  if (exam.status === "locked") return <LockedExamWorkspace exam={exam} />;

  const questions = await getExamQuestions(examId);
  return <ExamAttempt exam={exam} questions={questions} />;
}
