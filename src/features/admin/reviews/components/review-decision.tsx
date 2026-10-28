"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheck, LoaderCircle, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { DEMO_NOW, formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { AuditEntry, ReviewDetail } from "@/types/admin-content";

const REVIEWER = "Kavya Iyer";

/** Manual grading: confirm the AI score or override it with a reason. Includes the audit trail. */
export function ReviewDecision({ review }: { review: ReviewDetail }) {
  const { toast } = useToast();
  const [mode, setMode] = React.useState<"confirm" | "override">(review.reason === "appeal" || review.reason === "integrity_flag" ? "override" : "confirm");
  const [score, setScore] = React.useState(String(review.aiScore));
  const [decision, setDecision] = React.useState<"pass" | "fail">(review.aiScore >= review.passScore ? "pass" : "fail");
  const [reason, setReason] = React.useState("");
  const [notify, setNotify] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [audit, setAudit] = React.useState<AuditEntry[]>(review.audit);

  const numericScore = Number(score);
  const scoreInvalid = mode === "override" && (score.trim() === "" || !Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100);
  const reasonInvalid = mode === "override" && !reason.trim();
  const finalScore = mode === "confirm" ? review.aiScore : numericScore;
  const finalDecision = mode === "confirm" ? (review.aiScore >= review.passScore ? "pass" : "fail") : decision;

  const resolve = useSimulatedAction(() => ({ finalScore, finalDecision }), 1200);
  const resolved = review.status === "resolved" || resolve.status === "success";

  // Record the decision in the audit trail once the simulated save finishes.
  const [logged, setLogged] = React.useState(false);
  if (resolve.status === "success" && resolve.data && !logged) {
    setLogged(true);
    setAudit((list) => [
      ...list,
      {
        at: DEMO_NOW,
        actor: REVIEWER,
        action:
          mode === "confirm"
            ? `Confirmed AI score ${resolve.data!.finalScore}`
            : `Overrode score ${review.aiScore} → ${resolve.data!.finalScore} (${resolve.data!.finalDecision === "pass" ? "pass" : "not passed"}): ${reason.trim()}`,
      },
      ...(notify ? [{ at: DEMO_NOW, actor: "System", action: "Learner notified by email and in-app" }] : []),
    ]);
  }

  function submit() {
    setSubmitted(true);
    if (scoreInvalid || reasonInvalid) return;
    resolve.run();
    toast({ title: "Saving decision…" });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Decision</CardTitle>
          <CardDescription>The final score is what locks or unlocks the learner&apos;s progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {resolved ? (
            <Alert variant="success">
              <CircleCheck />
              <AlertTitle>Resolved</AlertTitle>
              <AlertDescription>
                {resolve.data
                  ? `Final score ${resolve.data.finalScore}: ${resolve.data.finalDecision === "pass" ? "passed" : "not passed"}.${notify ? " The learner has been notified." : ""}`
                  : `Resolved by ${review.assignee ?? "a reviewer"}. See the audit trail below.`}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={routes.admin.reviews}>Back to queue</Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="gap-2">
                <label className={cn("flex cursor-pointer items-start gap-3 rounded-md border p-3", mode === "confirm" && "border-primary bg-accent/60")}>
                  <RadioGroupItem value="confirm" className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">Confirm AI score ({review.aiScore})</span>
                    <span className="block text-xs text-muted-foreground">
                      {review.aiScore >= review.passScore ? "Counts as a pass" : `Below the ${review.passScore}% bar: not passed`}
                    </span>
                  </span>
                </label>
                <label className={cn("flex cursor-pointer items-start gap-3 rounded-md border p-3", mode === "override" && "border-primary bg-accent/60")}>
                  <RadioGroupItem value="override" className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">Override</span>
                    <span className="block text-xs text-muted-foreground">Set a new score with a written reason</span>
                  </span>
                </label>
              </RadioGroup>

              {mode === "override" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="new-score">New score</Label>
                      <Input
                        id="new-score"
                        type="number"
                        min={0}
                        max={100}
                        value={score}
                        onChange={(e) => {
                          setScore(e.target.value);
                          const n = Number(e.target.value);
                          if (Number.isFinite(n)) setDecision(n >= review.passScore ? "pass" : "fail");
                        }}
                        aria-invalid={submitted && scoreInvalid}
                        className="tabular-nums"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Outcome</Label>
                      <RadioGroup value={decision} onValueChange={(v) => setDecision(v as "pass" | "fail")} className="flex h-9 items-center gap-4">
                        <label className="flex items-center gap-1.5 text-sm">
                          <RadioGroupItem value="pass" /> Pass
                        </label>
                        <label className="flex items-center gap-1.5 text-sm">
                          <RadioGroupItem value="fail" /> Fail
                        </label>
                      </RadioGroup>
                    </div>
                  </div>
                  {submitted && scoreInvalid && <p className="text-xs text-destructive">Enter a score from 0 to 100.</p>}
                  {!scoreInvalid && (numericScore >= review.passScore) !== (decision === "pass") && (
                    <p className="text-xs text-warning-foreground dark:text-warning">
                      The outcome doesn&apos;t match the {review.passScore}% bar. Explain why in the reason.
                    </p>
                  )}
                  <div className="grid gap-1.5">
                    <Label htmlFor="override-reason">Reason (shown to the learner)</Label>
                    <Textarea
                      id="override-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      aria-invalid={submitted && reasonInvalid}
                      placeholder="e.g. Rows match the reference; the checker compared row order, which the problem does not require."
                    />
                    {submitted && reasonInvalid && <p className="text-xs text-destructive">A reason is required for every override.</p>}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="notify">Notify learner</Label>
                <Switch id="notify" checked={notify} onCheckedChange={setNotify} />
              </div>

              <Button className="w-full" onClick={submit} disabled={resolve.isLoading}>
                {resolve.isLoading && <LoaderCircle className="animate-spin" />}
                {resolve.isLoading ? "Saving…" : mode === "confirm" ? "Confirm and resolve" : "Override and resolve"}
              </Button>
              {review.reason === "integrity_flag" && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={routes.admin.integrity}>
                    <ShieldAlert /> Escalate to integrity review
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-4 border-l pl-4">
            {audit.map((entry, i) => (
              <li key={i} className="relative">
                <span className="absolute top-1.5 -left-[1.3rem] size-2 rounded-full bg-muted-foreground/50 ring-4 ring-card" />
                <p className="text-[13px] leading-snug">
                  <span className="font-medium">{entry.actor}</span> · {entry.action}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(entry.at)}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
