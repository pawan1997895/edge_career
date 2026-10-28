"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

/** Share and download for a scorecard. Demo only: both just confirm with a toast. */
export function ScorecardActions() {
  const { toast } = useToast();
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast({ title: "Share link copied", description: "Anyone with the link can view this scorecard.", variant: "success" })}
      >
        <Share2 /> Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast({ title: "Preparing PDF", description: "Your scorecard and transcript will download shortly." })}
      >
        <Download /> Download PDF
      </Button>
    </>
  );
}
