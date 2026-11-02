"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AiCore, DataStream, EASE, NeonEditor, TechChip, type ChipTone, type CodeLine } from "../ui";
import styles from "../neon.module.css";

// The network is laid out in one 520 x 430 coordinate box (an SVG viewBox and %-positioned chips
// share it), so the wires always meet the chips at any width.
const W = 520;
const H = 430;
const CORE = { x: 150, y: 168, r: 52 };

const NODES: { label: string; tone: ChipTone; x: number; y: number; dur: number; delay: number }[] = [
  { label: "React", tone: "cyan", x: 300, y: 44, dur: 3.2, delay: 0 },
  { label: "Node.js", tone: "emerald", x: 430, y: 76, dur: 3.6, delay: -1.2 },
  { label: "Python", tone: "lime", x: 446, y: 168, dur: 3.0, delay: -0.6 },
  { label: "AI", tone: "violet", x: 44, y: 54, dur: 3.4, delay: -2 },
  { label: "JS", tone: "lime", x: 50, y: 300, dur: 3.8, delay: -1.6 },
  { label: "TS", tone: "cyan", x: 168, y: 342, dur: 3.3, delay: -2.6 },
];

const SYMBOLS = [
  { text: "{}", x: 238, y: 122, dur: 6 },
  { text: "</>", x: 220, y: 18, dur: 7 },
  { text: "=>", x: 30, y: 186, dur: 6.5 },
  { text: "&&", x: 330, y: 132, dur: 7.5 },
] as const;

