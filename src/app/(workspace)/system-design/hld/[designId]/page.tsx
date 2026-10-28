import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHldProblem } from "@/data/system-design";
import { HldWorkbench } from "@/features/system-design/components/hld/hld-workbench";

export async function generateMetadata({ params }: { params: Promise<{ designId: string }> }): Promise<Metadata> {
  const problem = await getHldProblem((await params).designId);
  return { title: problem ? `${problem.title} (HLD)` : "Design not found" };
}

export default async function HldWorkbenchPage({ params }: { params: Promise<{ designId: string }> }) {
  const { designId } = await params;
  const problem = await getHldProblem(designId);
  if (!problem) notFound();
  return <HldWorkbench problem={problem} />;
}
