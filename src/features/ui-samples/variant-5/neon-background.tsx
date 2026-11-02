import styles from "./neon.module.css";

// A few grid cells (48px grid) that softly light up and fade, kept to the outer areas.
const CELLS = [
  { col: 2, row: 3, dur: 7, delay: 0 },
  { col: 5, row: 12, dur: 9, delay: -3 },
  { col: 26, row: 2, dur: 8, delay: -5 },
  { col: 28, row: 10, dur: 10, delay: -2 },
  { col: 1, row: 8, dur: 11, delay: -7 },
  { col: 24, row: 15, dur: 8, delay: -4 },
] as const;

/** Near-black studio backdrop: a subtle neon grid with a few cells glowing on and off. CSS only. */
export function NeonBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={styles.grid} />
      {CELLS.map((c, i) => (
        <span
          key={i}
          className={styles.cell}
          style={{ left: c.col * 48 + 1, top: c.row * 48 + 1, "--dur": `${c.dur}s`, "--delay": `${c.delay}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