/** A gently curved wire from the edge of the AI core to just short of a chip. */
function wirePath(x: number, y: number) {
  const angle = Math.atan2(y - CORE.y, x - CORE.x);
  const sx = CORE.x + Math.cos(angle) * (CORE.r + 6);
  const sy = CORE.y + Math.sin(angle) * (CORE.r + 6);
  const ex = x - Math.cos(angle) * 28;
  const ey = y - Math.sin(angle) * 16;
  const mx = (sx + ex) / 2 - Math.sin(angle) * 22;
  const my = (sy + ey) / 2 + Math.cos(angle) * 22;
  return `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

// ASCII only, at most 28 characters a line, six lines a script (keeps the editor's size steady).
const SCRIPTS: CodeLine[][] = [
  [
    [["kw", "import"], ["punc", " { "], ["prop", "ai"], ["punc", " } "], ["kw", "from"], ["str", ' "edge"'], ["punc", ";"]],
    [],
    [["kw", "const "], ["prop", "you"], ["punc", " = "], ["fn", "ai.profile"], ["punc", "();"]],
    [["kw", "const "], ["prop", "plan"], ["punc", " = "], ["fn", "ai.path"], ["punc", "("], ["prop", "you"], ["punc", ");"]],
    [["kw", "await "], ["fn", "plan.start"], ["punc", "();"]],
    [["com", "// your next chapter"]],
  ],
  [
    [["kw", "function "], ["fn", "solve"], ["punc", "("], ["prop", "nums"], ["punc", ") {"]],
    [["kw", "  const "], ["prop", "seen"], ["punc", " = "], ["kw", "new "], ["fn", "Set"], ["punc", "();"]],
    [["kw", "  for "], ["punc", "("], ["kw", "const "], ["prop", "n"], ["kw", " of "], ["prop", "nums"], ["punc", ")"]],
    [["kw", "    if "], ["punc", "("], ["fn", "seen.has"], ["punc", "("], ["prop", "n"], ["punc", ")) "], ["kw", "return "], ["prop", "n"], ["punc", ";"]],
    [["kw", "  return "], ["num", "-1"], ["punc", ";"]],
    [["punc", "}"]],
  ],
  [
    [["kw", "const "], ["prop", "r"], ["punc", " = "], ["kw", "await "], ["fn", "ai.review"], ["punc", "();"]],
    [["fn", "console.log"], ["punc", "("], ["prop", "r.tests"], ["punc", ");"]],
    [["com", "// 12/12 hidden tests pass"]],
    [["kw", "if "], ["punc", "("], ["prop", "r.score"], ["punc", " >= "], ["num", "85"], ["punc", ") {"]],
    [["fn", "  unlock"], ["punc", "("], ["str", '"module-2"'], ["punc", ");"]],
    [["punc", "}"]],
  ],
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Network() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="v5-wire" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--v5-emerald)" />
            <stop offset="1" stopColor="var(--v5-cyan)" />
          </linearGradient>
        </defs>
        {NODES.map((n) => {
          const d = wirePath(n.x, n.y);
          return (
            <g key={n.label}>
              <path d={d} className={styles.wire} fill="none" stroke="url(#v5-wire)" strokeOpacity="0.35" strokeWidth="1.5" />
              <path
                d={d}
                pathLength={100}
                className={styles.pulseDash}
                fill="none"
                stroke="var(--v5-lime)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ "--dur": `${n.dur}s`, "--delay": `${n.delay}s`, filter: "drop-shadow(0 0 4px var(--v5-lime))" } as React.CSSProperties}
              />
            </g>
          );
        })}
      </svg>

      <span
        className="absolute"
        style={{ left: pct(CORE.x - CORE.r, W), top: pct(CORE.y - CORE.r, H), width: pct(CORE.r * 2, W), height: pct(CORE.r * 2, H) }}
      >
        <AiCore size={CORE.r * 2} className="size-full!" />
      </span>

      {NODES.map((n, i) => (
        <motion.span
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(n.x, W), top: pct(n.y, H) }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.08 }}
        >
          <span className={cn(styles.float, "block")} style={{ "--dur": `${5 + (i % 3)}s`, "--delay": `${-i}s`, "--bob": "-6px" } as React.CSSProperties}>
            <TechChip tone={n.tone}>{n.label}</TechChip>
          </span>
        </motion.span>
      ))}

      {SYMBOLS.map((s, i) => (
        <span
          key={s.text}
          className={cn(styles.mono, styles.float, "absolute text-sm font-bold text-(--v5-emerald)/50")}
          style={{ left: pct(s.x, W), top: pct(s.y, H), "--dur": `${s.dur}s`, "--delay": `${-i * 1.3}s` } as React.CSSProperties}
        >
          {s.text}
        </span>
      ))}

      <span className="absolute flex gap-2" style={{ left: pct(492, W), top: 0, height: pct(200, H) }}>
        <DataStream digits="0110100101101001" className="h-full" dur={8} />
        <DataStream digits="1001011010010110" className="h-full text-(--v5-emerald)/70" dur={11} delay={3} />
      </span>

      <div className="absolute" style={{ left: pct(228, W), top: pct(218, H), width: pct(292, W) }}>
        <NeonEditor file="next-chapter.ts" scripts={SCRIPTS} />
      </div>
    </div>
  );
}

/** Headline and the neon network illustration beside the sign-up form. */
export function NeonIllustration({ className }: { className?: string }) {
  return (
    <motion.section
      aria-label="About Edge Career"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className={cn("min-w-0", className)}
    >
      <TechChip tone="lime">AI coding studio</TechChip>
      <h2 className="mt-4 text-[2.4rem] leading-[1.04] font-bold tracking-tight sm:text-5xl xl:text-[3.3rem]">
        Your Next Chapter in Tech{" "}
        <span className="bg-(image:--v5-neon) bg-clip-text text-transparent">Starts Here</span>
      </h2>
      <p className="mt-3 max-w-lg text-[15px] text-white/60">
        Lessons, a code judge, system design and mock interviews in one structured path, with AI feedback at every step.
      </p>
      <div className="mt-6 hidden lg:block">
        <Network />
      </div>
      <div className="mt-6 hidden max-w-md md:block lg:hidden">
        <NeonEditor file="next-chapter.ts" scripts={SCRIPTS} />
      </div>
    </motion.section>
  );
}
