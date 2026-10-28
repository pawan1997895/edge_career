"use client";

import { PageContainer } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageContainer>
      <ErrorState title="This admin page couldn't load" onRetry={reset} className="mt-10" />
    </PageContainer>
  );
}
