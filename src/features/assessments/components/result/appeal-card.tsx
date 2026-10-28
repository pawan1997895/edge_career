"use client";

import * as React from "react";
import { CircleCheck, LoaderCircle, MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";

const REASONS = [
  { value: "grading", label: "A question was graded incorrectly" },
  { value: "hidden_test", label: "A hidden test verdict looks wrong" },
  { value: "integrity", label: "An integrity event needs context" },
  { value: "technical", label: "A technical problem during the exam" },
];

/** "Request a review" entry point on the result page, with its dialog and submitted state. */
export function AppealCard({ questionCount, alreadyInReview }: { questionCount: number; alreadyInReview: boolean }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("grading");
  const [question, setQuestion] = React.useState("any");
  const [details, setDetails] = React.useState("");
  const [acknowledged, setAcknowledged] = React.useState(false);
  const submit = useSimulatedAction(() => "AP-2291", 1200);

  const canSubmit = details.trim().length >= 20 && acknowledged && !submit.isLoading;

  function send() {
    submit.run();
  }

  React.useEffect(() => {
    if (submit.status === "success") {
      toast({ title: "Review requested", description: `Reference ${submit.data}. A reviewer will reply within 48 hours.`, variant: "success" });
    }
  }, [submit.status, submit.data, toast]);

  if (submit.status === "success") {
    return (
      <Card className="gap-2 border-success/30 bg-success/5 p-5">
        <p className="flex items-center gap-2 font-semibold">
          <CircleCheck className="size-4 text-success" /> Review requested
        </p>
        <p className="text-[13px] text-muted-foreground">
          Reference {submit.data}. A reviewer will look at your answers and reply within 48 hours. You&apos;ll get a notification and an
          email. Track it under Assessments → Reviews and appeals.
        </p>
      </Card>
    );
  }

  return (
    <Card className="gap-3 p-5">
      <p className="flex items-center gap-2 font-semibold">
        <MessageSquareWarning className="size-4 text-muted-foreground" /> Think something was graded wrong?
      </p>
      <p className="text-[13px] text-muted-foreground">
        {alreadyInReview
          ? "This result is already with a reviewer. You can still add context for them."
          : "Ask for a human review. A reviewer sees your answers, the AI's reasoning and the integrity log."}
      </p>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {alreadyInReview ? "Add context for the reviewer" : "Request a review"}
      </Button>

      <Dialog open={open} onOpenChange={(next) => !submit.isLoading && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a human review</DialogTitle>
            <DialogDescription>Explain what you think is wrong. Specific details get faster answers.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="appeal-reason">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="appeal-reason" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="appeal-question">Question</Label>
                <Select value={question} onValueChange={setQuestion}>
                  <SelectTrigger id="appeal-question" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Whole exam</SelectItem>
                    {Array.from({ length: questionCount }, (_, i) => (
                      <SelectItem key={i} value={`q${i + 1}`}>
                        Question {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="appeal-details">Details</Label>
              <Textarea
                id="appeal-details"
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. My HLD answer covers replication in the second paragraph, but the feedback says it's missing."
              />
              <p className="text-xs text-muted-foreground">At least 20 characters. {details.trim().length}/20</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox id="appeal-ack" checked={acknowledged} onCheckedChange={(v) => setAcknowledged(v === true)} className="mt-0.5" />
              <Label htmlFor="appeal-ack" className="text-[13px] leading-snug font-normal">
                I understand the reviewer may raise or lower my score, and their decision is final for this attempt.
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submit.isLoading}>
              Cancel
            </Button>
            <Button onClick={send} disabled={!canSubmit}>
              {submit.isLoading && <LoaderCircle className="animate-spin" />}
              {submit.isLoading ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
