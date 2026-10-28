import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReasonBadge, formatWaiting, REVIEW_SLA_HOURS, waitingHours } from "@/features/admin/reviews/review-labels";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ReviewQueueItem } from "@/types/admin-content";

/** The five open reviews that have waited longest. */
export function ReviewQueuePreview({ items }: { items: ReviewQueueItem[] }) {
  const oldest = items
    .filter((i) => i.status !== "resolved")
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Human review queue</CardTitle>
        <CardDescription>Oldest first. Scores in this queue do not lock or unlock modules until resolved.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.admin.reviews}>Open queue</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <div className="mt-4 border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Learner and item</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">AI score</TableHead>
              <TableHead className="text-right">Waiting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oldest.map((item) => {
              const hours = waitingHours(item.submittedAt);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={routes.admin.review(item.id)} className="font-medium hover:text-primary">
                      {item.itemTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.learnerName}</p>
                  </TableCell>
                  <TableCell>
                    <ReasonBadge reason={item.reason} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{item.aiScore}</TableCell>
                  <TableCell className={cn("text-right tabular-nums", hours > REVIEW_SLA_HOURS && "font-medium text-destructive")}>
                    {formatWaiting(hours)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
