"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircleQuestionMark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChapterList } from "@/features/lessons/components/chapter-list";
import { PlayerControls } from "@/features/lessons/components/player-controls";
import { TranscriptPanel } from "@/features/lessons/components/transcript-panel";
import { VideoStage } from "@/features/lessons/components/video-stage";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Lesson } from "@/types/curriculum";

const TICK_MS = 250;

function indexAt<T extends { startSec: number }>(list: T[], sec: number) {
  let found = 0;
  list.forEach((entry, i) => {
    if (entry.startSec <= sec) found = i;
  });
  return found;
}

/**
 * Lesson video with simulated playback, synced transcript and chapters.
 * Swap the VideoStage for a real <video> element streaming from the CDN later;
 * the transcript sync only needs the current time.
 */
export function LessonPlayer({ lesson, moduleLabel, startSec }: { lesson: Lesson; moduleLabel: string; startSec: number }) {
  const duration = lesson.durationSec;
  const [currentSec, setCurrentSec] = React.useState(() => Math.min(duration, Math.max(0, startSec)));
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const [showCaptions, setShowCaptions] = React.useState(true);
  const secRef = React.useRef(currentSec);
  const stageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const next = Math.min(duration, secRef.current + (TICK_MS / 1000) * speed);
      secRef.current = next;
      setCurrentSec(next);
      if (next >= duration) setPlaying(false);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, speed, duration]);

  const seek = React.useCallback(
    (sec: number) => {
      const clamped = Math.min(duration, Math.max(0, sec));
      secRef.current = clamped;
      setCurrentSec(clamped);
    },
    [duration],
  );

  const togglePlay = React.useCallback(() => {
    if (secRef.current >= duration) seek(0);
    setPlaying((p) => !p);
  }, [duration, seek]);

  const activeCue = indexAt(lesson.transcript, currentSec);
  const activeChapter = indexAt(lesson.chapters, currentSec);
  const chapter = lesson.chapters[activeChapter];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 space-y-4">
        <Card className="overflow-hidden">
          <VideoStage
            ref={stageRef}
            playing={playing}
            chapterTitle={chapter?.title ?? lesson.title}
            moduleLabel={moduleLabel}
            caption={lesson.transcript[activeCue]?.text}
            showCaptions={showCaptions}
            onTogglePlay={togglePlay}
            onSeekBy={(d) => seek(secRef.current + d)}
          />
          <PlayerControls
            currentSec={currentSec}
            durationSec={duration}
            chapters={lesson.chapters}
            currentChapter={chapter}
            playing={playing}
            muted={muted}
            speed={speed}
            showCaptions={showCaptions}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onToggleMute={() => setMuted((m) => !m)}
            onSpeedChange={setSpeed}
            onToggleCaptions={() => setShowCaptions((c) => !c)}
            onFullscreen={() => void stageRef.current?.requestFullscreen?.()}
          />
        </Card>

        <Card className="flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <MessageCircleQuestionMark className="size-4" />
          </span>
          <div className="flex-1 text-sm">
            <p className="font-medium">Stuck at {formatClock(currentSec)}?</p>
            <p className="text-[13px] text-muted-foreground">
              The doubt hub sees the transcript around this moment and answers with hints, not full solutions.
            </p>
          </div>
          <Button asChild>
            <Link href={routes.askAboutLesson(lesson.id, currentSec)}>Ask about this moment</Link>
          </Button>
        </Card>
      </div>

      <Card className="min-h-0 overflow-hidden lg:h-[calc(100dvh-13rem)] lg:min-h-[28rem]">
        <Tabs defaultValue="transcript" className="min-h-0 flex-1 gap-0">
          <div className="border-b px-3 pt-1">
            <TabsList variant="line" className="border-b-0">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="chapters">Chapters ({lesson.chapters.length})</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="transcript" className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
            <TranscriptPanel lessonId={lesson.id} cues={lesson.transcript} activeIndex={activeCue} onSeek={seek} />
          </TabsContent>
          <TabsContent value="chapters" className="min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden">
            <ChapterList chapters={lesson.chapters} activeIndex={activeChapter} onSeek={seek} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
