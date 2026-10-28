"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountSettings } from "@/features/account/components/account-settings";
import { ConnectedAccounts } from "@/features/account/components/connected-accounts";
import { LearningPreferencesForm } from "@/features/account/components/learning-preferences-form";
import { NotificationSettings } from "@/features/account/components/notification-settings";
import { PrivacySettings } from "@/features/account/components/privacy-settings";
import type { SettingsTab } from "@/features/account/settings";
import type { ConnectedAccount, LearningPreferences, NotificationSetting } from "@/types/account";
import type { User } from "@/types/user";

export function SettingsTabs({
  defaultTab,
  user,
  preferences,
  voices,
  notifications,
  accounts,
}: {
  defaultTab: SettingsTab;
  user: User;
  preferences: LearningPreferences;
  voices: { value: string; label: string }[];
  notifications: NotificationSetting[];
  accounts: ConnectedAccount[];
}) {
  return (
    <Tabs defaultValue={defaultTab} className="gap-6">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="learning">Learning preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="connections">Connected accounts</TabsTrigger>
        <TabsTrigger value="privacy">Privacy & data</TabsTrigger>
      </TabsList>
      <div className="max-w-3xl">
        <TabsContent value="account">
          <AccountSettings user={user} />
        </TabsContent>
        <TabsContent value="learning">
          <LearningPreferencesForm initial={preferences} voices={voices} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings initial={notifications} />
        </TabsContent>
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Connected accounts</CardTitle>
              <CardDescription>Sign-in methods and the GitHub access used by Module 5 projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectedAccounts accounts={accounts} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>
      </div>
    </Tabs>
  );
}
