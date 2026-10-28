"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";
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
import { useSimulatedAction } from "@/hooks/use-simulated-action";

/**
 * Confirmation dialog for admin actions. The confirm button shows a short
 * simulated request, then calls `onConfirm` and closes.
 */
export function ConfirmActionDialog({
  trigger,
  title,
  description,
  confirmLabel,
  destructive = false,
  canConfirm = true,
  onConfirm,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  canConfirm?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const action = useSimulatedAction(() => {
    onConfirm();
    setOpen(false);
  }, 800);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) action.reset();
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="grid gap-4">{children}</div>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant={destructive ? "destructive" : "default"} disabled={!canConfirm || action.isLoading} onClick={action.run}>
            {action.isLoading && <LoaderCircle className="animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
