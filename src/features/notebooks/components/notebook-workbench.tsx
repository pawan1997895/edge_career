"use client";

import * as React from "react";
import { ClipboardCheck, CodeXml, NotebookPen, Plus, Send, Type } from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { LockedBanner } from "@/components/shared/locked-state";
import { WorkspacePanes } from "@/components/shared/workspace-panes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { NotebookCellView } from "@/features/notebooks/components/notebook-cell";
import { NotebookChecksPanel } from "@/features/notebooks/components/notebook-checks-panel";
import { NotebookToolbar, type KernelStatus } from "@/features/notebooks/components/notebook-toolbar";
import { ProjectStatusBadge } from "@/features/projects/components/project-status-badge";
import { routes } from "@/lib/routes";
import type { CellOutput, GradedCheck, NotebookCell, NotebookDetail } from "@/types/projects";

const CELL_RUN_MS = 650;

function passDetail(check: GradedCheck) {
  if (check.label.includes("AUC")) return "Hidden-set ROC AUC: 0.831";
  if (check.label.includes("Recall")) return "Recall@5 on held-out questions: 0.88";
  return "Passed on the hidden data.";
}

/** Notebook editor with a simulated Python kernel: run cells, restart, add cells, submit for grading. */
export function NotebookWorkbench({ notebook, locked }: { notebook: NotebookDetail; locked: boolean }) {
  const { toast } = useToast();
  const [cells, setCells] = React.useState<NotebookCell[]>(notebook.cells);
  const [selectedId, setSelectedId] = React.useState<string | undefined>(notebook.cells.find((c) => c.kind === "code")?.id);
  const [editing, setEditing] = React.useState<Set<string>>(new Set());
  const [kernel, setKernel] = React.useState<KernelStatus>("idle");
  const [runningId, setRunningId] = React.useState<string | null>(null);
  const [queue, setQueue] = React.useState<string[]>([]);
  const [restartOpen, setRestartOpen] = React.useState(false);

  const cellsRef = React.useRef(cells);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const counter = React.useRef(Math.max(0, ...notebook.cells.map((c) => c.executionCount ?? 0)));
  const nextId = React.useRef(1);

  React.useEffect(() => {
    cellsRef.current = cells;
  });
  React.useEffect(() => () => clearTimeout(timer.current), []);

  // Saved outputs from the mock stand in for what the kernel would print.
  const savedOutputs = React.useMemo(() => new Map(notebook.cells.map((c) => [c.id, c.outputs.length ? c.outputs : (c.outputsOnRun ?? [])])), [notebook.cells]);
  const outputsFor = React.useCallback((cell: NotebookCell): CellOutput[] => savedOutputs.get(cell.id) ?? [], [savedOutputs]);

  const grade = useSimulatedAction<GradedCheck[]>(() => {
    const lastCode = [...cellsRef.current].reverse().find((c) => c.kind === "code");
    const lastRan = Boolean(lastCode?.executionCount);
    return notebook.checks.map((check) => {
      if (check.status !== "pending") return check;
      return lastRan
        ? { ...check, status: "passed", detail: passDetail(check) }
        : { ...check, status: "failed", detail: "The last cell hasn't run, so nothing was saved for grading. Run all cells, then submit again." };
    });
  }, 2400);

  const runCells = React.useCallback(
    (ids: string[]) => {
      clearTimeout(timer.current);
      const step = (remaining: string[]) => {
        const [id, ...rest] = remaining;
        if (!id) {
          setRunningId(null);
          setQueue([]);
          setKernel("idle");
          return;
        }
        const cell = cellsRef.current.find((c) => c.id === id);
        if (!cell || cell.kind !== "code") {
          step(rest);
          return;
        }
        setRunningId(id);
        setQueue(rest);
        setKernel("busy");
        timer.current = setTimeout(() => {
          counter.current += 1;
          const executionCount = counter.current;
          setCells((current) => current.map((c) => (c.id === id ? { ...c, executionCount, outputs: outputsFor(c) } : c)));
          step(rest);
        }, CELL_RUN_MS);
      };
      step(ids);
    },
    [outputsFor],
  );

  function stop() {
    clearTimeout(timer.current);
    if (runningId) {
      setCells((current) => current.map((c) => (c.id === runningId ? { ...c, outputs: [{ kind: "error", text: "KeyboardInterrupt: execution stopped by user" }] } : c)));
    }
    setRunningId(null);
    setQueue([]);
    setKernel("idle");
  }

  function restart() {
    clearTimeout(timer.current);
    setRestartOpen(false);
    setRunningId(null);
    setQueue([]);
    setKernel("restarting");
    counter.current = 0;
    setCells((current) => current.map((c) => ({ ...c, executionCount: undefined, outputs: [] })));
    timer.current = setTimeout(() => {
      setKernel("idle");
      toast({ title: "Kernel restarted", description: "All variables were cleared." });
    }, 1000);
  }

  function addCell(kind: NotebookCell["kind"]) {
    const id = `new-${nextId.current++}`;
    const cell: NotebookCell = { id, kind, source: kind === "markdown" ? "## New section" : "", outputs: [] };
    setCells((current) => {
      const index = current.findIndex((c) => c.id === selectedId);
      const at = index === -1 ? current.length : index + 1;
      return [...current.slice(0, at), cell, ...current.slice(at)];
    });
    setSelectedId(id);
    if (kind === "markdown") setEditing((set) => new Set(set).add(id));
  }

  function deleteCell(id: string) {
    const index = cells.findIndex((c) => c.id === id);
    setCells((current) => current.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(cells[index + 1]?.id ?? cells[index - 1]?.id);
  }

  function toggleEdit(id: string) {
    setEditing((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    grade.run();
    toast({ title: "Submitted for grading", description: "Your saved predictions are scored on data you can't see." });
  }

  const selected = cells.find((c) => c.id === selectedId);

  return (
    <>
      <WorkspaceHeader
        backHref={routes.notebooks}
        backLabel="ML notebooks"
        title={notebook.title}
        meta={
          <>
            <Badge variant="secondary">Module 6</Badge>
            <ProjectStatusBadge status={notebook.status} />
          </>
        }
        center={<span className="font-mono text-xs text-muted-foreground">{notebook.dataset}</span>}
        actions={
          <Button size="sm" onClick={submit} disabled={grade.isLoading}>
            <Send /> <span className="hidden sm:inline">Submit</span>
          </Button>
        }
      />
      <WorkspacePanes
        panes={[
          {
            id: "notebook",
            title: "Notebook",
            icon: <NotebookPen className="size-4" />,
            content: (
              <div className="flex min-h-0 flex-1 flex-col">
                <NotebookToolbar
                  kernel={kernel}
                  canRunSelected={selected?.kind === "code"}
                  onRunSelected={() => selected && runCells([selected.id])}
                  onRunAll={() => runCells(cells.map((c) => c.id))}
                  onStop={stop}
                  onRestart={() => setRestartOpen(true)}
                  onAddCode={() => addCell("code")}
                  onAddMarkdown={() => addCell("markdown")}
                />
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="mx-auto max-w-4xl space-y-1 px-2 py-4 sm:px-4">
                    {locked && (
                      <LockedBanner className="mb-3">
                        Preview: Module 6 is locked until you pass the Module 5 checkpoint. Cells run against sample outputs.
                      </LockedBanner>
                    )}
                    {cells.map((cell) => (
                      <NotebookCellView
                        key={cell.id}
                        cell={cell}
                        selected={cell.id === selectedId}
                        running={cell.id === runningId}
                        queued={queue.includes(cell.id)}
                        editing={editing.has(cell.id)}
                        onSelect={() => setSelectedId(cell.id)}
                        onRun={() => kernel === "idle" && runCells([cell.id])}
                        onDelete={() => deleteCell(cell.id)}
                        onChange={(source) => setCells((current) => current.map((c) => (c.id === cell.id ? { ...c, source } : c)))}
                        onToggleEdit={() => toggleEdit(cell.id)}
                      />
                    ))}
                    <div className="flex justify-center gap-2 pt-3">
                      <Button variant="outline" size="sm" onClick={() => addCell("code")}>
                        <Plus /> <CodeXml /> Code
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addCell("markdown")}>
                        <Plus /> <Type /> Text
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "checks",
            title: "Checks",
            icon: <ClipboardCheck className="size-4" />,
            desktopClassName: "lg:w-[340px] lg:shrink-0",
            content: (
              <NotebookChecksPanel
                notebook={notebook}
                checks={grade.data ?? notebook.checks}
                grading={grade.isLoading}
                graded={grade.status === "success"}
                onSubmit={submit}
              />
            ),
          },
        ]}
      />

      <Dialog open={restartOpen} onOpenChange={setRestartOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Restart the kernel?</DialogTitle>
            <DialogDescription>All variables and outputs are cleared. Your code stays as it is.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestartOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={restart}>
              Restart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
