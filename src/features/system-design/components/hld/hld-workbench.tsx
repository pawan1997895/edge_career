"use client";

import * as React from "react";
import { addEdge, useEdgesState, useNodesState, type Edge, type EdgeChange, type NodeChange, type OnConnect } from "@xyflow/react";
import { ClipboardList, Network, Send } from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { WorkspacePanes } from "@/components/shared/workspace-panes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { BLOCKS } from "@/features/system-design/block-catalog";
import { runDesignChecks, simulateDesignReview } from "@/features/system-design/design-checks";
import { DesignStatusBadge } from "@/features/system-design/components/design-status-badge";
import { SaveIndicator } from "@/features/system-design/components/save-indicator";
import type { BlockNode } from "@/features/system-design/components/hld/block-node";
import { HldCanvas } from "@/features/system-design/components/hld/hld-canvas";
import { HldSidePanel, type HldPanelTab } from "@/features/system-design/components/hld/hld-side-panel";
import { routes } from "@/lib/routes";
import type { BlockType, DesignSections, HldProblem } from "@/types/system-design";

function toFlowNodes(problem: HldProblem): BlockNode[] {
  return problem.nodes.map((n) => ({ id: n.id, type: "block", position: { x: n.x, y: n.y }, data: { blockType: n.type, label: n.label } }));
}

function toFlowEdges(problem: HldProblem): Edge[] {
  return problem.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label }));
}

/** Owns the HLD design state (diagram + write-up) and wires the canvas, checks and review together. */
export function HldWorkbench({ problem }: { problem: HldProblem }) {
  const { toast } = useToast();
  const [nodes, setNodes, applyNodeChanges] = useNodesState<BlockNode>(toFlowNodes(problem));
  const [edges, setEdges, applyEdgeChanges] = useEdgesState<Edge>(toFlowEdges(problem));
  const [sections, setSections] = React.useState<DesignSections>(problem.sections);
  const [tab, setTab] = React.useState<HldPanelTab>(problem.status === "in_review" ? "review" : "checks");
  const [saving, setSaving] = React.useState(false);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nextId = React.useRef(problem.nodes.length + 1);

  React.useEffect(() => () => clearTimeout(saveTimer.current), []);

  // The diagram is stored as data (blocks + connections + sections); here "saving" is simulated.
  const markDirty = React.useCallback(() => {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaving(false), 800);
  }, []);

  const checks = React.useMemo(
    () => runDesignChecks(nodes.map((n) => ({ id: n.id, type: n.data.blockType, label: n.data.label })), edges, problem.readHeavy),
    [nodes, edges, problem.readHeavy],
  );

  const review = useSimulatedAction(() => simulateDesignReview(problem, checks, sections), 2400);

  const onNodesChange = React.useCallback(
    (changes: NodeChange<BlockNode>[]) => {
      applyNodeChanges(changes);
      if (changes.some((c) => c.type === "position" || c.type === "remove" || c.type === "add" || c.type === "replace")) markDirty();
    },
    [applyNodeChanges, markDirty],
  );

  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => {
      applyEdgeChanges(changes);
      if (changes.some((c) => c.type === "remove" || c.type === "add")) markDirty();
    },
    [applyEdgeChanges, markDirty],
  );

  const onConnect: OnConnect = React.useCallback(
    (connection) => {
      setEdges((current) => addEdge({ ...connection, id: `e-${connection.source}-${connection.target}-${Date.now()}` }, current));
      markDirty();
    },
    [setEdges, markDirty],
  );

  function addBlock(type: BlockType, position: { x: number; y: number }) {
    const id = `n${nextId.current++}`;
    setNodes((current) => [
      ...current.map((n) => ({ ...n, selected: false })),
      { id, type: "block", position, selected: true, data: { blockType: type, label: BLOCKS[type].label } },
    ]);
    markDirty();
  }

  function renameNode(id: string, label: string) {
    setNodes((current) => current.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)));
    markDirty();
  }

  function deleteSelected() {
    const removed = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    setNodes((current) => current.filter((n) => !n.selected));
    setEdges((current) => current.filter((e) => !e.selected && !removed.has(e.source) && !removed.has(e.target)));
    markDirty();
  }

  function submitForReview() {
    setTab("review");
    review.run();
    toast({ title: "Design submitted", description: "Automatic checks and the AI review are running. See the Review tab." });
  }

  return (
    <>
      <WorkspaceHeader
        backHref={routes.systemDesign}
        backLabel="System design"
        title={problem.title}
        meta={
          <>
            <Badge variant="secondary">HLD</Badge>
            <DifficultyBadge difficulty={problem.difficulty} />
            <DesignStatusBadge status={review.status === "success" && review.data?.humanReview ? "in_review" : problem.status} />
          </>
        }
        center={<SaveIndicator saving={saving} />}
        actions={
          <Button size="sm" onClick={submitForReview} disabled={review.isLoading}>
            <Send /> <span className="hidden sm:inline">Submit for review</span>
          </Button>
        }
      />
      <WorkspacePanes
        panes={[
          {
            id: "canvas",
            title: "Diagram",
            icon: <Network className="size-4" />,
            content: (
              <div className="flex min-h-0 flex-1 flex-col">
                <HldCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onAddBlock={addBlock}
                  onRenameNode={renameNode}
                  onDeleteSelected={deleteSelected}
                />
              </div>
            ),
          },
          {
            id: "panel",
            title: "Write-up & review",
            icon: <ClipboardList className="size-4" />,
            desktopClassName: "lg:w-[400px] lg:shrink-0 xl:w-[440px]",
            content: (
              <div className="flex min-h-0 flex-1 flex-col">
                <HldSidePanel
                  problem={problem}
                  tab={tab}
                  onTabChange={setTab}
                  sections={sections}
                  onSectionChange={(key, value) => {
                    setSections((current) => ({ ...current, [key]: value }));
                    markDirty();
                  }}
                  checks={checks}
                  review={review.data ?? problem.lastReview}
                  reviewIsNew={review.status === "success"}
                  reviewLoading={review.isLoading}
                  onSubmit={submitForReview}
                />
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
