import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInterviewQuota, getLiveSession } from "@/data/interviews";
import { InterviewRoom } from "@/features/interviews/components/live/interview-room";

export const metadata: Metadata = { title: "Live interview" };

export default async function LiveInterviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const [session, quota] = await Promise.all([getLiveSession(sessionId), getInterviewQuota()]);
  if (!session) notFound();

  return <InterviewRoom session={session} minutesLeft={quota.minutesLeft} />;
}
