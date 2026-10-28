"use client";

import * as React from "react";
import { CircleCheck, Flag, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSimulatedAction } from "@/hooks/use-simulated-action";

const REASONS = [
  { value: "ai_feedback", label: "The AI rubric misread my code" },
  { value: "tests", label: "A hidden test marked a correct answer wrong" },
  { value: "complexity", label: "The complexity estimate is wrong" },
  { value: "other", label: "Something else" },
];

/** Lets the learner ask a human to re-check a grade. Simulated: nothing is sent. */
export function AppealDialog({ submissionId, alreadyInReview = false }: { submissionId: string; alreadyInReview?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [details, setDetails] = React.useState("");
  const appeal = useSimulatedAction(() => ({ ticket: `AP-${submissionId.replace("sub-", "")}` }), 1100);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      appeal.reset();
      setReason("");
      setDetails("");
    }
  }

  const canSubmit = reason !== "" && details.trim().length >= 20 && !appeal.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={alreadyInReview}>
          <Flag /> {alreadyInReview ? "Already in review" : "Appeal this grade"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {appeal.status === "success" ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-success/12 text-success">
              <CircleCheck className="size-6" />
            </span>
            <DialogTitle className="mt-4">Appeal submitted</DialogTitle>
            <DialogDescription className="mt-1 max-w-sm">
              Ticket {appeal.data?.ticket}. A reviewer will re-check the tests and rubric and reply within 48 hours. Your current score
              stays visible until then.
            </DialogDescription>
            <DialogClose asChild>
              <Button className="mt-6">Done</Button>
            </DialogClose>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Appeal this grade</DialogTitle>
              <DialogDescription>A human reviewer checks the hidden tests and AI rubric again. Appeals never lower your score.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="appeal-reason">What looks wrong?</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="appeal-reason" className="w-full">
                    <SelectValue placeholder="Choose a reason" />
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
              <div className="grid gap-2">
                <Label htmlFor="appeal-details">Explain briefly</Label>
                <Textarea
                  id="appeal-details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. The rubric says I don't handle empty input, but line 3 returns 0 for an empty string."
                />
                <p className="text-xs text-muted-foreground">At least 20 characters. Point to line numbers where you can.</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={appeal.run} disabled={!canSubmit}>
                {appeal.isLoading && <LoaderCircle className="animate-spin" />}
                {appeal.isLoading ? "Submitting…" : "Submit appeal"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
