import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLldProblem } from "@/data/system-design";
import { LldWorkbench } from "@/features/system-design/components/lld/lld-workbench";

export async function generateMetadata({ params }: { params: Promise<{ designId: string }> }): Promise<Metadata> {
  const problem = await getLldProblem((await params).designId);
  return { title: problem ? `${problem.title} (LLD)` : "Design not found" };
}

export default async function LldWorkbenchPage({ params }: { params: Promise<{ designId: string }> }) {
  const { designId } = await params;
  const problem = await getLldProblem(designId);
  if (!problem) notFound();
  return <LldWorkbench problem={problem} />;
}
