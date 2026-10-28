"use client";

import { CircleCheck, CircleDashed, CircleX, Cpu, LoaderCircle, MemoryStick, Package, Send, Timer, WifiOff } from "lucide-react";
import { ScoreRing } from "@/components/shared/score-ring";
import { Button } from "@/components/ui/button";
import { PaneHeader } from "@/components/shared/workspace-panes";
import { cn } from "@/lib/utils";
import type { GradedCheck, NotebookDetail } from "@/types/projects";

const STATUS_ICON = {
  pending: { icon: CircleDashed, className: "text-muted-foreground" },
  passed: { icon: CircleCheck, className: "text-success" },
  failed: { icon: CircleX, className: "text-destructive" },
} as const;

/** Graded checks for the notebook plus details of the sandboxed kernel. */
export function NotebookChecksPanel({
  notebook,
  checks,
  grading,
  graded,
  onSubmit,
}: {
  notebook: NotebookDetail;
  checks: GradedCheck[];
  grading: boolean;
  graded: boolean;
  onSubmit: () => void;
}) {
  const passed = checks.filter((c) => c.status === "passed").length;
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-card">
      <PaneHeader title="Graded checks" />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        {graded && (
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <ScoreRing score={(passed / checks.length) * 100} size={64} />
            <div className="text-sm">
              <p className="font-medium">
                {passed} of {checks.length} checks passed
              </p>
              <p className="text-[13px] text-muted-foreground">{passed === checks.length ? "Notebook passed." : "Fix the failing checks and submit again."}</p>
            </div>
          </div>
        )}

        <ul className="space-y-3">
          {checks.map((check) => {
            const { icon: Icon, className } = STATUS_ICON[check.status];
            return (
              <li key={check.id} className={cn("rounded-lg border p-3", check.status === "failed" && "border-destructive/30 bg-destructive/5")}>
                <div className="flex gap-2.5">
                  {grading && check.status === "pending" ? (
                    <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin text-primary" />
                  ) : (
                    <Icon className={cn("mt-0.5 size-4 shrink-0", className)} />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{check.description}</p>
                    {check.detail && <p className="mt-1.5 text-[13px]">{check.detail}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Button className="w-full" onClick={onSubmit} disabled={grading}>
          {grading ? <LoaderCircle className="animate-spin" /> : <Send />} {grading ? "Grading on hidden data…" : "Submit for grading"}
        </Button>

        <div>
          <h3 className="text-sm font-semibold">Sandbox</h3>
          <dl className="mt-2 space-y-2 text-[13px]">
            <SandboxRow icon={<Cpu />} label="Kernel" value={`${notebook.kernel.name} · ${notebook.kernel.cpu}`} />
            <SandboxRow icon={<MemoryStick />} label="Memory" value={notebook.kernel.memory} />
            <SandboxRow icon={<Timer />} label="Per-cell limit" value={`${notebook.kernel.cellTimeoutSec} s`} />
            <SandboxRow icon={<WifiOff />} label="Network" value="No internet access" />
            <SandboxRow icon={<Package />} label="Packages" value={notebook.kernel.packages.join(", ")} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function SandboxRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-3.5">{icon}</span>
      <dt className="w-24 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{value}</dd>
    </div>
  );
}
