"use client";

import "@xyflow/react/dist/style.css";

import * as React from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { MousePointerClick, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BLOCK_DRAG_TYPE, BLOCKS, isBlockType } from "@/features/system-design/block-catalog";
import { BlockNodeView, type BlockNode } from "@/features/system-design/components/hld/block-node";
import { BlockPalette } from "@/features/system-design/components/hld/block-palette";
import type { BlockType } from "@/types/system-design";

const nodeTypes = { block: BlockNodeView };

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
};

export interface HldCanvasProps {
  nodes: BlockNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<BlockNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onAddBlock: (type: BlockType, position: { x: number; y: number }) => void;
  onRenameNode: (id: string, label: string) => void;
  onDeleteSelected: () => void;
}

/** The HLD diagram editor: block palette plus a React Flow canvas. */
export function HldCanvas(props: HldCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}

function CanvasInner({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onAddBlock, onRenameNode, onDeleteSelected }: HldCanvasProps) {
  const { screenToFlowPosition } = useReactFlow();
  const { resolvedTheme } = useTheme();
  const wrapper = React.useRef<HTMLDivElement>(null);
  const addCount = React.useRef(0);

  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedEdges = edges.filter((e) => e.selected);

  function addAtCentre(type: BlockType) {
    const rect = wrapper.current?.getBoundingClientRect();
    const centre = rect ? screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }) : { x: 0, y: 0 };
    // Nudge each new block so repeated clicks don't stack exactly on top of each other.
    const offset = (addCount.current++ % 5) * 24;
    onAddBlock(type, { x: centre.x - 96 + offset, y: centre.y - 24 + offset });
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    const type = event.dataTransfer.getData(BLOCK_DRAG_TYPE);
    if (!isBlockType(type)) return;
    const point = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    onAddBlock(type, { x: point.x - 96, y: point.y - 24 });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <BlockPalette onAdd={addAtCentre} />
      <div
        ref={wrapper}
        className="relative min-h-0 flex-1"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={handleDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultEdgeOptions={defaultEdgeOptions}
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
          fitViewOptions={{ padding: 0.06, maxZoom: 1 }}
          minZoom={0.3}
        >
          <Background gap={20} size={1.2} color="var(--border)" />
          <Controls showInteractive={false} />
          <MiniMap
            className="hidden md:block"
            pannable
            zoomable
            nodeColor={(n) => BLOCKS[(n as BlockNode).data.blockType].color}
            maskColor="color-mix(in oklch, var(--background) 70%, transparent)"
          />

          {selectedNodes.length === 1 && (
            <Panel position="top-right">
              <SelectedBlockPanel
                key={selectedNodes[0]!.id}
                node={selectedNodes[0]!}
                onRename={(label) => onRenameNode(selectedNodes[0]!.id, label)}
                onDelete={onDeleteSelected}
              />
            </Panel>
          )}
          {selectedNodes.length === 0 && selectedEdges.length > 0 && (
            <Panel position="top-right">
              <Button variant="outline" size="sm" onClick={onDeleteSelected}>
                <Trash /> Delete {selectedEdges.length === 1 ? "connection" : `${selectedEdges.length} connections`}
              </Button>
            </Panel>
          )}
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-xs rounded-lg border border-dashed bg-card/90 px-6 py-8 text-center">
              <MousePointerClick className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Start your design</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag blocks from the palette, or click one to add it. Connect blocks by dragging from the dot on the right edge.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectedBlockPanel({ node, onRename, onDelete }: { node: BlockNode; onRename: (label: string) => void; onDelete: () => void }) {
  const [label, setLabel] = React.useState(node.data.label);
  return (
    <div className="w-60 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
      <p className="text-xs text-muted-foreground">{BLOCKS[node.data.blockType].label}</p>
      <label htmlFor="block-label" className="sr-only">
        Block label
      </label>
      <Input
        id="block-label"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          onRename(e.target.value);
        }}
        className="mt-1.5 h-8"
      />
      <Button variant="ghost" size="sm" className="mt-2 w-full text-destructive hover:text-destructive" onClick={onDelete}>
        <Trash /> Delete block
      </Button>
    </div>
  );
}
