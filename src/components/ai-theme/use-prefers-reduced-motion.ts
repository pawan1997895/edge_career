"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * The visitor's reduced-motion setting, safe to use for what gets rendered: it reads `false`
 * while hydrating (matching the server HTML), then updates. Motion's `useReducedMotion`
 * reports the real value on the first client render, which can break hydration.
 */
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
