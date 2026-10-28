"use client";

import * as React from "react";
import { CodeXml, FileText, MessageSquare, Mic, ScrollText, Timer } from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { PaneHeader, WorkspacePanes } from "@/components/shared/workspace-panes";
import { Badge } from "@/components/ui/badge";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import { INTERVIEW_MODE_LABELS, INTERVIEW_TYPE_LABELS, type InterviewStage, type LiveSession } from "@/types/interviews";
import { EndInterviewDialog } from "./end-interview-dialog";
import { LiveTranscript } from "./live-transcript";
import { ProblemCard } from "./problem-card";
import { SharedWorkspace, useSharedWorkspace } from "./shared-workspace";
import { StageTracker } from "./stage-tracker";
import { TextChat } from "./text-chat";
import { useElapsed, useTextConversation, useVoiceConversation } from "./use-conversation";
import { VoicePanel } from "./voice-panel";

export function InterviewRoom({ session, minutesLeft }: { session: LiveSession; minutesLeft: number }) {
  return session.mode === "text" ? <TextRoom session={session} minutesLeft={minutesLeft} /> : <VoiceRoom session={session} minutesLeft={minutesLeft} />;
}

function VoiceRoom({ session, minutesLeft }: { session: LiveSession; minutesLeft: number }) {
  const { elapsed, getElapsed } = useElapsed();
  const [muted, setMuted] = React.useState(false);
  const conversation = useVoiceConversation(session.script, { muted, getElapsed });
  const workspace = useSharedWorkspace(session.starterCode);

  return (
    <>
      <RoomHeader session={session} stage={conversation.stage} elapsed={elapsed} minutesLeft={minutesLeft} finished={conversation.done} />
      <WorkspacePanes
        panes={[
          {
            id: "interviewer",
            title: "Interviewer",
            icon: <Mic />,
            desktopClassName: "lg:w-[30%] xl:w-[26%]",
            content: (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <VoicePanel
                  variant={session.mode === "avatar" ? "avatar" : "voice"}
                  turns={conversation.turns}
                  speaking={conversation.speaking}
                  speakingTurn={conversation.speakingTurn}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  onInterrupt={conversation.interrupt}
                  waitingForMic={conversation.waitingForMic}
                  done={conversation.done}
                />
                <ProblemCard problem={session.problem} />
              </div>
            ),
          },
          { id: "code", title: "Code", icon: <CodeXml />, content: <SharedWorkspace state={workspace} /> },
          {
            id: "transcript",
            title: "Transcript",
            icon: <ScrollText />,
            desktopClassName: "lg:w-[28%] xl:w-[25%]",
            content: (
              <>
                <PaneHeader title="Live transcript" icon={<ScrollText />} className="hidden lg:flex" />
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <LiveTranscript turns={conversation.turns} />
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  );
}

function TextRoom({ session, minutesLeft }: { session: LiveSession; minutesLeft: number }) {
  const { elapsed, getElapsed } = useElapsed();
  const conversation = useTextConversation(session.script, { getElapsed });
  const workspace = useSharedWorkspace(session.starterCode);

  return (
    <>
      <RoomHeader session={session} stage={conversation.stage} elapsed={elapsed} minutesLeft={minutesLeft} finished={conversation.done} />
      <WorkspacePanes
        panes={[
          {
            id: "problem",
            title: "Problem",
            icon: <FileText />,
            desktopClassName: "lg:w-[28%] xl:w-[25%]",
            content: (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ProblemCard problem={session.problem} />
              </div>
            ),
          },
          { id: "code", title: "Code", icon: <CodeXml />, content: <SharedWorkspace state={workspace} /> },
          {
            id: "chat",
            title: "Chat",
            icon: <MessageSquare />,
            desktopClassName: "lg:w-[32%] xl:w-[30%]",
            content: (
              <>
                <PaneHeader title="Interview chat" icon={<MessageSquare />} className="hidden lg:flex" />
                <TextChat
                  turns={conversation.turns}
                  typing={conversation.typing}
                  done={conversation.done}
                  sampleAnswer={conversation.sampleAnswer}
                  onSend={conversation.send}
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
}

function RoomHeader({
  session,
  stage,
  elapsed,
  minutesLeft,
  finished,
}: {
  session: LiveSession;
  stage: InterviewStage;
  elapsed: number;
  minutesLeft: number;
  finished: boolean;
}) {
  const remaining = Math.max(0, minutesLeft - Math.ceil(elapsed / 60));
  return (
    <>
      <WorkspaceHeader
        backHref={routes.interviews}
        backLabel="Mock interviews"
        title={`${INTERVIEW_TYPE_LABELS[session.type]} · ${INTERVIEW_MODE_LABELS[session.mode]}`}
        meta={
          <>
            <Badge variant="destructive">
              <span className="size-1.5 rounded-full bg-destructive" /> Live
            </Badge>
            {session.company && <Badge variant="outline">{session.company} focus</Badge>}
          </>
        }
        center={<StageTracker stage={stage} />}
        actions={
          <>
            <span className="flex items-center gap-1.5 px-1 text-sm tabular-nums" aria-label="Elapsed time">
              <Timer className="size-4 text-muted-foreground" />
              {formatClock(elapsed)}
              <span className="hidden text-muted-foreground lg:inline">/ {session.durationMin}:00</span>
            </span>
            <Badge variant="secondary" className="hidden xl:inline-flex">
              {remaining} min left on plan
            </Badge>
            <EndInterviewDialog elapsedSec={elapsed} finished={finished} />
          </>
        }
      />
      <div className="flex h-9 shrink-0 items-center border-b bg-card px-4 md:hidden">
        <StageTracker stage={stage} />
      </div>
    </>
  );
}
