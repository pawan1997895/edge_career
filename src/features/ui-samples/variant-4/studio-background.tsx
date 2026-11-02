import { cn } from "@/lib/utils";
import styles from "./studio.module.css";

// A deliberately small set, kept to the outer edges of the page.
const WORDS = [
  { text: "import", left: "3%", top: "14%", color: "--v4-purple", dur: 8, delay: 0 },
  { text: "=>", left: "95%", top: "22%", color: "--v4-cyan", dur: 7, delay: -3 },
  { text: "0101", left: "2%", top: "70%", color: "--v4-indigo", dur: 9, delay: -5 },
  { text: "{ }", left: "95%", top: "76%", color: "--v4-purple", dur: 8, delay: -2 },
] as const;

const PARTICLES = [
  { left: "12%", top: "30%", size: 6, color: "--v4-violet", dur: 13, delay: 0 },
  { left: "88%", top: "40%", size: 5, color: "--v4-cyan", dur: 15, delay: -6 },
  { left: "20%", top: "86%", size: 4, color: "--v4-cyan", dur: 12, delay: -3 },
  { left: "76%", top: "12%", size: 5, color: "--v4-violet", dur: 14, delay: -9 },
  { left: "52%", top: "94%", size: 4, color: "--v4-indigo", dur: 16, delay: -4 },
] as const;

/** Light studio backdrop: soft dot grid, two drifting pastel glows, a few particles and code words. CSS only. */
export function StudioBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={styles.dots} />
      <span
        className={styles.blob}
        style={
          { left: "-8rem", top: "-10rem", width: "34rem", height: "34rem", background: "oklch(0.85 0.1 300 / 0.55)", "--dx": "60px", "--dy": "40px" } as React.CSSProperties
        }
      />
      <span
        className={styles.blob}
        style={
          {
            right: "-10rem",
            bottom: "-12rem",
            width: "38rem",
            height: "38rem",
            background: "oklch(0.88 0.08 220 / 0.6)",
            "--dx": "-50px",
            "--dy": "-30px",
            "--dur": "26s",
          } as React.CSSProperties
        }
      />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={styles.particle}
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: `var(${p.color})`,
              boxShadow: `0 0 12px 2px var(${p.color})`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
      {WORDS.map((w) => (
        <span
          key={w.text}
          className={cn(styles.mono, styles.floatTag, "absolute hidden rounded-lg border border-(--v4-line) bg-white/70 px-2 py-1 text-xs font-semibold shadow-sm xl:block")}
          style={{ left: w.left, top: w.top, color: `var(${w.color})`, "--dur": `${w.dur}s`, "--delay": `${w.delay}s` } as React.CSSProperties}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}
