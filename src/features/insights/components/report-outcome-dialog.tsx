"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { TARGET_COMPANY_OPTIONS } from "@/mocks/user";
import { INTERVIEW_ROUNDS, OUTCOME_LABELS, type InterviewOutcome, type OutcomeResult } from "@/types/insights";

const ROLE_LEVELS = ["SDE 1", "SDE 2", "SDE 3 / Senior", "Staff"];
const RESULTS: OutcomeResult[] = ["offer", "rejected", "awaiting", "withdrew"];

interface FormState {
  company: string;
  roleLevel: string;
  roundReached: string;
  result: OutcomeResult;
  offerCtc: string;
  date: string;
}

const EMPTY: FormState = { company: "", roleLevel: "", roundReached: "", result: "awaiting", offerCtc: "", date: "2026-10-27" };

/** Form for reporting a real interview result. Used later to calibrate readiness estimates. */
export function ReportOutcomeDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (outcome: InterviewOutcome) => void;
}) {
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [showErrors, setShowErrors] = React.useState(false);
  const save = useSimulatedAction(() => {
    const ctc = Number(form.offerCtc);
    onSaved({
      id: `out-${Date.now()}`,
      company: form.company,
      roleLevel: form.roleLevel,
      roundReached: form.result === "offer" ? "Offer" : form.roundReached,
      result: form.result,
      offerCtcLpa: form.result === "offer" && ctc > 0 ? ctc : undefined,
      date: form.date,
    });
    setForm(EMPTY);
    setShowErrors(false);
    onOpenChange(false);
    return true;
  }, 900);

  const missing = {
    company: !form.company,
    roleLevel: !form.roleLevel,
    roundReached: form.result !== "offer" && !form.roundReached,
  };
  const valid = !missing.company && !missing.roleLevel && !missing.roundReached;
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Report an interview outcome</DialogTitle>
          <DialogDescription>
            Real results help us calibrate readiness estimates. Reports are used in aggregate and never shown with your name.
          </DialogDescription>
        </DialogHeader>

        <form
          id="report-outcome"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) {
              setShowErrors(true);
              return;
            }
            save.run();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" error={showErrors && missing.company ? "Choose a company" : undefined}>
              <Select value={form.company} onValueChange={(v) => set("company", v)}>
                <SelectTrigger className="w-full" aria-invalid={showErrors && missing.company}>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_COMPANY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Role level" error={showErrors && missing.roleLevel ? "Choose a level" : undefined}>
              <Select value={form.roleLevel} onValueChange={(v) => set("roleLevel", v)}>
                <SelectTrigger className="w-full" aria-invalid={showErrors && missing.roleLevel}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-2">
            <Label>Result</Label>
            <RadioGroup value={form.result} onValueChange={(v) => set("result", v as OutcomeResult)} className="grid-cols-2 gap-2">
              {RESULTS.map((r) => (
                <RadioCard key={r} value={r} title={OUTCOME_LABELS[r]} className="p-3" />
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {form.result === "offer" ? (
              <Field label="Offer CTC (₹ LPA, optional)">
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="e.g. 42"
                  value={form.offerCtc}
                  onChange={(e) => set("offerCtc", e.target.value)}
                />
              </Field>
            ) : (
              <Field label="Furthest round reached" error={showErrors && missing.roundReached ? "Choose a round" : undefined}>
                <Select value={form.roundReached} onValueChange={(v) => set("roundReached", v)}>
                  <SelectTrigger className="w-full" aria-invalid={showErrors && missing.roundReached}>
                    <SelectValue placeholder="Select round" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_ROUNDS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field label="Date of last round">
              <Input type="date" value={form.date} max="2026-10-27" onChange={(e) => set("date", e.target.value)} />
            </Field>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={save.isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="report-outcome" disabled={save.isLoading}>
            {save.isLoading && <LoaderCircle className="animate-spin" />}
            Save outcome
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
