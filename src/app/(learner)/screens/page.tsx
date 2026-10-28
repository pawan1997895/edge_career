import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { PhaseBadge } from "@/components/shared/status-badges";
import { Card } from "@/components/ui/card";
import { screenGroups } from "@/lib/screens";

export const metadata: Metadata = { title: "All screens" };

// Review index: every screen in the UI, grouped by feature, with the roadmap phase that ships it.
export default function ScreensPage() {
  const total = screenGroups.reduce((sum, g) => sum + g.screens.length, 0);
  return (
    <PageContainer wide>
      <PageHeader
        title="All screens"
        description={`${total} screens across ${screenGroups.length} feature areas. Every screen uses mock data; the phase shows when its real functionality is planned to ship.`}
      />
      <div className="space-y-8">
        {screenGroups.map((group) => (
          <section key={group.title}>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-base font-semibold">{group.title}</h2>
              <span className="text-xs text-muted-foreground">Plan: {group.planSection}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.screens.map((screen) => (
                <Card key={screen.href} className="group relative p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={screen.href} className="text-sm font-medium after:absolute after:inset-0">
                      {screen.title}
                    </Link>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">{screen.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <PhaseBadge phase={screen.phase} />
                    <code className="truncate text-[11px] text-muted-foreground">{screen.href}</code>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
