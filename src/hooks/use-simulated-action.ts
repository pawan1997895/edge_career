"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SimulatedStatus = "idle" | "loading" | "success" | "error";

/**
 * Fakes a network request for UI demos: `run()` shows a loading state for
 * `delayMs`, then resolves with the value returned by `produce`.
 * Replace with a real API call (or React Query mutation) when wiring the backend.
 */
export function useSimulatedAction<T>(produce: () => T, delayMs = 1200) {
  const [status, setStatus] = useState<SimulatedStatus>("idle");
  const [data, setData] = useState<T | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const produceRef = useRef(produce);

  useEffect(() => {
    produceRef.current = produce;
  });

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = useCallback(() => {
    clearTimeout(timer.current);
    setStatus("loading");
    timer.current = setTimeout(() => {
      try {
        setData(produceRef.current());
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }, delayMs);
  }, [delayMs]);

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setStatus("idle");
    setData(undefined);
  }, []);

  return { status, data, run, reset, isLoading: status === "loading" };
}
