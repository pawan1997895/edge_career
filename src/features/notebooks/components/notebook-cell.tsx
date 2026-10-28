"use client";

import { Check, Pencil, Play, Trash } from "lucide-react";
import { CodeEditor } from "@/components/shared/code-editor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { CellOutputView } from "@/features/notebooks/components/cell-output";
import { MarkdownView } from "@/features/notebooks/components/markdown-view";
import { cn } from "@/lib/utils";
import type { NotebookCell } from "@/types/projects";

const LINE_HEIGHT = 19;

/** One notebook cell: code (Monaco + outputs) or Markdown (rendered, editable on demand). */
export function NotebookCellView({
  cell,
  selected,
  running,
  queued,
  editing,
  onSelect,
  onRun,
  onDelete,
  onChange,
  onToggleEdit,
}: {
  cell: NotebookCell;
  selected: boolean;
  running: boolean;
  queued: boolean;
  editing: boolean;
  onSelect: () => void;
  onRun: () => void;
  onDelete: () => void;
  onChange: (source: string) => void;
  onToggleEdit: () => void;
}) {
  const lines = Math.min(18, Math.max(3, cell.source.split("\n").length));
  const counter = running ? "*" : queued ? "…" : (cell.executionCount ?? " ");

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex gap-2 rounded-lg border-l-[3px] py-1 pr-2 transition-colors sm:gap-3",
        selected ? "border-l-primary bg-accent/40" : "border-l-transparent hover:bg-muted/40",
      )}
    >
      <div className="w-10 shrink-0 pt-2.5 text-right font-mono text-[11px] text-muted-foreground sm:w-12">
        {cell.kind === "code" ? `[${counter}]` : ""}
      </div>

      <div className="min-w-0 flex-1 space-y-2 py-1">
        {cell.kind === "code" ? (
          <div className={cn("overflow-hidden rounded-md border bg-card", running && "border-primary/50")}>
            <CodeEditor value={cell.source} onChange={onChange} language="python" height={lines * LINE_HEIGHT + 24} lineNumbers={false} />
          </div>
        ) : editing ? (
          <Textarea value={cell.source} onChange={(e) => onChange(e.target.value)} rows={Math.max(3, cell.source.split("\n").length)} className="font-mono text-[12.5px]" autoFocus />
        ) : (
          <div onDoubleClick={onToggleEdit} className="px-1 py-1">
            <MarkdownView source={cell.source} />
          </div>
        )}

        {cell.kind === "code" && cell.outputs.length > 0 && (
          <div className="space-y-3 px-1">
            {cell.outputs.map((output, i) => (
              <CellOutputView key={i} output={output} />
            ))}
          </div>
        )}
      </div>

      <div className={cn("flex shrink-0 flex-col gap-1 pt-1", selected ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100")}>
        {cell.kind === "code" ? (
          <Tooltip content="Run cell" side="left">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Run cell"
              onClick={(e) => {
                e.stopPropagation();
                onRun();
              }}
            >
              <Play />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content={editing ? "Done editing" : "Edit text"} side="left">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={editing ? "Done editing" : "Edit text"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleEdit();
              }}
            >
              {editing ? <Check /> : <Pencil />}
            </Button>
          </Tooltip>
        )}
        <Tooltip content="Delete cell" side="left">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete cell"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
