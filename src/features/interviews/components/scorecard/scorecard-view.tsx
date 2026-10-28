"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/rich-text";
import { CodeEditor } from "@/components/shared/code-editor";
import { EmptyState } from "@/components/shared/empty-state";
import { INTERVIEW_METRICS, type Scorecard } from "@/types/interviews";
import { LANGUAGE_LABELS } from "@/types/practice";
import { RecommendationBadge } from "../interview-badges";
import { MetricCard, scoreTone } from "./metric-card";
import { StageTimeline } from "./stage-timeline";
import { TranscriptView } from "./transcript-view";

type ScorecardTab = "scorecard" | "transcript" | "artifact";

export function ScorecardView({ scorecard }: { scorecard: Scorecard }) {
  const [tab, setTab] = React.useState<ScorecardTab>("scorecard");
  const [highlightId, setHighlightId] = React.useState<string>();

  function jumpToTurn(turnId: string) {
    setHighlightId(turnId);
    setTab("transcript");
  }

  const artifact = scorecard.finalArtifact;
  const assessed = scorecard.metrics.filter((m) => m.score !== null).length;

  return (
    <div className="space-y-6">
      <ScoreSummary scorecard={scorecard} assessed={assessed} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ScorecardTab)}>
        <TabsList variant="line">
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="artifact">{artifact?.kind === "notes" ? "Design notes" : "Final code"}</TabsTrigger>
        </TabsList>

        <TabsContent value="scorecard" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {INTERVIEW_METRICS.map((meta) => {
              const metric = scorecard.metrics.find((m) => m.key === meta.key);
              return metric ? (
                <MetricCard key={meta.key} metric={metric} transcript={scorecard.transcript} onJumpToTurn={jumpToTurn} />
              ) : null;
            })}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <StageTimeline timings={scorecard.stageTimings} />
            <PractiseNext items={scorecard.practiseNext} />
          </div>
        </TabsContent>

        <TabsContent value="transcript">
          <TranscriptView transcript={scorecard.transcript} highlightId={highlightId} />
        </TabsContent>

        <TabsContent value="artifact">
          {!artifact ? (
            <EmptyState
              icon={FileText}
              title="No code or notes in this interview"
              description="Behavioral rounds are scored from the conversation only. See the transcript tab."
            />
          ) : artifact.kind === "code" ? (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b px-5 py-3 text-sm">
                <span className="font-medium">Code at the end of the interview</span>
                <span className="text-xs text-muted-foreground">{LANGUAGE_LABELS[artifact.language]}</span>
              </div>
              <div className="h-[460px]">
                <CodeEditor language={artifact.language} value={artifact.content} readOnly />
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Notes at the end of the interview</CardTitle>
                <CardDescription>Shared with the interviewer during the session.</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={artifact.content} className="font-mono whitespace-pre-wrap" />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreSummary({ scorecard, assessed }: { scorecard: Scorecard; assessed: number }) {
  return (
    <Card>
      <CardContent className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,16rem)] md:items-center">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 md:border-r md:pr-6">
          <p className="text-4xl font-semibold tracking-tight tabular-nums">
            {scorecard.overallScore?.toFixed(1) ?? "—"}
            <span className="text-base font-normal text-muted-foreground"> / 5</span>
          </p>
          <div className="space-y-1">
            {scorecard.recommendation && <RecommendationBadge recommendation={scorecard.recommendation} />}
            <p className="text-xs text-muted-foreground">Average of {assessed} assessed metrics</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Summary</p>
          <p className="mt-1 text-sm leading-relaxed">{scorecard.summary}</p>
        </div>
        <ul className="space-y-2.5">
          {INTERVIEW_METRICS.map((meta) => {
            const score = scorecard.metrics.find((m) => m.key === meta.key)?.score ?? null;
            return (
              <li key={meta.key} className="text-[13px]">
                <div className="flex justify-between">
                  <span>{meta.label}</span>
                  <span className="text-muted-foreground tabular-nums">{score === null ? "Not assessed" : score.toFixed(1)}</span>
                </div>
                <Progress className="mt-1" value={score === null ? 0 : (score / 5) * 100} tone={score === null ? "muted" : scoreTone(score)} />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function PractiseNext({ items }: { items: Scorecard["practiseNext"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practise next</CardTitle>
        <CardDescription>Picked from the gaps in this interview</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y border-t">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group flex items-center gap-3 px-5 py-3 hover:bg-accent/50">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium group-hover:text-primary">{item.title}</span>
                  <span className="block text-[13px] text-muted-foreground">{item.reason}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
