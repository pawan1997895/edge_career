// Number formatting used on the operations pages.

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** 61_200_000 -> "61.2M" */
export function formatCompact(value: number) {
  return compact.format(value);
}

/** 620 -> "620 ms", 1840 -> "1.8 s" */
export function formatMs(ms: number) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)} s`;
}

/** 412 -> "6:52" (attempt timeline offsets) */
export function formatOffset(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
