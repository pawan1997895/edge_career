import { GitCommitHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import type { CommitEntry } from "@/types/admin-content";

export function VersionHistory({ commits, description }: { commits: CommitEntry[]; description?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version history</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-4 border-l pl-5">
          {commits.map((c, i) => (
            <li key={`${c.sha}-${i}`} className="relative">
              <GitCommitHorizontal className="absolute top-0.5 -left-[1.95rem] size-4 rounded-full bg-card text-muted-foreground" />
              <p className="text-[13px] font-medium leading-snug">{c.message}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <code>{c.sha}</code> · {c.author} · {formatDateTime(c.at)}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
