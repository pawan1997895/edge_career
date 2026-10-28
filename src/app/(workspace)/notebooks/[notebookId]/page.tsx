import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModule } from "@/data/curriculum";
import { getNotebook } from "@/data/projects";
import { NotebookWorkbench } from "@/features/notebooks/components/notebook-workbench";

export async function generateMetadata({ params }: { params: Promise<{ notebookId: string }> }): Promise<Metadata> {
  const notebook = await getNotebook((await params).notebookId);
  return { title: notebook?.title ?? "Notebook not found" };
}

export default async function NotebookPage({ params }: { params: Promise<{ notebookId: string }> }) {
  const { notebookId } = await params;
  const [notebook, mlModule] = await Promise.all([getNotebook(notebookId), getModule("ai-ml-engineering")]);
  if (!notebook) notFound();
  return <NotebookWorkbench notebook={notebook} locked={mlModule?.status === "locked"} />;
}
