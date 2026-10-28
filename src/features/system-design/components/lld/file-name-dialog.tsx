"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Name a new file or rename an existing one. Validates the extension and duplicates. */
export function FileNameDialog({
  open,
  onOpenChange,
  mode,
  initialName,
  extension,
  existingNames,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "rename";
  initialName: string;
  extension: string;
  existingNames: string[];
  onConfirm: (name: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {/* Keyed so the form resets each time the dialog opens for a different file. */}
        {open && (
          <FileNameForm
            key={`${mode}-${initialName}`}
            mode={mode}
            initialName={initialName}
            extension={extension}
            existingNames={existingNames}
            onCancel={() => onOpenChange(false)}
            onConfirm={onConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FileNameForm({
  mode,
  initialName,
  extension,
  existingNames,
  onCancel,
  onConfirm,
}: {
  mode: "create" | "rename";
  initialName: string;
  extension: string;
  existingNames: string[];
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = React.useState(initialName);
  const [touched, setTouched] = React.useState(false);

  const trimmed = name.trim();
  const error = !trimmed
    ? "Enter a file name."
    : !/^[A-Za-z_][\w]*\.[a-z]+$/.test(trimmed)
      ? "Use letters, digits and underscores, e.g. " + (extension === ".java" ? "EvSpot.java" : "ev_spot.py") + "."
      : !trimmed.endsWith(extension)
        ? `Files in this workspace must end in ${extension}.`
        : existingNames.includes(trimmed) && trimmed !== initialName
          ? "A file with this name already exists."
          : undefined;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!error) onConfirm(trimmed);
      }}
      className="grid gap-4"
    >
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "New file" : "Rename file"}</DialogTitle>
        <DialogDescription>Hidden tests only call the classes named in the README, so you can add helper files freely.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-2">
        <Label htmlFor="file-name">File name</Label>
        <Input id="file-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && Boolean(error)} />
        {touched && error && <p className="text-[13px] text-destructive">{error}</p>}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === "create" ? "Create file" : "Rename"}</Button>
      </DialogFooter>
    </form>
  );
}
