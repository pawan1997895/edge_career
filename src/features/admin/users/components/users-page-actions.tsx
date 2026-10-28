"use client";

import * as React from "react";
import { Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { ConfirmActionDialog } from "@/features/admin/users/components/confirm-action-dialog";

export function UsersPageActions() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("reviewer");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <>
      <Button variant="outline" onClick={() => toast({ title: "Export started", description: "users-2026-10-27.csv will download when ready." })}>
        <Download /> Export CSV
      </Button>
      <ConfirmActionDialog
        trigger={
          <Button>
            <UserPlus /> Invite user
          </Button>
        }
        title="Invite a user"
        description="They get an email with a one-time sign-in code."
        confirmLabel="Send invite"
        canConfirm={validEmail}
        onConfirm={() => {
          toast({ title: "Invite sent", description: email, variant: "success" });
          setEmail("");
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            aria-invalid={(email.length > 0 && !validEmail) || undefined}
          />
        </div>
        <div className="grid gap-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learner">Learner</SelectItem>
              <SelectItem value="reviewer">Reviewer (human review queue)</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ConfirmActionDialog>
    </>
  );
}
