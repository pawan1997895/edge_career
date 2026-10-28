"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { GitHubIcon, GoogleIcon } from "@/components/shared/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { ConnectedAccount, Provider } from "@/types/account";

const PROVIDERS: Record<Provider, { name: string; icon: React.ReactNode; purpose: string }> = {
  google: {
    name: "Google",
    icon: <GoogleIcon className="size-5" />,
    purpose: "Sign in with your Google account.",
  },
  github: {
    name: "GitHub",
    icon: <GitHubIcon className="size-5" />,
    purpose: "Sign in, and let Module 5 run tests on your project repositories.",
  },
};

/** Google and GitHub connections with simulated connect/disconnect. */
export function ConnectedAccounts({ accounts }: { accounts: ConnectedAccount[] }) {
  const { toast } = useToast();
  const [state, setState] = React.useState(accounts);
  const [pending, setPending] = React.useState<Provider | null>(null);
  const [confirming, setConfirming] = React.useState<Provider | null>(null);

  function setConnected(provider: Provider, connected: boolean) {
    setPending(provider);
    setTimeout(() => {
      setState((list) =>
        list.map((a) =>
          a.provider === provider
            ? {
                ...a,
                connected,
                handle: connected ? (provider === "github" ? "aarav-codes" : "aarav.mehta@example.com") : undefined,
                connectedAt: connected ? "2026-10-27T18:30:00+05:30" : undefined,
              }
            : a,
        ),
      );
      setPending(null);
      toast({ title: `${PROVIDERS[provider].name} ${connected ? "connected" : "disconnected"}`, variant: "success" });
    }, 900);
  }

  return (
    <>
      <ul className="divide-y">
        {state.map((account) => {
          const meta = PROVIDERS[account.provider];
          return (
            <li key={account.provider} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">{meta.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{meta.name}</p>
                  {account.connected ? <Badge variant="success">Connected</Badge> : <Badge variant="muted">Not connected</Badge>}
                </div>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {account.connected && account.handle
                    ? `${account.handle}${account.connectedAt ? ` · since ${formatDate(account.connectedAt)}` : ""}`
                    : meta.purpose}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={pending === account.provider}
                onClick={() => (account.connected ? setConfirming(account.provider) : setConnected(account.provider, true))}
              >
                {pending === account.provider && <LoaderCircle className="animate-spin" />}
                {account.connected ? "Disconnect" : "Connect"}
              </Button>
            </li>
          );
        })}
      </ul>

      <Dialog open={confirming !== null} onOpenChange={(open) => !open && setConfirming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {confirming ? PROVIDERS[confirming].name : ""}?</DialogTitle>
            <DialogDescription>
              {confirming === "github"
                ? "Module 5 projects need GitHub to run tests on your repositories. You can reconnect at any time, but project checks will pause until you do."
                : "You’ll still be able to sign in with an email code or GitHub."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(null)}>
              Keep connected
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirming) setConnected(confirming, false);
                setConfirming(null);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
