"use client";

import * as React from "react";
import { Ban, Clock, RotateCcw, ShieldUser, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { ConfirmActionDialog } from "@/features/admin/users/components/confirm-action-dialog";
import { ROLE_LABELS } from "@/features/admin/users/components/user-badges";
import type { AdminUserDetail } from "@/types/admin-ops";
import type { Role } from "@/types/user";

/** Admin actions on a user. Every action asks for confirmation and is recorded in the audit log. */
export function UserAdminActions({ user }: { user: AdminUserDetail }) {
  const { toast } = useToast();
  const [role, setRole] = React.useState<Role>(user.role);
  const [nextRole, setNextRole] = React.useState<Role>(user.role);
  const [suspended, setSuspended] = React.useState(user.status === "suspended");
  const [minutes, setMinutes] = React.useState("30");
  const [minutesReason, setMinutesReason] = React.useState("");
  const [checkpoint, setCheckpoint] = React.useState("");
  const [resetReason, setResetReason] = React.useState("");
  const [suspendReason, setSuspendReason] = React.useState("");

  const attempted = user.modules.filter((m) => m.checkpointAttempts > 0);
  const minutesValid = Number.isInteger(Number(minutes)) && Number(minutes) > 0 && Number(minutes) <= 600;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-wrap gap-2">
      <ConfirmActionDialog
        trigger={
          <Button variant="outline" size="sm">
            <ShieldUser /> Role: {ROLE_LABELS[role]}
          </Button>
        }
        title="Change role"
        description="Reviewers can work the human review queue. Admins can also edit content and override grades."
        confirmLabel="Change role"
        canConfirm={nextRole !== role}
        onConfirm={() => {
          setRole(nextRole);
          toast({ title: `${firstName} is now ${ROLE_LABELS[nextRole].toLowerCase()}`, variant: "success" });
        }}
      >
        <div className="grid gap-2">
          <Label>New role</Label>
          <Select value={nextRole} onValueChange={(v) => setNextRole(v as Role)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learner">Learner</SelectItem>
              <SelectItem value="reviewer">Reviewer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ConfirmActionDialog>

      {user.minutesCap > 0 && (
        <ConfirmActionDialog
          trigger={
            <Button variant="outline" size="sm">
              <Clock /> Grant minutes
            </Button>
          }
          title="Grant interview minutes"
          description="Extra minutes are added to the current billing cycle only and don't change the plan cap."
          confirmLabel="Grant minutes"
          canConfirm={minutesValid && minutesReason.trim().length > 0}
          onConfirm={() => {
            toast({ title: `${minutes} minutes granted`, description: `${user.name} · expires at renewal`, variant: "success" });
            setMinutesReason("");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="grant-minutes">Minutes</Label>
            <Input
              id="grant-minutes"
              type="number"
              min={1}
              max={600}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              aria-invalid={!minutesValid || undefined}
              className="w-32"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="grant-reason">Reason (shown in the audit log)</Label>
            <Textarea
              id="grant-reason"
              value={minutesReason}
              onChange={(e) => setMinutesReason(e.target.value)}
              placeholder="e.g. Interview dropped because of a LiveKit outage"
            />
          </div>
        </ConfirmActionDialog>
      )}

      {attempted.length > 0 && (
        <ConfirmActionDialog
          trigger={
            <Button variant="outline" size="sm">
              <RotateCcw /> Reset checkpoint
            </Button>
          }
          title="Reset a checkpoint attempt"
          description="The latest attempt is voided. The learner can retake it right away with a fresh randomized question set."
          confirmLabel="Reset attempt"
          canConfirm={checkpoint !== "" && resetReason.trim().length > 0}
          onConfirm={() => {
            const mod = attempted.find((m) => m.moduleId === checkpoint);
            toast({ title: "Checkpoint attempt reset", description: `${user.name} · Module ${mod?.number} checkpoint`, variant: "success" });
            setCheckpoint("");
            setResetReason("");
          }}
        >
          <div className="grid gap-2">
            <Label>Checkpoint</Label>
            <Select value={checkpoint} onValueChange={setCheckpoint}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a checkpoint" />
              </SelectTrigger>
              <SelectContent>
                {attempted.map((m) => (
                  <SelectItem key={m.moduleId} value={m.moduleId}>
                    Module {m.number} · {m.title} ({m.checkpointAttempts} attempt{m.checkpointAttempts > 1 ? "s" : ""})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reset-reason">Reason</Label>
            <Textarea
              id="reset-reason"
              value={resetReason}
              onChange={(e) => setResetReason(e.target.value)}
              placeholder="e.g. Judge outage during the attempt"
            />
          </div>
        </ConfirmActionDialog>
      )}

      {suspended ? (
        <ConfirmActionDialog
          trigger={
            <Button variant="outline" size="sm">
              <UserCheck /> Reactivate
            </Button>
          }
          title="Reactivate account"
          description={`${user.name} can sign in again and keeps all progress.`}
          confirmLabel="Reactivate"
          onConfirm={() => {
            setSuspended(false);
            toast({ title: "Account reactivated", description: user.name, variant: "success" });
          }}
        />
      ) : (
        <ConfirmActionDialog
          trigger={
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Ban /> Suspend
            </Button>
          }
          title="Suspend account"
          description={`${user.name} is signed out and can't sign in. Progress, submissions and billing are kept. Subscriptions are paused, not cancelled.`}
          confirmLabel="Suspend account"
          destructive
          canConfirm={suspendReason.trim().length > 0}
          onConfirm={() => {
            setSuspended(true);
            setSuspendReason("");
            toast({ title: "Account suspended", description: user.name });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="suspend-reason">Reason</Label>
            <Textarea
              id="suspend-reason"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="e.g. Confirmed code sharing in the Module 2 checkpoint"
            />
          </div>
        </ConfirmActionDialog>
      )}
    </div>
  );
}
