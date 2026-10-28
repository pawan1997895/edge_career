import type { Metadata } from "next";
import { getPlacementExam, getPlacementSummary } from "@/data/assessments";
import { PlacementOverview } from "@/features/assessments/components/placement-overview";

export const metadata: Metadata = { title: "Placement test" };

export default async function PlacementPage() {
  const [exam, summary] = await Promise.all([getPlacementExam(), getPlacementSummary()]);
  return <PlacementOverview exam={exam} summary={summary} />;
}
