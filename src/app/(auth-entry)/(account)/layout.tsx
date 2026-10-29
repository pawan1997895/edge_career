import { AccountCard } from "@/features/auth/components/entry/account-card";

// Sign-in and sign-up share one card with a switcher between them.
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountCard>{children}</AccountCard>;
}
