"use client";

// Simulated interview conversations. In production these turns stream from the
// interview agent (speech-to-text → Claude → text-to-speech); here they replay a script.

import { useCallback, useEffect, useRef, useState } from "react";
import type { InterviewStage, ScriptedTurn } from "@/types/interviews";

export interface LiveTurn {
  id: string;
  speaker: "interviewer" | "candidate";
  text: string;
  stage: InterviewStage;
  atSec: number;
  latencyMs?: number;
  interrupted?: boolean;
}

/** Seconds since the room opened, ticking once a second. */
export function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const getElapsed = useCallback(() => Math.floor((Date.now() - startRef.current) / 1000), []);
  return { elapsed, getElapsed };
}

/** Speaking time for an interviewer turn, roughly matching text-to-speech pace. */
function speakingMs(text: string) {
  return Math.min(7000, 1500 + text.length * 35);
}

/**
 * Voice and avatar sessions: plays interviewer and candidate turns in order.
 * The candidate's turns wait while the mic is muted; `interrupt` cuts the interviewer off.
 */
export function useVoiceConversation(script: ScriptedTurn[], { muted, getElapsed }: { muted: boolean; getElapsed: () => number }) {
  const [cursor, setCursor] = useState(0);
  const [phase, setPhase] = useState<"waiting" | "speaking">("waiting");
  const [turns, setTurns] = useState<LiveTurn[]>([]);

  // Emit the next scripted turn after a short pause (the interviewer's reply latency).
  useEffect(() => {
    if (phase !== "waiting" || cursor >= script.length) return;
    const next = script[cursor]!;
    if (next.speaker === "candidate" && muted) return;
    const delay = cursor === 0 ? 1000 : next.speaker === "interviewer" ? (next.latencyMs ?? 1200) : 2400;
    const timer = setTimeout(() => {
      setTurns((prev) => [...prev, { ...next, id: `live-${cursor}`, atSec: getElapsed() }]);
      if (next.speaker === "interviewer") setPhase("speaking");
      else setCursor((c) => c + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [cursor, phase, muted, script, getElapsed]);

  // While the interviewer is speaking, wait for the turn to finish.
  useEffect(() => {
    if (phase !== "speaking") return;
    const timer = setTimeout(() => {
      setPhase("waiting");
      setCursor((c) => c + 1);
    }, speakingMs(script[cursor]?.text ?? ""));
    return () => clearTimeout(timer);
  }, [phase, cursor, script]);

  const interrupt = useCallback(() => {
    if (phase !== "speaking") return;
    setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 ? { ...t, interrupted: true } : t)));
    setPhase("waiting");
    setCursor((c) => c + 1);
  }, [phase]);

  const done = cursor >= script.length;
  const nextTurn = script[cursor];
  const lastTurn = turns.at(-1);

  return {
    turns,
    interrupt,
    done,
    speaking: phase === "speaking",
    /** The candidate's turn is due but the mic is muted. */
    waitingForMic: !done && phase === "waiting" && nextTurn?.speaker === "candidate" && muted,
    stage: lastTurn?.stage ?? script[0]?.stage ?? "intro",
    speakingTurn: phase === "speaking" ? lastTurn : undefined,
  };
}

/**
 * Text sessions: the interviewer posts scripted turns; each candidate message
 * triggers a typing state and the next interviewer turn.
 */
export function useTextConversation(script: ScriptedTurn[], { getElapsed }: { getElapsed: () => number }) {
  const interviewerTurns = script.filter((t) => t.speaker === "interviewer");
  const [turns, setTurns] = useState<LiveTurn[]>([]);
  const [typing, setTyping] = useState(true);
  const [nextIndex, setNextIndex] = useState(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const firstTurn = interviewerTurns[0];

  useEffect(() => {
    if (!firstTurn) return;
    const timer = setTimeout(() => {
      setTurns([{ ...firstTurn, id: "chat-i0", atSec: getElapsed() }]);
      setTyping(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [firstTurn, getElapsed]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const stage = turns.filter((t) => t.speaker === "interviewer").at(-1)?.stage ?? "intro";
  const done = nextIndex >= interviewerTurns.length && !typing;

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setTurns((prev) => [...prev, { id: `chat-c${prev.length}`, speaker: "candidate", text: trimmed, stage, atSec: getElapsed() }]);
      const reply = interviewerTurns[nextIndex];
      if (!reply) return;
      setTyping(true);
      timers.current.push(
        setTimeout(() => {
          setTurns((prev) => [...prev, { ...reply, id: `chat-i${nextIndex}`, atSec: getElapsed() }]);
          setTyping(false);
          setNextIndex((i) => i + 1);
        }, 1400),
      );
    },
    [interviewerTurns, nextIndex, stage, getElapsed],
  );

  /** A sample candidate answer for the current stage, so the demo can be clicked through. */
  const sampleAnswer = script.find((t) => t.speaker === "candidate" && t.stage === stage)?.text;

  return { turns, typing, send, stage, done, sampleAnswer };
}
