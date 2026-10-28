"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import type { NotificationSetting } from "@/types/account";

export function NotificationSettings({ initial }: { initial: NotificationSetting[] }) {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState(initial);

  function toggle(id: string, channel: "email" | "inApp", value: boolean) {
    setSettings((list) => list.map((s) => (s.id === id ? { ...s, [channel]: value } : s)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what reaches your inbox and what stays in the app.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden grid-cols-[1fr_5rem_5rem] border-y bg-muted/40 px-5 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>Category</span>
          <span className="text-center">Email</span>
          <span className="text-center">In app</span>
        </div>
        <ul className="divide-y">
          {settings.map((s) => (
            <li key={s.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_5rem_5rem] sm:items-center">
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-[13px] text-muted-foreground">{s.description}</p>
              </div>
              <label className="flex items-center gap-2 text-[13px] sm:justify-center">
                <Switch checked={s.email} onCheckedChange={(v) => toggle(s.id, "email", v)} aria-label={`${s.label} by email`} />
                <span className="sm:hidden">Email</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] sm:justify-center">
                <Switch checked={s.inApp} onCheckedChange={(v) => toggle(s.id, "inApp", v)} aria-label={`${s.label} in app`} />
                <span className="sm:hidden">In app</span>
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={() => toast({ title: "Notification settings saved", variant: "success" })}>Save</Button>
      </CardFooter>
    </Card>
  );
}
