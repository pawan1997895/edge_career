"use client";

import * as React from "react";
import Link from "next/link";
import { CirclePlay, Laptop, Timer, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ExamDetail } from "@/types/assessments";

/** Final check before starting: the learner must accept the integrity rules. */
export function StartExamCard({ exam }: { exam: ExamDetail }) {
  const [agreed, setAgreed] = React.useState(false);
  const isRetake = exam.attempts.length > 0;

  return (
    <Card className="gap-4 p-5">
      <h3 className="font-semibold">{isRetake ? `Start attempt ${exam.attempts.length + 1}` : "Start the exam"}</h3>
      <ul className="space-y-2 text-[13px] text-muted-foreground">
        <li className="flex items-center gap-2">
          <Timer className="size-4" /> Set aside {formatMinutes(exam.durationMin)} without breaks
        </li>
        <li className="flex items-center gap-2">
          <Wifi className="size-4" /> Use a stable connection
        </li>
        <li className="flex items-center gap-2">
          <Laptop className="size-4" /> A laptop or desktop works best for coding questions
        </li>
      </ul>
      <div className="flex items-start gap-2.5 rounded-md border p-3">
        <Checkbox id="integrity-agree" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
        <Label htmlFor="integrity-agree" className="text-[13px] leading-snug font-normal">
          I&apos;ll work on my own, and I understand that pastes and tab switches are logged.
        </Label>
      </div>
      {agreed ? (
        <Button asChild className="w-full">
          <Link href={routes.examAttempt(exam.id)}>
            <CirclePlay /> Start {isRetake ? "retake" : "exam"}
          </Link>
        </Button>
      ) : (
        <Button className="w-full" disabled>
          <CirclePlay /> Start {isRetake ? "retake" : "exam"}
        </Button>
      )}
    </Card>
  );
}
