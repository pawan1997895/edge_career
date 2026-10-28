"use client";

import * as React from "react";
import { Download, LoaderCircle, ShieldCheck, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { SettingsRow } from "@/features/account/components/settings-row";
import { useSimulatedAction } from "@/hooks/use-simulated-action";

const CONFIRM_WORD = "DELETE";

export function PrivacySettings() {
  const { toast } = useToast();
  const [shareOutcomes, setShareOutcomes] = React.useState(true);
  const [transcripts, setTranscripts] = React.useState(true);
  const exportData = useSimulatedAction(
    () =>
      toast({
        title: "Export requested",
        description: "We’ll email a download link within 24 hours.",
        variant: "success",
      }),
    1200,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data and privacy</CardTitle>
          <CardDescription>Control how your learning data is used.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingsRow
            label="Use my interview outcomes to improve readiness estimates"
            description="Anonymised results help calibrate company and salary readiness for everyone."
          >
            <div className="flex sm:justify-end">
              <Switch checked={shareOutcomes} onCheckedChange={setShareOutcomes} aria-label="Share interview outcomes" />
            </div>
          </SettingsRow>
          <SettingsRow label="Keep mock interview recordings" description="Transcripts are always kept; audio is deleted after 30 days if off.">
            <div className="flex sm:justify-end">
              <Switch checked={transcripts} onCheckedChange={setTranscripts} aria-label="Keep interview recordings" />
            </div>
          </SettingsRow>
          <SettingsRow label="Download my data" description="Profile, submissions, transcripts and grades as a ZIP.">
            <Button variant="outline" onClick={exportData.run} disabled={exportData.isLoading}>
              {exportData.isLoading ? <LoaderCircle className="animate-spin" /> : <Download />}
              {exportData.isLoading ? "Preparing…" : "Request export"}
            </Button>
          </SettingsRow>
        </CardContent>
      </Card>

      <Alert>
        <ShieldCheck />
        <AlertTitle>Exam integrity logging</AlertTitle>
        <AlertDescription>
          During checkpoint exams and the placement test we log pastes and tab switches and check code similarity. This can’t be
          turned off, and the logs are only visible to you and reviewers.
        </AlertDescription>
      </Alert>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            Permanently removes your profile, progress, submissions and interview history. Your active subscription is cancelled
            without a refund for the current cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteAccountDialog() {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setConfirm("");
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash /> Delete my account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This can’t be undone. Download your data first if you want to keep a copy.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-delete">
            Type <span className="font-mono">{CONFIRM_WORD}</span> to confirm
          </Label>
          <Input id="confirm-delete" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={confirm !== CONFIRM_WORD}
            onClick={() => {
              setOpen(false);
              setConfirm("");
              toast({ title: "Account deletion scheduled", description: "Demo only: nothing was deleted.", variant: "error" });
            }}
          >
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
