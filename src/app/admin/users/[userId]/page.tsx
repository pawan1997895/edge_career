import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserActivityTabs } from "@/features/admin/users/components/user-activity-tabs";
import { UserAdminActions } from "@/features/admin/users/components/user-admin-actions";
import { AccountStatusBadge, RoleBadge, UserFlags } from "@/features/admin/users/components/user-badges";
import { UserModuleProgress } from "@/features/admin/users/components/user-module-progress";
import { UserMinutesCard, UserProfileCard } from "@/features/admin/users/components/user-profile-card";
import { getAdminUser } from "@/data/admin-ops";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import { PLAN_LABELS } from "@/types/user";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params;
  const user = await getAdminUser(userId);
  return { title: user ? user.name : "User not found" };
}

export default async function AdminUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getAdminUser(userId);
  if (!user) notFound();

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: routes.admin.overview },
          { label: "Users", href: routes.admin.users },
          { label: user.name },
        ]}
        title={
          <span className="flex items-center gap-3">
            <Avatar name={user.name} className="size-10 text-sm" />
            {user.name}
          </span>
        }
        meta={
          <>
            <AccountStatusBadge status={user.status} />
            <RoleBadge role={user.role} />
            <Badge variant={user.plan === "free" ? "muted" : "default"}>{PLAN_LABELS[user.plan]}</Badge>
            <span className="text-xs text-muted-foreground">
              {user.id} · last active {formatRelative(user.lastActive)}
            </span>
          </>
        }
        actions={<UserAdminActions user={user} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UserModuleProgress modules={user.modules} />
          <UserActivityTabs user={user} />
        </div>
        <div className="space-y-6">
          <UserProfileCard user={user} />
          <UserMinutesCard user={user} />
          {user.flags.length > 0 && (
            <div className="rounded-lg border bg-card p-5">
              <p className="mb-2 text-sm font-medium">Open flags</p>
              <UserFlags flags={user.flags} />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
