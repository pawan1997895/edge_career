import { PageContainer } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

/** Generic page skeleton used by route-level loading.tsx files. */
export function PageLoadingSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    </PageContainer>
  );
}

/** Full-height skeleton for workspaces (editor, canvas, interview room). */
export function WorkspaceLoadingSkeleton() {
  return (
    <div className="flex h-dvh flex-col">
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <Skeleton className="size-7" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex flex-1 gap-px">
        <div className="flex-1 space-y-3 p-5">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="hidden flex-[1.4] p-5 lg:block">
          <Skeleton className="size-full" />
        </div>
      </div>
    </div>
  );
}
