"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function RequestChangesDialog({ onSubmit, disabled }: { onSubmit: (note: string, redraft: boolean) => void; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [redraft, setRedraft] = React.useState(true);
  const [touched, setTouched] = React.useState(false);
  const invalid = touched && !note.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Request changes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request changes</DialogTitle>
          <DialogDescription>The script goes back to the expert. Open inline comments are included automatically.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="changes-note">What needs to change?</Label>
            <Textarea
              id="changes-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={invalid}
              placeholder="e.g. Section 3 needs a worked example with numbers."
            />
            {invalid && <p className="text-xs text-destructive">Add a note so the expert knows what to fix.</p>}
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border p-3">
            <div>
              <Label htmlFor="redraft">Ask Claude for a revised draft</Label>
              <p className="mt-1 text-xs text-muted-foreground">Uses your note and the open comments as instructions.</p>
            </div>
            <Switch id="redraft" checked={redraft} onCheckedChange={setRedraft} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setTouched(true);
              if (!note.trim()) return;
              onSubmit(note.trim(), redraft);
              setOpen(false);
              setNote("");
              setTouched(false);
            }}
          >
            Send back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
