"use client";

import { CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import type { ItemStatus } from "@/types/curriculum";

export function MarkCompleteButton({ initialStatus }: { initialStatus: ItemStatus }) {
  const { toast } = useToast();
  const { status, run } = useSimulatedAction(() => {
    toast({ title: "Lesson marked complete", description: "Your module progress has been updated.", variant: "success" });
    return true;
  }, 700);

  if (initialStatus === "passed" || status === "success") {
    return (
      <Button variant="outline" disabled className="disabled:opacity-100">
        <CircleCheck className="text-success" /> Completed
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={run} disabled={status === "loading"}>
      {status === "loading" ? <LoaderCircle className="animate-spin" /> : <CircleCheck />}
      Mark as complete
    </Button>
  );
}
