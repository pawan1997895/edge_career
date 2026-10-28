"use client";

import * as React from "react";
import { KeyRound, LoaderCircle, Monitor, Smartphone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { SettingsRow } from "@/features/account/components/settings-row";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import type { User } from "@/types/user";

const SESSIONS = [
  { id: "s1", device: "Chrome on Windows", place: "Bengaluru · this device", icon: Monitor, current: true },
  { id: "s2", device: "Edge Career on Android", place: "Bengaluru · 2 hours ago", icon: Smartphone, current: false },
  { id: "s3", device: "Safari on macOS", place: "Pune · 6 days ago", icon: Monitor, current: false },
];

export function AccountSettings({ user }: { user: User }) {
  const { toast } = useToast();
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [sessions, setSessions] = React.useState(SESSIONS);
  const save = useSimulatedAction(() => toast({ title: "Account details saved", variant: "success" }), 800);
  const signOut = useSimulatedAction(() => {
    setSessions((list) => list.filter((s) => s.current));
    toast({ title: "Signed out of other devices", variant: "success" });
  }, 900);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>Changing your email sends a code to the new address before it takes effect.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow label="Full name" htmlFor="settings-name">
            <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
          </SettingsRow>
          <SettingsRow label="Email" description="Used for one-time sign-in codes and receipts." htmlFor="settings-email">
            <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </SettingsRow>
        </CardContent>
        <CardFooter className="justify-end">
          <Button disabled={save.isLoading} onClick={save.run}>
            {save.isLoading && <LoaderCircle className="animate-spin" />}
            Save changes
          </Button>
        </CardFooter>
      </Card>

      <Alert variant="info">
        <KeyRound />
        <AlertTitle>No password to manage</AlertTitle>
        <AlertDescription>
          Edge Career signs you in with a one-time email code, Google or GitHub, so there is no password to reset or leak.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Signed-in devices</CardTitle>
          <CardDescription>Sign out anywhere you don’t recognise.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <s.icon className="size-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-[13px] text-muted-foreground">{s.place}</p>
                </div>
                {s.current && <span className="text-xs text-success">Current</span>}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            variant="outline"
            disabled={signOut.isLoading || sessions.length === 1}
            onClick={signOut.run}
          >
            {signOut.isLoading && <LoaderCircle className="animate-spin" />}
            Sign out of other devices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
