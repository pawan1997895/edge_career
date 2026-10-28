import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { CoreTrackList } from "@/features/curriculum/components/core-track-list";
import { ElectiveGrid } from "@/features/curriculum/components/elective-grid";
import { LockingRuleCard } from "@/features/curriculum/components/locking-rule-card";
import { PlacementCallout } from "@/features/curriculum/components/placement-callout";
import { getModules, getTracks } from "@/data/curriculum";

export const metadata: Metadata = { title: "Curriculum" };

export default async function CurriculumPage() {
  const [tracks, modules] = await Promise.all([getTracks(), getModules()]);
  const core = modules.filter((m) => m.trackId === "core");
  const electives = modules.filter((m) => m.trackId === "electives");
  const coreTrack = tracks.find((t) => t.id === "core")!;
  const electiveTrack = tracks.find((t) => t.id === "electives")!;
  const done = core.filter((m) => m.status === "passed" || m.status === "tested_out").length;
  const totalWeeks = core.reduce((sum, m) => sum + m.weeks, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Curriculum"
        description={coreTrack.description}
        meta={
          <>
            <Badge variant="secondary">{totalWeeks} weeks</Badge>
            <Badge variant="secondary">
              {done} of {core.length} core modules complete
            </Badge>
            <Badge variant="secondary">{electives.length} electives</Badge>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section>
          <SectionHeader title={coreTrack.title} description="Taken in order. Each module unlocks after the one before it." />
          <CoreTrackList modules={core} all={modules} />
        </section>
        <aside className="space-y-4">
          <PlacementCallout testedOut={core.filter((m) => m.status === "tested_out")} />
          <LockingRuleCard />
        </aside>
      </div>

      <section className="mt-10">
        <SectionHeader title={electiveTrack.title} description={electiveTrack.description} />
        <ElectiveGrid electives={electives} all={modules} />
      </section>
    </PageContainer>
  );
}
