import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubmissionDetail } from "@/features/submissions/components/submission-detail";
import { getProblem } from "@/data/problems";
import { getSubmission, getSubmissionLog } from "@/data/submissions";

type Props = { params: Promise<{ submissionId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const submission = await getSubmission((await params).submissionId);
  return { title: submission ? `${submission.problemTitle} · ${submission.id}` : "Submission" };
}

export default async function SubmissionPage({ params }: Props) {
  const { submissionId } = await params;
  const submission = await getSubmission(submissionId);
  if (!submission) notFound();
  const [problem, log] = await Promise.all([getProblem(submission.problemId), getSubmissionLog(submission.id)]);
  return <SubmissionDetail submission={submission} problem={problem} log={log} />;
}
