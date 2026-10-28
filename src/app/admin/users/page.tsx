import type { Metadata } from "next";
import { Flag, UserCheck, Users, Wallet } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { UsersPageActions } from "@/features/admin/users/components/users-page-actions";
import { UsersTable } from "@/features/admin/users/components/users-table";
import { getCoreModules } from "@/data/curriculum";
import { getAdminUsers } from "@/data/admin-ops";
import { formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const [users, coreModules] = await Promise.all([getAdminUsers(), getCoreModules()]);
  const flagged = users.filter((u) => u.flags.some((f) => f === "similarity" || f === "integrity")).length;
  const moduleOptions = coreModules.map((m) => ({ id: m.id, label: `M${m.number} · ${m.title}` }));

  return (
    <PageContainer wide>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: routes.admin.overview }, { label: "People" }, { label: "Users" }]}
        title="Users"
        description="Learners, reviewers and admins. Open a user to see their progress, billing and integrity history."
        actions={<UsersPageActions />}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active learners (30 days)" value={formatNumber(7570)} icon={Users} trend={{ value: "+6.2%", positive: true }} hint="vs last month" />
        <StatCard label="Paying learners" value={formatNumber(2750)} icon={Wallet} hint="Pro and Pro Plus" />
        <StatCard label="Reviewers and admins" value={users.filter((u) => u.role !== "learner").length} icon={UserCheck} hint="Staff accounts" />
        <StatCard label="Flagged for integrity" value={flagged} icon={Flag} hint="Similarity or exam events" />
      </div>
      <UsersTable users={users} modules={moduleOptions} />
    </PageContainer>
  );
}
