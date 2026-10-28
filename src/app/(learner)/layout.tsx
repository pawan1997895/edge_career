import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/data/user";

// Learner app: every page here gets the sidebar and top bar.
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <AppShell variant="learner" user={user}>
      {children}
    </AppShell>
  );
}
