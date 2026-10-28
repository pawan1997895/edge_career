"use client";

import { CodeXml, Play, Plus, RotateCcw, Square, StepForward, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type KernelStatus = "idle" | "busy" | "restarting";

const KERNEL_LABEL: Record<KernelStatus, string> = { idle: "Idle", busy: "Busy", restarting: "Restarting" };

export function KernelStatusDot({ status }: { status: KernelStatus }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-full", status === "idle" ? "bg-success" : status === "busy" ? "animate-pulse bg-warning" : "bg-muted-foreground")} />
      Kernel {KERNEL_LABEL[status].toLowerCase()}
    </span>
  );
}

/** Run, stop, restart and add-cell controls above the notebook. */
export function NotebookToolbar({
  kernel,
  canRunSelected,
  onRunSelected,
  onRunAll,
  onStop,
  onRestart,
  onAddCode,
  onAddMarkdown,
}: {
  kernel: KernelStatus;
  canRunSelected: boolean;
  onRunSelected: () => void;
  onRunAll: () => void;
  onStop: () => void;
  onRestart: () => void;
  onAddCode: () => void;
  onAddMarkdown: () => void;
}) {
  const busy = kernel !== "idle";
  return (
    <div className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b bg-card px-2 sm:px-3">
      <ToolbarButton label="Run selected cell" onClick={onRunSelected} disabled={busy || !canRunSelected}>
        <Play /> <span className="hidden md:inline">Run</span>
      </ToolbarButton>
      <ToolbarButton label="Run all cells" onClick={onRunAll} disabled={busy}>
        <StepForward /> <span className="hidden md:inline">Run all</span>
      </ToolbarButton>
      <ToolbarButton label="Stop execution" onClick={onStop} disabled={kernel !== "busy"}>
        <Square />
      </ToolbarButton>
      <ToolbarButton label="Restart kernel" onClick={onRestart} disabled={kernel === "restarting"}>
        <RotateCcw />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton label="Add code cell below" onClick={onAddCode}>
        <Plus />
        <CodeXml /> <span className="hidden md:inline">Code</span>
      </ToolbarButton>
      <ToolbarButton label="Add text cell below" onClick={onAddMarkdown}>
        <Plus />
        <Type /> <span className="hidden md:inline">Text</span>
      </ToolbarButton>
      <div className="ml-auto pl-2">
        <KernelStatusDot status={kernel} />
      </div>
    </div>
  );
}

function ToolbarButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip content={label}>
      <Button variant="ghost" size="sm" aria-label={label} onClick={onClick} disabled={disabled} className="gap-1 px-2">
        {children}
      </Button>
    </Tooltip>
  );
}
