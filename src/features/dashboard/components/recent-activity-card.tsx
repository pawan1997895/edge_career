import Link from "next/link";
import { BookOpen, ClipboardCheck, CodeXml, Mic, Network, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ActivityEntry, ActivityKind } from "@/types/dashboard";

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  submission: CodeXml,
  lesson: BookOpen,
  design: Network,
  interview: Mic,
  exam: ClipboardCheck,
};

const TONE_DOT: Record<ActivityEntry["tone"], string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  muted: "bg-muted-foreground/50",
};

export function RecentActivityCard({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-3">
        <ul>
          {entries.map((entry) => {
            const Icon = KIND_ICON[entry.kind];
            return (
              <li key={entry.id}>
                <Link href={entry.href} className="flex items-start gap-3 rounded-md px-2 py-2.5 hover:bg-accent/50">
                  <span className="relative mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-3.5" />
                    <span className={cn("absolute -top-0.5 -right-0.5 size-2 rounded-full ring-2 ring-card", TONE_DOT[entry.tone])} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{entry.title}</span>
                    <span className="block text-[13px] text-muted-foreground">{entry.detail}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(entry.at)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
