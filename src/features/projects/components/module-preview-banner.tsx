import Link from "next/link";
import { LockedBanner } from "@/components/shared/locked-state";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";

/**
 * Shown on Module 5 and 6 pages while the module is locked. The page stays viewable
 * as a preview filled with sample data so learners can see what's coming.
 */
export function ModulePreviewBanner({ module: mod, prerequisite }: { module: Module; prerequisite?: Module }) {
  if (mod.status !== "locked") return null;
  return (
    <LockedBanner
      className="mb-6"
      action={
        prerequisite && (
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.module(prerequisite.id)}>Go to Module {prerequisite.number}</Link>
          </Button>
        )
      }
    >
      <span className="font-medium text-foreground">Preview: Module {mod.number} is locked.</span>{" "}
      {prerequisite
        ? `It unlocks when you pass the Module ${prerequisite.number} (${prerequisite.title}) checkpoint with 85% or more.`
        : "It unlocks when you pass the previous module's checkpoint."}{" "}
      You can look around; the data shown is sample data.
    </LockedBanner>
  );
}
