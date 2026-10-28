"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkIssueCount, HldChecksList } from "@/features/system-design/components/hld/hld-checks-list";
import { HldBrief } from "@/features/system-design/components/hld/hld-brief";
import { HldReviewPanel } from "@/features/system-design/components/hld/hld-review-panel";
import { HldWriteup } from "@/features/system-design/components/hld/hld-writeup";
import { cn } from "@/lib/utils";
import type { DesignCheck, DesignReview, DesignSections, HldProblem } from "@/types/system-design";

export type HldPanelTab = "brief" | "writeup" | "checks" | "review";

/** Right-hand panel of the HLD workbench: brief, written sections, live checks and the review. */
export function HldSidePanel({
  problem,
  tab,
  onTabChange,
  sections,
  onSectionChange,
  checks,
  review,
  reviewIsNew,
  reviewLoading,
  onSubmit,
}: {
  problem: HldProblem;
  tab: HldPanelTab;
  onTabChange: (tab: HldPanelTab) => void;
  sections: DesignSections;
  onSectionChange: (key: keyof DesignSections, value: string) => void;
  checks: DesignCheck[];
  review?: DesignReview;
  reviewIsNew: boolean;
  reviewLoading: boolean;
  onSubmit: () => void;
}) {
  const issues = checkIssueCount(checks);
  const hasError = checks.some((c) => c.severity === "error");

  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as HldPanelTab)} className="flex min-h-0 flex-1 flex-col gap-0 bg-card">
      <div className="shrink-0 border-b px-3 py-2">
        <TabsList className="w-full">
          <TabsTrigger value="brief" className="flex-1">
            Brief
          </TabsTrigger>
          <TabsTrigger value="writeup" className="flex-1">
            Write-up
          </TabsTrigger>
          <TabsTrigger value="checks" className="flex-1">
            Checks
            {issues > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] tabular-nums",
                  hasError ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning-foreground dark:text-warning",
                )}
              >
                {issues}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="review" className="flex-1">
            Review
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <TabsContent value="brief">
          <HldBrief problem={problem} />
        </TabsContent>
        <TabsContent value="writeup">
          <HldWriteup sections={sections} onChange={onSectionChange} />
        </TabsContent>
        <TabsContent value="checks">
          <HldChecksList checks={checks} />
        </TabsContent>
        <TabsContent value="review">
          <HldReviewPanel review={review} isNew={reviewIsNew} loading={reviewLoading} checks={checks} onSubmit={onSubmit} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
