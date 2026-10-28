import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ItemStatusBadge, ItemStatusIcon, itemKindMeta } from "@/components/shared/status-badges";
import { itemActionLabel } from "@/features/curriculum/lib";
import { formatMinutes } from "@/lib/format";
import { itemHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { LearningItem, Topic } from "@/types/curriculum";

/** Topics with their lessons, practice problems and assignments. `muted` greys out a locked module's outline. */
export function TopicList({ topics, muted = false }: { topics: Topic[]; muted?: boolean }) {
  return (
    <div className={cn("space-y-4", muted && "opacity-70")}>
      {topics.map((topic, i) => {
        const passed = topic.items.filter((item) => item.status === "passed").length;
        return (
          <Card key={topic.id} className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3 sm:px-5">
              <h3 className="text-sm font-semibold">
                <span className="mr-2 text-muted-foreground tabular-nums">{i + 1}.</span>
                {topic.title}
              </h3>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {passed}/{topic.items.length} passed
              </span>
            </div>
            <ul className="divide-y">
              {topic.items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}

function ItemRow({ item }: { item: LearningItem }) {
  const { label, icon: KindIcon } = itemKindMeta(item.kind);
  const locked = item.status === "locked";

  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <KindIcon className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className={cn("text-sm font-medium", locked && "text-muted-foreground")}>{item.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <span>{label}</span>
            <span aria-hidden>·</span>
            <span>{formatMinutes(item.durationMin)}</span>
            <span aria-hidden>·</span>
            <span className={cn(item.required ? "text-foreground" : "")}>{item.required ? "Required" : "Optional"}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-10 sm:pl-0">
        {item.score !== undefined && (
          <span className="text-sm font-medium tabular-nums" title="Best score">
            {item.score}%
          </span>
        )}
        <span className="hidden sm:block">
          <ItemStatusBadge status={item.status} />
        </span>
        <span className="sm:hidden">
          <ItemStatusIcon status={item.status} />
        </span>
        {locked ? (
          <Button variant="ghost" size="sm" disabled className="w-24">
            <Lock /> Locked
          </Button>
        ) : (
          <Button variant={item.status === "in_progress" || item.status === "unlocked" ? "default" : "outline"} size="sm" asChild className="w-24">
            <Link href={itemHref(item)}>{itemActionLabel(item.status)}</Link>
          </Button>
        )}
      </div>
    </li>
  );
}
