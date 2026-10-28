"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorkspacePane {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  /**
   * Width classes for large screens, always `lg:`-prefixed, e.g. "lg:w-[42%]" or
   * "lg:w-96 lg:shrink-0". Panes without it share the remaining space.
   */
  desktopClassName?: string;
}

/**
 * Side-by-side panes on large screens, tabs on phones and tablets.
 * Used by every full-screen workspace (coding, SQL, LLD, HLD, interview room, notebooks).
 * Each pane is mounted once; only CSS changes between layouts, so editors and
 * canvases keep their state when the viewport or the active tab changes.
 */
export function WorkspacePanes({ panes, className }: { panes: WorkspacePane[]; className?: string }) {
  const [activeId, setActiveId] = React.useState(panes[0]?.id);
  const baseId = React.useId();

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col lg:flex-row", className)}>
      {/* Tab bar, phones and tablets only */}
      <div className="shrink-0 border-b bg-card px-3 py-2 lg:hidden">
        <div role="tablist" aria-label="Workspace panels" className="flex h-9 w-full rounded-lg bg-muted p-1">
          {panes.map((pane) => {
            const selected = pane.id === activeId;
            return (
              <button
                key={pane.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${pane.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-pane-${pane.id}`}
                onClick={() => setActiveId(pane.id)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 truncate rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 [&_svg]:size-4 [&_svg]:shrink-0",
                  selected && "bg-card text-foreground shadow-xs",
                )}
              >
                {pane.icon}
                <span className="truncate">{pane.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {panes.map((pane, i) => (
        <section
          key={pane.id}
          id={`${baseId}-pane-${pane.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${pane.id}`}
          aria-label={pane.title}
          className={cn(
            "min-h-0 min-w-0 flex-col max-lg:flex-1 lg:flex",
            pane.id === activeId ? "flex" : "hidden",
            i > 0 && "lg:border-l",
            pane.desktopClassName ?? "lg:flex-1",
          )}
        >
          {pane.content}
        </section>
      ))}
    </div>
  );
}

/** Header strip at the top of a pane: title on the left, controls on the right. */
export function PaneHeader({ title, icon, actions, className }: { title: React.ReactNode; icon?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-11 shrink-0 items-center gap-2 border-b bg-card px-4", className)}>
      {icon && <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>}
      <h2 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h2>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  );
}
