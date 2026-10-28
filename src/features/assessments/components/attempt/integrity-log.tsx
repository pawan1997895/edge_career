"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import { INTEGRITY_LABELS, type IntegrityEvent } from "./attempt-types";

/** Shows the learner exactly what has been logged during this attempt. */
export function IntegrityLog({ events }: { events: IntegrityEvent[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label={`Integrity log, ${events.length} events`}>
          {events.length === 0 ? <ShieldCheck className="text-success" /> : <ShieldAlert className="text-warning" />}
          <span className="hidden sm:inline">Integrity log</span>
          <span
            className={cn(
              "rounded-full px-1.5 text-[11px] font-medium tabular-nums",
              events.length ? "bg-warning/20 text-warning-foreground dark:text-warning" : "bg-muted text-muted-foreground",
            )}
          >
            {events.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Integrity log</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sent with your answers. Events are reviewed in context and never fail you automatically.
          </p>
        </div>
        {events.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nothing logged so far.</p>
        ) : (
          <ul className="max-h-64 divide-y overflow-y-auto">
            {[...events].reverse().map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3 px-4 py-2.5 text-[13px]">
                <span>
                  {INTEGRITY_LABELS[e.kind]}
                  <span className="block text-xs text-muted-foreground">Question {e.questionNumber}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatClock(e.atSec)}</span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
