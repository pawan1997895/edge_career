import { cn } from "@/lib/utils";

/** Compiler output or runtime error trace, shown in a red-tinted monospace block. */
export function LogOutput({ title, log, className }: { title: string; log: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-md border border-destructive/30", className)}>
      <div className="border-b border-destructive/20 bg-destructive/8 px-3 py-1.5 text-xs font-medium text-destructive">{title}</div>
      <pre className="overflow-x-auto bg-card p-3 font-mono text-xs leading-relaxed whitespace-pre">{log}</pre>
    </div>
  );
}
