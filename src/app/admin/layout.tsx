import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/data/user";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · Edge Career" } };

// Admin console: content management, human review, grading accuracy and operations.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <AppShell variant="admin" user={user}>
      {children}
    </AppShell>
  );
}
