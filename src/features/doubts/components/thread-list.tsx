"use client";

import { BookOpen, CodeXml, MessageCircleQuestionMark, Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DoubtThread } from "@/types/doubts";

export type StatusFilter = "all" | "open" | "resolved";

const SOURCE_ICON = { lesson: BookOpen, problem: CodeXml, general: MessageCircleQuestionMark } as const;

export function ThreadList({
  threads,
  selectedId,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onSelect,
  onNew,
}: {
  threads: DoubtThread[];
  selectedId: string;
  query: string;
  filter: StatusFilter;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: StatusFilter) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const q = query.trim().toLowerCase();
  const visible = threads.filter(
    (t) =>
      (filter === "all" || t.status === filter) &&
      (!q || `${t.title} ${t.context.problem?.title ?? ""} ${t.context.lessonMoment?.lessonTitle ?? ""}`.toLowerCase().includes(q)),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Your doubts</h2>
          <Button size="sm" onClick={onNew}>
            <Plus /> New doubt
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search doubts" className="h-8 pl-8" aria-label="Search doubts" />
        </div>
        <div className="flex h-8 rounded-md bg-muted p-0.5" role="group" aria-label="Filter by status">
          {(["all", "open", "resolved"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => onFilterChange(f)}
              className={cn(
                "flex-1 rounded-[5px] text-xs font-medium text-muted-foreground capitalize transition-colors hover:text-foreground",
                filter === f && "bg-card text-foreground shadow-xs",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {visible.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No doubts match"
            description={q ? `Nothing matches “${query}”.` : `You have no ${filter} doubts.`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onQueryChange("");
                  onFilterChange("all");
                }}
              >
                Clear filters
              </Button>
            }
            className="mt-2 border-0 py-8"
          />
        ) : (
          <ul className="space-y-0.5">
            {visible.map((t) => {
              const Icon = SOURCE_ICON[t.source];
              const selected = t.id === selectedId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(t.id)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "flex w-full gap-2.5 rounded-md px-2.5 py-2.5 text-left transition-colors",
                      selected ? "bg-accent text-accent-foreground" : "hover:bg-muted/60",
                    )}
                  >
                    <Icon className={cn("mt-0.5 size-4 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] leading-snug font-medium">{t.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        {t.draft ? (
                          <Badge variant="info">Draft</Badge>
                        ) : t.status === "resolved" ? (
                          <Badge variant="secondary">Resolved</Badge>
                        ) : (
                          <Badge variant="default">Open</Badge>
                        )}
                        <span>{formatRelative(t.updatedAt)}</span>
                        {t.hintsGiven.length > 0 && <span>· {t.hintsGiven.length}/4 hints</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
