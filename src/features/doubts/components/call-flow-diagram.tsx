import { cn } from "@/lib/utils";
import type { CallNode } from "@/types/doubts";

const TONE: Record<NonNullable<CallNode["tone"]>, string> = {
  default: "bg-card",
  base: "border-success/40 bg-success/10",
  memo: "border-info/40 bg-info/10",
  error: "border-destructive/40 bg-destructive/10 text-destructive",
  active: "border-primary/40 bg-primary/10",
};

function FlowNode({ node, nested }: { node: CallNode; nested: boolean }) {
  return (
    <li
      className={cn(
        "relative",
        nested && "before:absolute before:top-3.5 before:-left-4 before:w-3.5 before:border-t before:border-muted-foreground/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className={cn("rounded-md border px-2 py-1 font-mono text-xs", TONE[node.tone ?? "default"])}>{node.label}</span>
        {node.note && <span className="text-[11px] text-muted-foreground">{node.note}</span>}
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="mt-1.5 ml-3 space-y-1.5 border-l border-muted-foreground/40 pl-4">
          {node.children.map((child) => (
            <FlowNode key={child.id} node={child} nested />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Generated call-stack flowchart: each call is a box, its sub-calls branch below it. */
export function CallFlowDiagram({ title, root }: { title: string; root: CallNode }) {
  return (
    <figure className="space-y-3">
      <figcaption className="text-xs text-muted-foreground">{title}</figcaption>
      <div className="overflow-x-auto pb-1">
        <ul className="min-w-max">
          <FlowNode node={root} nested={false} />
        </ul>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className={cn("size-2.5 rounded-sm border", TONE.base)} /> Base case
        </span>
        <span className="flex items-center gap-1">
          <span className={cn("size-2.5 rounded-sm border", TONE.memo)} /> Memo hit
        </span>
        <span className="flex items-center gap-1">
          <span className={cn("size-2.5 rounded-sm border", TONE.active)} /> Key step
        </span>
        <span className="flex items-center gap-1">
          <span className={cn("size-2.5 rounded-sm border", TONE.error)} /> Bug
        </span>
      </div>
    </figure>
  );
}
