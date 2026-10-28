"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckStatusIcon } from "@/features/admin/content/content-badges";
import type { CiCheck } from "@/types/admin-content";

/** Automatic checks for a content file. Shows a running state while a re-run is in progress. */
export function ChecksPanel({ checks, running, onRerun }: { checks: CiCheck[]; running: boolean; onRerun: () => void }) {
  const shown = running ? checks.map((c) => ({ ...c, status: "running" as const })) : checks;
  const failed = shown.filter((c) => c.status === "fail").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatic checks</CardTitle>
        <CardDescription>
          {running ? "Running on a sandboxed CI worker…" : failed ? `${failed} of ${checks.length} failing` : `All ${checks.length} passing`}
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={onRerun} disabled={running}>
            <RotateCcw className={running ? "animate-spin" : undefined} /> Re-run
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {shown.map((check) => (
            <li key={check.id} className="flex gap-2.5">
              <CheckStatusIcon status={check.status} />
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug">{check.label}</p>
                <p className={check.status === "fail" ? "mt-0.5 text-xs text-destructive" : "mt-0.5 text-xs text-muted-foreground"}>
                  {check.status === "running" ? "Running…" : check.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
