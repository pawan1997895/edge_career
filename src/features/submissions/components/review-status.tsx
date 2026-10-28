import { Hourglass, UserCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Submission } from "@/types/practice";

/** Small badge for tables: whether a human reviewer is involved. */
export function ReviewStatusBadge({ review }: { review: Submission["review"] }) {
  if (!review) return null;
  return review.status === "queued" ? (
    <Badge variant="warning">
      <Hourglass /> In human review
    </Badge>
  ) : (
    <Badge variant="info">
      <UserCheck /> Human reviewed
    </Badge>
  );
}

/** Explains why a result is with (or was checked by) a human reviewer. */
export function ReviewStatusAlert({ review }: { review: NonNullable<Submission["review"]> }) {
  if (review.status === "queued") {
    return (
      <Alert variant="warning">
        <Hourglass />
        <AlertTitle>Queued for human review</AlertTitle>
        <AlertDescription>
          <p>{review.reason}</p>
          <p className="mt-1">Reviews usually finish within 24 hours. The score shown is provisional until then.</p>
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="info">
      <UserCheck />
      <AlertTitle>Checked by a human reviewer · {review.reason}</AlertTitle>
      {review.reviewerNote && (
        <AlertDescription>
          <p>{review.reviewerNote}</p>
        </AlertDescription>
      )}
    </Alert>
  );
}
