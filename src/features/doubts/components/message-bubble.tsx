import { Bot, LoaderCircle } from "lucide-react";
import { CodeBlock, RichText } from "@/components/shared/rich-text";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HINT_LEVELS, type DoubtMessage } from "@/types/doubts";

export function MessageBubble({ message }: { message: DoubtMessage }) {
  const isLearner = message.role === "learner";
  const hint = HINT_LEVELS.find((h) => h.id === message.hintLevel);

  return (
    <div className={cn("flex gap-3", isLearner && "flex-row-reverse")}>
      {!isLearner && (
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="size-4" />
        </span>
      )}
      <div className={cn("flex max-w-[85%] min-w-0 flex-col gap-1", isLearner && "items-end")}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{isLearner ? "You" : "Edge AI"}</span>
          {hint && <Badge variant="info">{hint.label} hint</Badge>}
          <span>{formatDateTime(message.at)}</span>
        </div>
        <div
          className={cn(
            "rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed",
            isLearner ? "border-primary/20 bg-primary/8" : "bg-card shadow-xs",
          )}
        >
          <RichText text={message.content} />
          {message.code && <CodeBlock code={message.code} className="mt-2 text-xs" />}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot className="size-4" />
      </span>
      <span className="flex items-center gap-2 rounded-lg border bg-card px-3.5 py-2.5 text-sm text-muted-foreground shadow-xs">
        <LoaderCircle className="size-3.5 animate-spin" /> Edge AI is thinking…
      </span>
    </div>
  );
}
