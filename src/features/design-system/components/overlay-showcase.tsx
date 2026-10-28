"use client";

import { Bell, Ellipsis, Pencil, Trash } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { DsSection, Specimen } from "@/features/design-system/components/ds-section";

export function OverlayShowcase() {
  const { toast } = useToast();
  return (
    <DsSection id="overlays" title="Dialogs, sheets and feedback" description="Dialogs confirm decisions; sheets hold side content and mobile navigation; toasts confirm actions.">
      <Specimen label="Overlays">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit your exam?</DialogTitle>
              <DialogDescription>You answered 14 of 15 questions. You can’t change answers after submitting.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Keep working</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Sheets slide in from an edge.</SheetDescription>
            </SheetHeader>
            <p className="px-4 text-sm text-muted-foreground">Content goes here.</p>
          </SheetContent>
        </Sheet>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Bell /> Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-sm">Popovers hold small, non-blocking content like notifications.</PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More actions">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip content="Tooltips explain icon-only buttons">
          <Button variant="ghost">Hover for tooltip</Button>
        </Tooltip>
      </Specimen>

      <Specimen label="Toasts">
        <Button variant="outline" onClick={() => toast({ title: "Draft saved", variant: "success" })}>
          Success toast
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Submission queued", description: "Results in a few seconds." })}>
          Info toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast({ title: "Couldn’t reach the judge", description: "Try again in a moment.", variant: "error" })}
        >
          Error toast
        </Button>
      </Specimen>
    </DsSection>
  );
}
