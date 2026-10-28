"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhaseBadge, itemKindMeta } from "@/components/shared/status-badges";
import { PublishBadge } from "@/features/admin/content/content-badges";
import { cn } from "@/lib/utils";
import type { Module, Track } from "@/types/curriculum";
import type { PublishStatus } from "@/types/admin-content";

/** Track → module → topic → item tree, mirroring content/tracks/** in the repository. */
export function CurriculumTree({
  tracks,
  modules,
  publishStatus,
}: {
  tracks: Track[];
  modules: Module[];
  publishStatus: Record<string, PublishStatus>;
}) {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(["system-design"]));

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allIds = modules.map((m) => m.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOpen(new Set(allIds))}>
          Expand all
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(new Set())}>
          Collapse all
        </Button>
      </div>
      {tracks.map((track) => (
        <section key={track.id}>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold">{track.title}</h3>
            <code className="text-xs text-muted-foreground">content/tracks/{track.id}/</code>
          </div>
          <Card className="divide-y overflow-hidden">
            {track.moduleIds.map((id) => {
              const mod = modules.find((m) => m.id === id);
              if (!mod) return null;
              return <ModuleRow key={id} mod={mod} status={publishStatus[id] ?? "draft"} open={open.has(id)} onToggle={() => toggle(id)} />;
            })}
          </Card>
        </section>
      ))}
    </div>
  );
}

function ModuleRow({ mod, status, open, onToggle }: { mod: Module; status: PublishStatus; open: boolean; onToggle: () => void }) {
  const items = mod.topics.flatMap((t) => t.items);
  const count = (kind: string) => items.filter((i) => i.kind === kind).length;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-left hover:bg-accent/40"
      >
        <ChevronRight className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">
            {mod.number ? `Module ${mod.number}: ` : ""}
            {mod.title}
          </span>
          <span className="block text-xs text-muted-foreground">
            {mod.topics.length} topics · {count("lesson")} lessons · {count("practice")} practice · {count("assignment")} assignments ·{" "}
            {mod.weeks} weeks
          </span>
        </span>
        <span className="flex items-center gap-2">
          <PhaseBadge phase={mod.releasePhase} />
          <PublishBadge status={status} />
        </span>
      </button>
      {open && (
        <div className="border-t bg-muted/30 px-4 py-3 sm:pl-11">
          {mod.topics.length === 0 ? (
            <p className="text-sm text-muted-foreground">No topics yet. The outline is being written.</p>
          ) : (
            <ul className="space-y-4">
              {mod.topics.map((topic) => (
                <li key={topic.id}>
                  <p className="text-[13px] font-medium">{topic.title}</p>
                  <ul className="mt-1.5 space-y-1">
                    {topic.items.map((item) => {
                      const { icon: Icon, label } = itemKindMeta(item.kind);
                      return (
                        <li key={item.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px]">
                          <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-label={label} />
                          <span className="min-w-0 flex-1 truncate">{item.title}</span>
                          {!item.required && <span className="text-xs text-muted-foreground">Optional</span>}
                          <code className="hidden text-[11px] text-muted-foreground sm:inline">{item.refId}</code>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
              <li className="text-[13px]">
                <span className="text-muted-foreground">Checkpoint exam:</span> <code className="text-[11px]">{mod.checkpoint.examId}</code> · pass mark{" "}
                {mod.checkpoint.passScore}%
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
