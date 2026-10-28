import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingSection } from "@/features/marketing/components/section";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";

export function CurriculumOverview({ coreModules, electives }: { coreModules: Module[]; electives: Module[] }) {
  const totalWeeks = coreModules.reduce((sum, m) => sum + m.weeks, 0);
  const titleById = new Map([...coreModules, ...electives].map((m) => [m.id, m.title]));

  return (
    <MarketingSection
      id="curriculum"
      eyebrow="Curriculum"
      title={`Six core modules, ${totalWeeks} weeks`}
      description="Taken in order at 8–10 hours a week. Each module ends with a checkpoint exam; electives open once you pass their prerequisite."
    >
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coreModules.map((m) => (
          <li key={m.id} className="flex flex-col rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Module {m.number}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {m.weeks} weeks
              </span>
            </div>
            <h3 className="mt-2 font-semibold">{m.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{m.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1">
              {m.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="muted">
                  {skill}
                </Badge>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 sm:flex-row sm:items-center">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-semibold">Already experienced? Test out.</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The placement test lets you skip modules you already know, so an SDE 2 doesn’t sit through 19 weeks of basics.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={routes.placementTest}>
              Placement test <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-semibold">Electives</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {electives.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3">
                <span>{e.title}</span>
                <span className="shrink-0 text-right text-xs text-muted-foreground">
                  after {e.prerequisiteIds.map((id) => titleById.get(id) ?? id).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MarketingSection>
  );
}
