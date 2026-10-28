import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import {
  getConnectedAccounts,
  getInterviewVoices,
  getLearningPreferences,
  getNotificationSettings,
} from "@/data/account";
import { getCurrentUser } from "@/data/user";
import { SettingsTabs } from "@/features/account/components/settings-tabs";
import { isSettingsTab } from "@/features/account/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const [user, preferences, voices, notifications, accounts] = await Promise.all([
    getCurrentUser(),
    getLearningPreferences(),
    getInterviewVoices(),
    getNotificationSettings(),
    getConnectedAccounts(),
  ]);
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account, learning preferences, notifications and privacy." />
      <SettingsTabs
        defaultTab={isSettingsTab(tab) ? tab : "account"}
        user={user}
        preferences={preferences}
        voices={voices}
        notifications={notifications}
        accounts={accounts}
      />
    </PageContainer>
  );
}
