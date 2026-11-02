import { cn } from "@/lib/utils";
import styles from "./minimal.module.css";

// Kept to the edges so they never sit behind the form. `wide` items only show on larger screens
// (on phones the content fills the width, so only a few symbols near the bottom remain).
const SYMBOLS = [
  { text: "{ }", left: "7%", top: "16%", size: 18, color: "--v3-blue", opacity: 0.4, dur: 13, delay: 0, wide: true },
  { text: "</>", left: "86%", top: "12%", size: 16, color: "--v3-violet", opacity: 0.4, dur: 15, delay: -4, wide: true },
  { text: "AI", left: "91%", top: "46%", size: 20, color: "--v3-cyan", opacity: 0.35, dur: 12, delay: -2, wide: true },
  { text: "JS", left: "5%", top: "58%", size: 15, color: "--v3-cyan", opacity: 0.35, dur: 14, delay: -7, wide: true },
  { text: "TS", left: "15%", top: "82%", size: 15, color: "--v3-blue", opacity: 0.35, dur: 11, delay: -3, wide: false },
  { text: "01", left: "80%", top: "80%", size: 14, color: "--v3-violet", opacity: 0.35, dur: 16, delay: -9, wide: false },
  { text: "1", left: "22%", top: "30%", size: 13, color: "--v3-cyan", opacity: 0.3, dur: 10, delay: -5, wide: true },
  { text: "0", left: "76%", top: "28%", size: 13, color: "--v3-blue", opacity: 0.3, dur: 12, delay: -1, wide: true },
  { text: "10", left: "12%", top: "40%", size: 12, color: "--v3-violet", opacity: 0.3, dur: 15, delay: -6, wide: true },
  { text: "=>", left: "84%", top: "64%", size: 14, color: "--v3-cyan", opacity: 0.3, dur: 13, delay: -8, wide: true },
  { text: "0", left: "28%", top: "90%", size: 12, color: "--v3-blue", opacity: 0.3, dur: 11, delay: -2, wide: true },
  { text: "1", left: "68%", top: "92%", size: 12, color: "--v3-violet", opacity: 0.3, dur: 14, delay: -4, wide: true },
  { text: "()", left: "62%", top: "6%", size: 13, color: "--v3-blue", opacity: 0.3, dur: 12, delay: -6, wide: true },
  { text: "&&", left: "34%", top: "8%", size: 12, color: "--v3-cyan", opacity: 0.25, dur: 16, delay: -3, wide: true },
] as const;

const PARTICLES = [
  { left: "18%", top: "70%", size: 3, dur: 14, delay: 0 },
  { left: "30%", top: "24%", size: 2, dur: 17, delay: -5 },
  { left: "70%", top: "20%", size: 3, dur: 15, delay: -9 },
  { left: "82%", top: "72%", size: 2, dur: 13, delay: -3 },
  { left: "9%", top: "34%", size: 2, dur: 18, delay: -11 },
  { left: "92%", top: "30%", size: 3, dur: 16, delay: -7 },
  { left: "48%", top: "94%", size: 2, dur: 15, delay: -2 },
  { left: "58%", top: "14%", size: 2, dur: 19, delay: -13 },
  { left: "40%", top: "60%", size: 2, dur: 17, delay: -8 },
] as const;

/**
 * Calm tech backdrop for Design Option 3, entirely CSS (transform/opacity animations, no canvas):
 * two breathing gradient glows, four hairlines with travelling light, small floating code symbols
 * and a few soft particles.
 */
export function TechBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={styles.glowTop} />
      <div className={styles.glowCorner} />

      {/* Near the top and bottom edges, so they never run through the progress line or the form */}
      <div className={styles.lineH} style={{ top: "7%" }}>
        <span className={styles.pulseH} style={{ "--dur": "12s" } as React.CSSProperties} />
      </div>
      <div className={styles.lineH} style={{ top: "91%" }}>
        <span className={styles.pulseH} style={{ "--dur": "15s", "--delay": "-6s" } as React.CSSProperties} />
      </div>
      <div className={cn(styles.lineV, "hidden md:block")} style={{ left: "14%" }}>
        <span className={styles.pulseV} style={{ "--dur": "14s", "--delay": "-3s" } as React.CSSProperties} />
      </div>
      <div className={cn(styles.lineV, "hidden md:block")} style={{ right: "14%" }}>
        <span className={styles.pulseV} style={{ "--dur": "17s", "--delay": "-10s" } as React.CSSProperties} />
      </div>

      {SYMBOLS.map((s, i) => (
        <span
          key={i}
          className={cn(styles.symbol, s.wide && "hidden md:block")}
          style={
            {
              left: s.left,
              top: s.top,
              fontSize: s.size,
              color: `var(${s.color})`,
              opacity: s.opacity,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
              "--dy": `${i % 2 ? -18 : -12}px`,
              "--dx": `${i % 3 ? 6 : -6}px`,
              "--rot": `${i % 2 ? 5 : -4}deg`,
            } as React.CSSProperties
          }
        >
          {s.text}
        </span>
      ))}

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={styles.particle}
          style={
            { left: p.left, top: p.top, width: p.size, height: p.size, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
