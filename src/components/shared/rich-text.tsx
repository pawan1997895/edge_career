import { cn } from "@/lib/utils";

/**
 * Renders plain text where `backticks` mark inline code and **double stars** mark bold.
 * Enough for problem statements, hints and chat messages without a Markdown dependency.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <span className={cn("whitespace-pre-line", className)}>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

/** A read-only block of code with a monospace font and horizontal scroll. */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <pre className={cn("overflow-x-auto rounded-md border bg-muted/50 p-3 font-mono text-[13px] leading-relaxed", className)}>
      <code>{code}</code>
    </pre>
  );
}
