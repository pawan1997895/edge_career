"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, PhoneOff } from "lucide-react";
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
import { routes } from "@/lib/routes";

// Every demo session opens the same sample scorecard.
const DEMO_SCORECARD_ID = "iv-2041";

export function EndInterviewDialog({ elapsedSec, finished }: { elapsedSec: number; finished: boolean }) {
  const router = useRouter();
  const generate = useSimulatedAction(() => DEMO_SCORECARD_ID, 1600);
  const { status, data } = generate;
  const minutesUsed = Math.max(1, Math.ceil(elapsedSec / 60));

  React.useEffect(() => {
    if (status === "success" && data) router.push(routes.interviewScorecard(data));
  }, [status, data, router]);

  const busy = generate.isLoading || status === "success";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant={finished ? "default" : "destructive"}>
          <PhoneOff /> <span className="hidden sm:inline">{finished ? "End and get scorecard" : "End interview"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent showClose={!busy} onInteractOutside={(e) => busy && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{finished ? "Finish the interview?" : "End the interview early?"}</DialogTitle>
          <DialogDescription>
            {finished
              ? "The interviewer has wrapped up. Your scorecard will be ready in about a minute."
              : "The interview isn't finished yet. You'll still get a scorecard for the stages you completed."}
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
          <span className="font-medium tabular-nums">{minutesUsed} min</span> will be deducted from your plan.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={busy}>
              Keep going
            </Button>
          </DialogClose>
          <Button onClick={generate.run} disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle className="animate-spin" /> Generating scorecard…
              </>
            ) : (
              "End interview"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
