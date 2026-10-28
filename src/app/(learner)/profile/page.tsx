import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getConnectedAccounts, getProfileStats, getTargetCompanyOptions } from "@/data/account";
import { getSubscription } from "@/data/billing";
import { getActiveModule } from "@/data/curriculum";
import { getCurrentUser } from "@/data/user";
import { EditProfileDialog } from "@/features/account/components/edit-profile-dialog";
import { ProfileOverview } from "@/features/account/components/profile-overview";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [user, stats, accounts, activeModule, companyOptions, subscription] = await Promise.all([
    getCurrentUser(),
    getProfileStats(),
    getConnectedAccounts(),
    getActiveModule(),
    getTargetCompanyOptions(),
    getSubscription(),
  ]);
  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        description="Your background and goals. These shape your learning path and readiness estimates."
        actions={<EditProfileDialog user={user} companyOptions={companyOptions} />}
      />
      <ProfileOverview
        user={user}
        stats={stats}
        accounts={accounts}
        activeModule={activeModule}
        renewsAt={subscription.renewsAt}
      />
    </PageContainer>
  );
}
