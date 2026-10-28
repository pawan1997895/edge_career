"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, Hand, LoaderCircle, MessageSquare, Mic, ScrollText, TriangleAlert, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioCard, RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { routes } from "@/lib/routes";
import {
  INTERVIEW_MODE_LABELS,
  INTERVIEW_STAGES,
  INTERVIEW_TYPE_LABELS,
  type InterviewDifficulty,
  type InterviewMode,
  type InterviewQuota,
  type InterviewType,
} from "@/types/interviews";
import { INTERVIEW_TYPE_ICONS } from "../interview-badges";
import { INTERVIEW_TYPES } from "../interview-type-cards";
import { DeviceCheck, type DeviceCheckState } from "./device-check";

const DEFAULT_DURATION: Record<InterviewType, number> = { dsa: 45, lld: 60, hld: 60, behavioral: 30 };
const DURATIONS = [30, 45, 60];
const LIVE_SESSION_BY_MODE: Record<InterviewMode, string> = {
  text: "iv-live-text",
  voice: "iv-live-voice",
  avatar: "iv-live-avatar",
};
const LOW_BALANCE_DEMO_MINUTES = 12;

export function InterviewSetupForm({
  initialType,
  quota,
  targetCompanies,
  companyOptions,
}: {
  initialType: InterviewType;
  quota: InterviewQuota;
  targetCompanies: string[];
  companyOptions: string[];
}) {
  const router = useRouter();
  const [type, setType] = React.useState<InterviewType>(initialType);
  const [mode, setMode] = React.useState<InterviewMode>("voice");
  const [company, setCompany] = React.useState("any");
  const [difficulty, setDifficulty] = React.useState<InterviewDifficulty>("medium");
  const [duration, setDuration] = React.useState(DEFAULT_DURATION[initialType]);
  const [lowBalance, setLowBalance] = React.useState(false);
  const [devices, setDevices] = React.useState<DeviceCheckState>({ mic: "idle", speaker: "idle", network: "idle" });

  const minutesLeft = lowBalance ? LOW_BALANCE_DEMO_MINUTES : quota.minutesLeft;
  const notEnoughMinutes = duration > minutesLeft;
  const needsDevices = mode !== "text";
  const devicesReady = devices.mic === "passed" && devices.speaker === "passed" && devices.network === "passed";

  const connect = useSimulatedAction(() => LIVE_SESSION_BY_MODE[mode], 1400);
  const { status: connectStatus, data: sessionId } = connect;

  React.useEffect(() => {
    if (connectStatus === "success" && sessionId) router.push(routes.interviewRoom(sessionId));
  }, [connectStatus, sessionId, router]);

  const otherCompanies = companyOptions.filter((c) => !targetCompanies.includes(c));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Interview type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={type}
              onValueChange={(v) => {
                const next = v as InterviewType;
                setType(next);
                setDuration(DEFAULT_DURATION[next]);
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {INTERVIEW_TYPES.map((t) => {
                const Icon = INTERVIEW_TYPE_ICONS[t];
                return (
                  <RadioCard
                    key={t}
                    value={t}
                    icon={<Icon />}
                    title={INTERVIEW_TYPE_LABELS[t]}
                    description={`Usually ${DEFAULT_DURATION[t]} minutes`}
                  />
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as InterviewMode)} className="grid gap-3 md:grid-cols-3">
              <RadioCard value="text" icon={<MessageSquare />} title="Text" description="Chat with the interviewer. Good for quiet places." />
              <RadioCard value="voice" icon={<Mic />} title="Voice" description="Speak naturally, interrupt any time, with live captions." />
              <RadioCard
                value="avatar"
                icon={<Video />}
                title={
                  <span className="flex flex-wrap items-center gap-1.5">
                    Avatar video <Badge variant="info">Phase 2 preview</Badge>
                  </span>
                }
                description="Runs in voice with a placeholder video tile."
              />
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-focus">Company focus (optional)</Label>
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger id="company-focus" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">No specific company</SelectItem>
                  <SelectGroup>
                    <SelectLabel>Your targets</SelectLabel>
                    {targetCompanies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Other companies</SelectLabel>
                    {otherCompanies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Questions and follow-ups lean towards this company&apos;s known interview style.</p>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <RadioGroup
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as InterviewDifficulty)}
                className="flex h-9 items-center gap-5"
              >
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <label key={d} className="flex cursor-pointer items-center gap-2 text-sm capitalize">
                    <RadioGroupItem value={d} /> {d}
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Duration</Label>
              <RadioGroup value={String(duration)} onValueChange={(v) => setDuration(Number(v))} className="grid grid-cols-3 gap-3">
                {DURATIONS.map((d) => (
                  <RadioCard
                    key={d}
                    value={String(d)}
                    title={`${d} min`}
                    description={d === DEFAULT_DURATION[type] ? "Recommended" : undefined}
                    className="p-3"
                  />
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {needsDevices && <DeviceCheck state={devices} onChange={setDevices} />}

        <Card>
          <CardHeader>
            <CardTitle>What to expect</CardTitle>
            <CardDescription>Every interview follows the same stages. The interviewer adapts its follow-ups to your answers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="flex flex-wrap gap-1.5">
              {INTERVIEW_STAGES.map((stage, i) => (
                <li key={stage.key} className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs">
                  <span className="text-muted-foreground tabular-nums">{i + 1}</span> {stage.label}
                </li>
              ))}
            </ol>
            <ul className="grid gap-3 text-[13px] sm:grid-cols-3">
              <li className="flex gap-2.5">
                <Eye className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>The interviewer sees your code and diagrams live, as in a shared screen.</span>
              </li>
              <li className="flex gap-2.5">
                <Hand className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>You can interrupt at any time, just like a real conversation.</span>
              </li>
              <li className="flex gap-2.5">
                <ScrollText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>The transcript is saved and scored on four metrics with quoted evidence.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="space-y-2 text-sm">
              <SummaryRow label="Type" value={INTERVIEW_TYPE_LABELS[type]} />
              <SummaryRow label="Mode" value={INTERVIEW_MODE_LABELS[mode]} />
              <SummaryRow label="Company focus" value={company === "any" ? "None" : company} />
              <SummaryRow label="Difficulty" value={<span className="capitalize">{difficulty}</span>} />
              <SummaryRow label="Duration" value={`${duration} min`} />
            </dl>
            <div className="rounded-md border bg-muted/40 p-3 text-[13px]">
              <p>
                Up to <span className="font-medium">{duration} min</span> will be deducted.
              </p>
              <p className="mt-0.5 text-muted-foreground tabular-nums">
                {minutesLeft} min left now → {Math.max(0, minutesLeft - duration)} min after
              </p>
            </div>

            {notEnoughMinutes && (
              <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>Not enough interview minutes</AlertTitle>
                <AlertDescription>
                  You have {minutesLeft} min left. Choose a shorter duration, or{" "}
                  <Link href={routes.pricing} className="font-medium text-foreground underline underline-offset-2">
                    upgrade your plan
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            )}
            {needsDevices && !devicesReady && !notEnoughMinutes && (
              <p className="text-xs text-muted-foreground">Run the device check before starting a voice interview.</p>
            )}

            <Button
              className="w-full"
              disabled={notEnoughMinutes || (needsDevices && !devicesReady) || connect.isLoading || connectStatus === "success"}
              onClick={connect.run}
            >
              {connect.isLoading || connectStatus === "success" ? (
                <>
                  <LoaderCircle className="animate-spin" /> Connecting to interviewer…
                </>
              ) : (
                <>
                  Start interview <ArrowRight />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Demo: the live room plays a sample DSA session.</p>
          </CardContent>
          <CardFooter className="justify-between">
            <Label htmlFor="low-balance" className="text-xs font-normal text-muted-foreground">
              Preview with a low balance ({LOW_BALANCE_DEMO_MINUTES} min)
            </Label>
            <Switch id="low-balance" checked={lowBalance} onCheckedChange={setLowBalance} />
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
