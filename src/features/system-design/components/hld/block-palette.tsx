"use client";

import { BLOCK_DRAG_TYPE, BLOCK_ORDER, BLOCKS, type BlockCategory } from "@/features/system-design/block-catalog";
import { cn } from "@/lib/utils";
import type { BlockType } from "@/types/system-design";

const CATEGORIES: BlockCategory[] = ["Entry", "Traffic", "Compute", "Data", "Messaging"];

/**
 * Block palette. Drag a block onto the canvas, or click/tap it to drop it in the middle of the view.
 * Vertical list from md up; a horizontal strip on phones.
 */
export function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b bg-card p-2 md:w-52 md:flex-col md:gap-0 md:overflow-x-visible md:overflow-y-auto md:border-r md:border-b-0 md:p-3">
      <p className="hidden pb-2 text-xs text-muted-foreground md:block">Drag onto the canvas, or click to add.</p>
      {CATEGORIES.map((category) => (
        <div key={category} className="contents md:mb-3 md:block">
          <p className="hidden px-1 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase md:block">{category}</p>
          {BLOCK_ORDER.filter((type) => BLOCKS[type].category === category).map((type) => (
            <PaletteItem key={type} type={type} onAdd={onAdd} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PaletteItem({ type, onAdd }: { type: BlockType; onAdd: (type: BlockType) => void }) {
  const meta = BLOCKS[type];
  const Icon = meta.icon;
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(BLOCK_DRAG_TYPE, type);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onAdd(type)}
      title={meta.description}
      className="flex shrink-0 cursor-grab items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-left text-[13px] hover:bg-accent active:cursor-grabbing md:w-full md:border-transparent"
    >
      <span className={cn("flex size-6 items-center justify-center rounded", meta.tint)}>
        <Icon className="size-3.5" />
      </span>
      <span className="whitespace-nowrap">{meta.label}</span>
    </button>
  );
}
