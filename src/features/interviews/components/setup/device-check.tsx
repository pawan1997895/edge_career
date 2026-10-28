"use client";

import * as React from "react";
import { CircleCheck, Headphones, LoaderCircle, Mic, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CheckStatus = "idle" | "running" | "passed";

export interface DeviceCheckState {
  mic: CheckStatus;
  speaker: CheckStatus;
  network: CheckStatus;
}

const BAR_COUNT = 16;

/**
 * Simulated microphone, speaker and network checks before a voice interview.
 * The real version will use getUserMedia and a round trip to the interview agent.
 */
export function DeviceCheck({ state, onChange }: { state: DeviceCheckState; onChange: (next: DeviceCheckState) => void }) {
  const [level, setLevel] = React.useState(0);
  const stateRef = React.useRef(state);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const meter = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  React.useEffect(() => {
    stateRef.current = state;
  });

  React.useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      clearInterval(meter.current);
    },
    [],
  );

  function update(patch: Partial<DeviceCheckState>) {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    onChange(next);
  }

  function later(fn: () => void, ms: number) {
    timers.current.push(setTimeout(fn, ms));
  }

  function testMic() {
    update({ mic: "running" });
    clearInterval(meter.current);
    meter.current = setInterval(() => setLevel(0.25 + Math.random() * 0.7), 120);
    later(() => {
      clearInterval(meter.current);
      setLevel(0.55);
      update({ mic: "passed" });
    }, 3000);
  }

  function testSpeaker() {
    update({ speaker: "running" });
    later(() => update({ speaker: "passed" }), 1800);
  }

  function testNetwork() {
    update({ network: "running" });
    later(() => update({ network: "passed" }), 1500);
  }

  const activeBars = Math.round(level * BAR_COUNT);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device check</CardTitle>
        <CardDescription>Takes about 10 seconds. Nothing is recorded during the check.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y p-0">
        <CheckRow
          icon={Mic}
          title="Microphone"
          status={state.mic}
          result="Microphone is working. Speak at this level during the interview."
          action={
            <Button variant="outline" size="sm" onClick={testMic} disabled={state.mic === "running"}>
              {state.mic === "passed" ? "Test again" : "Test microphone"}
            </Button>
          }
        >
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select defaultValue="default">
              <SelectTrigger size="sm" className="w-full sm:w-64" aria-label="Microphone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default · Laptop microphone</SelectItem>
                <SelectItem value="headset">Headset microphone</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex h-6 flex-1 items-end gap-0.5" aria-hidden>
              {Array.from({ length: BAR_COUNT }, (_, i) => (
                <span
                  key={i}
                  className={cn("w-full rounded-sm transition-[height]", i < activeBars ? "bg-success" : "bg-muted")}
                  style={{ height: `${30 + (i % 4) * 15}%` }}
                />
              ))}
            </div>
          </div>
        </CheckRow>
        <CheckRow
          icon={Headphones}
          title="Speaker"
          status={state.speaker}
          result="You heard the test sound. Headphones are recommended to avoid echo."
          action={
            <Button variant="outline" size="sm" onClick={testSpeaker} disabled={state.speaker === "running"}>
              {state.speaker === "running" ? "Playing…" : "Play test sound"}
            </Button>
          }
        />
        <CheckRow
          icon={Wifi}
          title="Connection"
          status={state.network}
          result="Round trip 46 ms to the Mumbai region. Expected reply time about 1.2 s (target under 1.5 s)."
          action={
            <Button variant="outline" size="sm" onClick={testNetwork} disabled={state.network === "running"}>
              Check connection
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}

function CheckRow({
  icon: Icon,
  title,
  status,
  result,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: CheckStatus;
  result: string;
  action: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
        {status === "passed" && (
          <Badge variant="success">
            <CircleCheck /> Ready
          </Badge>
        )}
        {status === "running" && (
          <Badge variant="info">
            <LoaderCircle className="animate-spin" /> Checking
          </Badge>
        )}
        <div className="ml-auto">{action}</div>
      </div>
      {status === "passed" && <p className="mt-1.5 pl-7 text-[13px] text-muted-foreground">{result}</p>}
      {children && <div className="pl-7">{children}</div>}
    </div>
  );
}
