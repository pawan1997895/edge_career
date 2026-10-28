import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExam } from "@/data/assessments";
import { ExamIntro } from "@/features/assessments/components/exam-intro";

export async function generateMetadata({ params }: { params: Promise<{ examId: string }> }): Promise<Metadata> {
  const exam = await getExam((await params).examId);
  return { title: exam?.title ?? "Exam" };
}

export default async function ExamIntroPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const exam = await getExam(examId);
  if (!exam) notFound();
  return <ExamIntro exam={exam} />;
}
