"use client";

import { CircleCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ScriptSection } from "@/types/admin-content";

/** One section of a lesson script with its inline reviewer comments. */
export function ScriptSectionCard({
  index,
  section,
  editing,
  onBodyChange,
  onToggleComment,
}: {
  index: number;
  section: ScriptSection;
  editing: boolean;
  onBodyChange: (body: string) => void;
  onToggleComment: (commentId: string) => void;
}) {
  const open = section.comments.filter((c) => !c.resolved).length;
  return (
    <section className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">
          <span className="mr-1.5 text-muted-foreground tabular-nums">{index + 1}.</span>
          {section.title}
        </h3>
        {open > 0 && (
          <span className="flex items-center gap-1 text-xs text-warning-foreground dark:text-warning">
            <MessageSquare className="size-3.5" /> {open} open
          </span>
        )}
      </div>
      {editing ? (
        <Textarea value={section.body} onChange={(e) => onBodyChange(e.target.value)} className="mt-2 min-h-32 leading-relaxed" />
      ) : (
        <p className="mt-2 text-sm leading-relaxed">{section.body}</p>
      )}
      {section.comments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {section.comments.map((comment) => (
            <li
              key={comment.id}
              className={cn(
                "rounded-md border-l-2 bg-muted/50 px-3 py-2 text-[13px]",
                comment.resolved ? "border-l-success opacity-70" : "border-l-warning",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium">
                  {comment.author} <span className="font-normal text-muted-foreground">· {formatRelative(comment.at)}</span>
                </span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onToggleComment(comment.id)}>
                  {comment.resolved ? (
                    <>
                      <CircleCheck className="text-success" /> Resolved
                    </>
                  ) : (
                    "Resolve"
                  )}
                </Button>
              </div>
              <p className={cn("mt-1", comment.resolved && "line-through")}>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
