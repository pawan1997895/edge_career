import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cpu, MemoryStick, ShieldCheck, Timer, WifiOff } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { PhaseBadge } from "@/components/shared/status-badges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getModule } from "@/data/curriculum";
import { getNotebooks } from "@/data/projects";
import { NotebookList } from "@/features/notebooks/components/notebook-list";
import { ModulePreviewBanner } from "@/features/projects/components/module-preview-banner";

export const metadata: Metadata = { title: "ML notebooks" };

const SANDBOX = [
  { icon: Cpu, label: "Python 3.12 kernel, 2 vCPU" },
  { icon: MemoryStick, label: "4 GB memory" },
  { icon: Timer, label: "120 s limit per cell" },
  { icon: WifiOff, label: "No internet access; datasets and model weights are preloaded" },
  { icon: ShieldCheck, label: "Graded on hidden test data you never see" },
];

export default async function NotebooksPage() {
  const [notebooks, mlModule] = await Promise.all([getNotebooks(), getModule("ai-ml-engineering")]);
  if (!mlModule) notFound();
  const prerequisite = await getModule(mlModule.prerequisiteIds[0] ?? "");

  return (
    <PageContainer>
      <PageHeader
        title="ML notebooks"
        description="Explore data, train models and build retrieval in a sandboxed Python notebook. Each notebook is graded automatically."
        meta={
          <>
            <Badge variant="secondary">Module 6 · {mlModule.title}</Badge>
            <PhaseBadge phase={mlModule.releasePhase} />
          </>
        }
      />
      <ModulePreviewBanner module={mlModule} prerequisite={prerequisite} />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionHeader title="Notebooks" />
          <NotebookList notebooks={notebooks} />
        </section>
        <aside>
          <Card>
            <CardHeader>
              <CardTitle>The ML sandbox</CardTitle>
              <CardDescription>Every notebook runs in an isolated container.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {SANDBOX.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex gap-2.5 text-sm">
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    {label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
