import type { Metadata } from "next";
import { getExamAttempts, getExams, getPlacementSummary, getReviewCases } from "@/data/assessments";
import { AssessmentsOverview } from "@/features/assessments/components/assessments-overview";

export const metadata: Metadata = { title: "Assessments" };

export default async function AssessmentsPage() {
  const [exams, attempts, reviews, placement] = await Promise.all([getExams(), getExamAttempts(), getReviewCases(), getPlacementSummary()]);
  return <AssessmentsOverview exams={exams} attempts={attempts} reviews={reviews} placement={placement} />;
}
