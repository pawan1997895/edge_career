"use client";

import { PageContainer } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";

export default function LearnerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageContainer>
      <ErrorState
        title="This page couldn't load"
        description="Your progress is saved. Try again, or go back to the dashboard."
        onRetry={reset}
        className="mt-10"
      />
    </PageContainer>
  );
}
