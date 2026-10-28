"use client";

import { CircleCheck, Info, ListChecks, TriangleAlert, CircleX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LockedBanner, LockedState } from "@/components/shared/locked-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { DsSection } from "@/features/design-system/components/ds-section";

export function StatesGallery() {
  const { toast } = useToast();
  return (
    <DsSection
      id="states"
      title="States"
      description="Every list, panel and page handles empty, loading, error, locked and success states the same way."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <EmptyState
          icon={ListChecks}
          title="No submissions yet"
          description="Solve a problem in the practice workspace and your submissions will show up here."
          action={<Button size="sm">Browse problems</Button>}
        />
        <Card className="gap-3 p-5" aria-label="Loading example">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-64 max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </Card>
        <ErrorState
          title="Couldn’t load your results"
          description="The judge didn’t respond. Your code is saved."
          onRetry={() => toast({ title: "Retrying…" })}
        />
        <LockedState
          title="Production Engineering is locked"
          description="Pass the Module 4 checkpoint with 85% or more to unlock it."
          requirements={[
            { label: "Pass every required item in Module 4", done: true },
            { label: "Score 85% or more on the Module 4 checkpoint", done: false },
          ]}
          action={<Button size="sm">Go to checkpoint</Button>}
        />
      </div>
      <LockedBanner action={<Button size="sm" variant="outline">See requirements</Button>}>
        Preview mode: Module 5 is locked, so project checks won’t run yet.
      </LockedBanner>
      <div className="grid gap-3 md:grid-cols-2">
        <Alert variant="success">
          <CircleCheck />
          <AlertTitle>Checkpoint passed with 91%</AlertTitle>
          <AlertDescription>Production Engineering is now unlocked.</AlertDescription>
        </Alert>
        <Alert variant="info">
          <Info />
          <AlertTitle>Sent for human review</AlertTitle>
          <AlertDescription>Your score of 84% is close to the bar. A reviewer will confirm it within 24 hours.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>4 interview minutes left</AlertTitle>
          <AlertDescription>Your allowance resets on 20 Nov.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleX />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Your bank declined the payment. No money was taken.</AlertDescription>
        </Alert>
      </div>
    </DsSection>
  );
}
