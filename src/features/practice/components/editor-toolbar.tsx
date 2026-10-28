"use client";

import * as React from "react";
import { FlaskConical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import type { Language } from "@/types/practice";
import { LANGUAGE_LABELS, VERDICT_LABELS } from "@/types/practice";
import type { DemoVerdict } from "@/types/submissions";

/** Language picker, reset-to-starter and the demo verdict switch above the editor. */
export function EditorToolbar({
  languages,
  language,
  onLanguageChange,
  onReset,
  demoVerdict,
  demoVerdicts,
  onDemoVerdictChange,
}: {
  languages: Language[];
  language: Language;
  onLanguageChange: (language: Language) => void;
  onReset: () => void;
  demoVerdict: DemoVerdict;
  demoVerdicts: DemoVerdict[];
  onDemoVerdictChange: (verdict: DemoVerdict) => void;
}) {
  const [confirmReset, setConfirmReset] = React.useState(false);

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b bg-card px-3">
      <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)} disabled={languages.length === 1}>
        <SelectTrigger size="sm" className="w-36 sm:w-44" aria-label="Language">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((l) => (
            <SelectItem key={l} value={l}>
              {LANGUAGE_LABELS[l]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tooltip content="Reset to starter code">
        <Button variant="ghost" size="icon-sm" onClick={() => setConfirmReset(true)} aria-label="Reset to starter code">
          <RotateCcw />
        </Button>
      </Tooltip>

      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip content="Review aid: choose which judge result Run and Submit show. Not part of the product.">
          <FlaskConical className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
        </Tooltip>
        <Select value={demoVerdict} onValueChange={(v) => onDemoVerdictChange(v as DemoVerdict)}>
          <SelectTrigger size="sm" className="w-40 border-dashed sm:w-52" aria-label="Demo verdict">
            <span className="hidden text-muted-foreground sm:inline">Demo:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {demoVerdicts.map((v) => (
              <SelectItem key={v} value={v}>
                {v === "runtime_error" && language === "sql" ? "SQL error" : VERDICT_LABELS[v]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset to starter code?</DialogTitle>
            <DialogDescription>Your {LANGUAGE_LABELS[language]} changes will be replaced by the starter template. Other languages keep their code.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
            >
              Reset code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
