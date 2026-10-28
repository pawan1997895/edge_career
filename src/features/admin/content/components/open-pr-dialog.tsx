"use client";

import * as React from "react";
import { CircleCheck, GitPullRequest, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";

/** Opens a pull request with the edited content files (simulated). */
export function OpenPrDialog({ path, defaultTitle, dirty }: { path: string; defaultTitle: string; dirty: boolean }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(defaultTitle);
  const action = useSimulatedAction(() => ({ number: 482 }), 1400);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) action.reset();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <GitPullRequest /> Open pull request
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {action.status === "success" ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-success/12 text-success">
                <CircleCheck className="size-6" />
              </span>
              <DialogTitle className="mt-4">Pull request #{action.data?.number} opened</DialogTitle>
              <DialogDescription className="mt-1">
                Automatic checks are running on the branch. A second content reviewer must approve before it merges.
              </DialogDescription>
              <Button className="mt-6" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Open a pull request</DialogTitle>
                <DialogDescription>
                  Changes to <code className="text-xs">{path}</code> go to review on a new branch.
                  {!dirty && " You have no unsaved edits; the PR will only re-run checks."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="pr-title">Title</Label>
                  <Input id="pr-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="pr-body">Description</Label>
                  <Textarea id="pr-body" placeholder="What changed and why. Mention any new hidden tests." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!title.trim() || action.isLoading}
                  onClick={() => {
                    action.run();
                    toast({ title: "Creating branch and pull request…" });
                  }}
                >
                  {action.isLoading && <LoaderCircle className="animate-spin" />}
                  {action.isLoading ? "Opening…" : "Open pull request"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
