import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";

/** Shows which modules the learner tested out of with the placement test. */
export function PlacementCallout({ testedOut }: { testedOut: Module[] }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-success/12 text-success">
          <GraduationCap className="size-4" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="font-medium">Placement test</p>
          {testedOut.length > 0 ? (
            <p className="mt-0.5 text-muted-foreground">
              You tested out of{" "}
              {testedOut.map((m) => `Module ${m.number} · ${m.title}`).join(", ")} with{" "}
              {testedOut[0]?.checkpoint.bestScore}% and started further along the track.
            </p>
          ) : (
            <p className="mt-0.5 text-muted-foreground">Experienced? Test out of modules you already know.</p>
          )}
          <Link href={routes.placementTest} className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
            View placement test <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
