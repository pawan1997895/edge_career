"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { BLOCKS } from "@/features/system-design/block-catalog";
import { cn } from "@/lib/utils";
import type { BlockType } from "@/types/system-design";

export type BlockNodeData = { blockType: BlockType; label: string };
export type BlockNode = Node<BlockNodeData, "block">;

const handleStyle = { width: 9, height: 9, background: "var(--muted-foreground)", border: "2px solid var(--card)" };

/** A typed block on the HLD canvas: icon, the learner's label and the block type. */
export function BlockNodeView({ data, selected }: NodeProps<BlockNode>) {
  const meta = BLOCKS[data.blockType];
  const Icon = meta.icon;
  return (
    <div
      className={cn(
        "flex w-48 items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-xs transition-shadow",
        selected && "border-primary ring-[3px] ring-primary/20",
      )}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", meta.tint)}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium leading-tight">{data.label}</span>
        <span className="block text-[11px] text-muted-foreground">{meta.label}</span>
      </span>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
}
