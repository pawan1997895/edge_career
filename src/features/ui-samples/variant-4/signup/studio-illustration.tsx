"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AiBuddy, EASE, LoopingEditor, SpeechBubble, Tag, type CodeLine, type TagTone } from "../ui";
import styles from "../studio.module.css";

// ASCII only: typed lines are sized in `ch`. Every script has six lines so the editor keeps its height,
// and lines stay within ~31 characters so they fit the editor's width.
const SCRIPTS: CodeLine[][] = [
  [
    [["kw", "import"], ["punc", " { "], ["prop", "ai"], ["punc", " } "], ["kw", "from"], ["str", ' "edge"'], ["punc", ";"]],
    [],
    [["kw", "function "], ["fn", "buildPlan"], ["punc", "("], ["prop", "you"], ["punc", ") {"]],
    [["kw", "  const "], ["prop", "plan"], ["punc", " = "], ["fn", "ai.plan"], ["punc", "("], ["prop", "you"], ["punc", ");"]],
    [["kw", "  return "], ["fn", "plan.next"], ["punc", "();"]],
    [["punc", "}"]],
  ],
  [
    [["kw", "const "], ["prop", "result"], ["punc", " = "], ["fn", "judge.run"], ["punc", "("], ["prop", "code"], ["punc", ");"]],
    [["com", "// 70% tests + 30% AI review"]],
    [["kw", "if "], ["punc", "("], ["prop", "result.score"], ["punc", " >= "], ["num", "85"], ["punc", ") {"]],
    [["fn", "  unlock"], ["punc", "("], ["str", '"next-module"'], ["punc", ");"]],
    [["punc", "}"]],
    [["kw", "return "], ["prop", "result"], ["punc", ";"]],
  ],
  [
    [["kw", "const "], ["prop", "round"], ["punc", " = "], ["fn", "mock"], ["punc", "("], ["str", '"design"'], ["punc", ");"]],
    [["prop", "round.voice"], ["punc", " = "], ["kw", "true"], ["punc", ";"]],
    [],
    [["kw", "const "], ["prop", "card"], ["punc", " = "], ["kw", "await "], ["fn", "round.end"], ["punc", "();"]],
    [["com", "// scorecard from your answers"]],
    [["kw", "return "], ["prop", "card.feedback"], ["punc", ";"]],
  ],
];

const FLOATING: { text: string; tone: TagTone; className: string; dur: number; delay: number }[] = [
  { text: "const", tone: "purple", className: "top-0 left-[4%]", dur: 6, delay: 0 },
  { text: "</>", tone: "indigo", className: "top-1 left-[46%]", dur: 7, delay: -2 },
  { text: "AI", tone: "cyan", className: "top-[38%] -right-1", dur: 6.5, delay: -4 },
  { text: "return", tone: "teal", className: "bottom-0 left-[30%]", dur: 7.5, delay: -1 },
  { text: "=>", tone: "amber", className: "-bottom-1 right-[30%]", dur: 6, delay: -3 },
  { text: "01101", tone: "indigo", className: "top-[44%] -left-3", dur: 8, delay: -5 },
];

const SKILLS: { text: string; tone: TagTone }[] = [
  { text: "DSA", tone: "indigo" },
  { text: "SQL", tone: "cyan" },
  { text: "System design", tone: "purple" },
  { text: "Git", tone: "amber" },
  { text: "LLMs", tone: "teal" },
  { text: "TS", tone: "indigo" },
  { text: "JS", tone: "amber" },
];

/** The coding-studio illustration beside the sign-up form. Everything here is decorative. */
export function StudioIllustration({ className }: { className?: string }) {
  return (
    <motion.section
      aria-label="About Edge Career"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-(--v4-line) bg-linear-to-br from-[oklch(0.95_0.04_295)] via-white to-[oklch(0.95_0.04_220)] p-7 sm:p-10",
        className,
      )}
    >
      <Tag tone="purple">AI-powered coding studio</Tag>
      <h2 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl">
        Build your future{" "}
        <span className="bg-(image:--v4-gradient) bg-clip-text text-transparent">in tech</span>
      </h2>
      <p className="mt-3 max-w-md text-[15px] text-(--v4-muted)">
        Lessons, a code judge, system design and mock interviews in one structured path, with AI feedback at every step.
      </p>

      <div aria-hidden className="relative mt-8 hidden px-2 py-10 sm:block">
        {FLOATING.map((f) => (
          <span
            key={f.text}
            className={cn(styles.floatTag, "absolute z-10", f.className)}
            style={{ "--dur": `${f.dur}s`, "--delay": `${f.delay}s` } as React.CSSProperties}
          >
            <Tag tone={f.tone} mono className="shadow-sm">
              {f.text}
            </Tag>
          </span>
        ))}

        <div className="grid grid-cols-[minmax(0,1fr)_170px] items-start gap-10">
          <LoopingEditor file="career.ts" scripts={SCRIPTS} />
          <div className="relative flex flex-col items-center gap-3 pt-1">
            <AiBuddy size={68} />
            <SpeechBubble className="text-[13px] leading-snug">Hi! I’m your AI mentor. Let’s get you interview-ready.</SpeechBubble>
          </div>
        </div>

        {/* Gradient connection from the mentor (left of its ring) across the gap to the editor's edge,
            with a dot travelling along it. The box spans the 40px gap plus 40px into the mentor column. */}
        <div className="absolute top-[70px] right-[138px] h-[85px] w-20">
          <svg viewBox="0 0 80 85" className="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id="v4-link" x1="1" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--v4-purple)" />
                <stop offset="1" stopColor="var(--v4-cyan)" />
              </linearGradient>
            </defs>
            <path className={styles.flow} d="M80 8 C 40 8, 34 72, 0 78" fill="none" stroke="url(#v4-link)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span
            className={cn(styles.traveller, "size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--v4-purple) shadow-[0_0_10px_var(--v4-purple)]")}
            style={{ "--path": "path('M80 8 C 40 8, 34 72, 0 78')", "--dur": "3.6s" } as React.CSSProperties}
          />
        </div>
      </div>

      <ul aria-label="Skills you'll practise" className="mt-2 hidden flex-wrap gap-2 sm:flex">
        {SKILLS.map((s, i) => (
          <motion.li
            key={s.text}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.07 }}
          >
            <span className={styles.floatTag} style={{ "--dur": `${5 + (i % 3)}s`, "--delay": `${-i}s`, "--bob": "-4px" } as React.CSSProperties}>
              <Tag tone={s.tone}>{s.text}</Tag>
            </span>
          </motion.li>
        ))}
      </ul>

      {/* Phones: just the mentor, no editor */}
      <div aria-hidden className="mt-6 flex items-center gap-3 sm:hidden">
        <AiBuddy size={48} />
        <SpeechBubble className="text-[13px] leading-snug">Hi! I’m your AI mentor. Let’s get you interview-ready.</SpeechBubble>
      </div>
    </motion.section>
  );
}
