import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { itemKindMeta } from "@/components/shared/status-badges";
import { itemHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { LearningItem } from "@/types/curriculum";

/** Previous and next items in the module, so learners can move through it in order. */
export function LessonNavFooter({ prev, next }: { prev?: LearningItem; next?: LearningItem }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {prev ? <NavCard item={prev} direction="prev" /> : <span className="hidden sm:block" />}
      {next && <NavCard item={next} direction="next" />}
    </div>
  );
}

function NavCard({ item, direction }: { item: LearningItem; direction: "prev" | "next" }) {
  const locked = item.status === "locked";
  const content = (
    <>
      {direction === "prev" && <ChevronLeft className="size-4 shrink-0 text-muted-foreground" />}
      <span className={cn("min-w-0 flex-1", direction === "next" && "text-right")}>
        <span className="block text-xs text-muted-foreground">
          {direction === "prev" ? "Previous" : "Next"} · {itemKindMeta(item.kind).label}
          {locked && " · Locked"}
        </span>
        <span className="block truncate text-sm font-medium">{item.title}</span>
      </span>
      {direction === "next" && <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
    </>
  );

  return (
    <Card className={cn("flex-row items-center gap-3 p-4", !locked && "transition-colors hover:border-primary/40", direction === "next" && "sm:col-start-2")}>
      {locked ? (
        <span className="flex w-full items-center gap-3 opacity-60">{content}</span>
      ) : (
        <Link href={itemHref(item)} className="flex w-full items-center gap-3">
          {content}
        </Link>
      )}
    </Card>
  );
}
