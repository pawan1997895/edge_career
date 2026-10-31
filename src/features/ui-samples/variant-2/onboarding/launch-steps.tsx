"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS } from "@/types/user";
import type { OnboardingAnswers } from "@/features/onboarding/steps";
import { scheduleLines, TypedLine, type CodeLine } from "../code";
import { commandSound } from "../sound";
import { CountUp } from "../ui";
import styles from "../command.module.css";
import { CardFrame, LockCorners, stepChild } from "./parts";

type Start = NonNullable<OnboardingAnswers["start"]>;

const VECTORS: {
  id: Start;
  code: string;
  badge: string;
  big: string;
  unit: string;
  title: string;
  description: string;
}[] = [
  {
    id: "placement",
    code: "Vector A",
    badge: "Recommended",
    big: "90",
    unit: "min",
    title: "Take the placement test (recommended)",
    description: "About 90 minutes. Test out of the modules you already know and start where you’ll actually learn something.",
  },
  {
    id: "module1",
    code: "Vector B",
    badge: "Sequential",
    big: "01",
    unit: "module",
    title: "Start from Module 1",
    description: "Work through everything in order. You can still take the placement test later from Assessments.",
  },
];

function RouteNode({ label, tone }: { label: string; tone: "active" | "done" | "idle" }) {
  return (
    <span
      className={cn(
        styles.chamfer,
        "grid h-7 min-w-7 place-items-center px-1 font-mono text-[9px] font-bold [--v2-cut:5px]",
        tone === "active" && "bg-(--v2-mint) text-(--v2-ink)",
        tone === "done" && "bg-(--v2-amber)/20 text-(--v2-amber)",
        tone === "idle" && "bg-(--v2-surface) text-muted-foreground shadow-[inset_0_0_0_1px_var(--v2-line)]",
      )}
    >
      {tone === "done" ? <Check className="size-3" strokeWidth={3} /> : label}
    </span>
  );
}

const Arrow = () => <span className="text-[10px] text-(--v2-mint)/60">▸</span>;

/** Step 5: two launch vectors with a small route diagram each. */
export function StartStep({
  value,
  onChange,
  labelledBy,
  modules,
}: {
  value?: Start;
  onChange: (v: Start) => void;
  labelledBy: string;
  modules: string[];
}) {
  return (
    <RadioGroup.Root
      value={value ?? ""}
      onValueChange={(v) => {
        commandSound.play("select");
        onChange(v as Start);
      }}
      aria-labelledby={labelledBy}
      className="grid gap-4 sm:grid-cols-2"
    >
      {VECTORS.map((vector) => {
        const active = value === vector.id;
        return (
          <RadioGroup.Item key={vector.id} value={vector.id} asChild>
            <motion.button
              type="button"
              variants={stepChild}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.985 }}
              className="group relative block w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--v2-mint)"
            >
              <CardFrame active={active} innerClassName="flex h-full flex-col gap-3 p-5">
                <span aria-hidden className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase">
                  <span className="text-(--v2-amber)">{vector.code}</span>
                  <span className="border border-(--v2-line-strong) px-1.5 py-px text-(--v2-mint)">{vector.badge}</span>
                  <span className={cn("ml-auto", active ? "text-(--v2-mint)" : "text-muted-foreground/60")}>{active ? "● Locked" : "Select"}</span>
                </span>
                <span aria-hidden className={cn(styles.display, "flex items-baseline gap-2 leading-none")}>
                  <span className={cn("text-5xl font-semibold", active ? "text-(--v2-mint)" : "text-foreground")}>{vector.big}</span>
                  <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">{vector.unit}</span>
                </span>
                <span className="text-[15px] font-medium">{vector.title}</span>
                <span className="text-sm text-muted-foreground">{vector.description}</span>
                <span aria-hidden className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-(--v2-line) pt-3">
                  {vector.id === "placement" ? (
                    <>
                      <RouteNode label="Test" tone="active" />
                      <Arrow />
                      <RouteNode label="M1" tone="done" />
                      <RouteNode label="M2" tone="done" />
                      <Arrow />
                      <RouteNode label="M3" tone="idle" />
                      <span className="ml-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">skip what you know</span>
                    </>
                  ) : (
                    <>
                      {modules.slice(0, 6).map((_, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          {i > 0 && <Arrow />}
                          <RouteNode label={`M${i + 1}`} tone={i === 0 ? "active" : "idle"} />
                        </span>
                      ))}
                    </>
                  )}
                </span>
                {vector.id === "module1" && modules[0] && (
                  <span aria-hidden className="-mt-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    Module 1 · {modules[0]}
                  </span>
                )}
              </CardFrame>
              <LockCorners active={active} />
            </motion.button>
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}

/** Step 6: a compile console that types a build log, beside a plain summary of every answer. */
export function CompileStep({ answers }: { answers: OnboardingAnswers }) {
  const startLabel = answers.start === "placement" ? "Placement test" : "Module 1";
  const rows = [
    { label: "About you", value: answers.persona ? PERSONA_LABELS[answers.persona] : "—" },
    { label: "Experience", value: answers.level ? LEVEL_LABELS[answers.level] : "—" },
    { label: "Target companies", value: answers.companies.join(", ") || "—" },
    { label: "Target salary", value: answers.salary ? SALARY_LABELS[answers.salary] : "—" },
    { label: "Starting point", value: startLabel },
  ];
  // ASCII only: typed lines are sized in `ch`, and symbols outside the mono font's subset would overflow.
  const log: CodeLine[] = [
    [["kw", "$ "], ["fn", "path.compile"], ["plain", " --profile"]],
    [["str", "[ok] "], ["plain", "identity ..... "], ["num", answers.persona ?? "-"]],
    [["str", "[ok] "], ["plain", "calibration .. "], ["num", answers.level ? LEVEL_LABELS[answers.level] : "-"]],
    [["str", "[ok] "], ["plain", "targets ...... "], ["num", `${answers.companies.length} locked`]],
    [["str", "[ok] "], ["plain", "compensation . "], ["num", answers.salary ? `${answers.salary} LPA` : "-"]],
    [["str", "[ok] "], ["plain", "launch ....... "], ["num", startLabel.toLowerCase()]],
    [["kw", "> "], ["str", "path compiled, ready"]],
  ];
  const { rows: timing, total } = scheduleLines(log, { start: 300, cps: 60, gap: 140 });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div
        aria-hidden
        variants={stepChild}
        className={cn(styles.chamfer, "flex flex-col bg-(--v2-bg)/92 shadow-[inset_0_0_0_1px_var(--v2-line-strong)]")}
      >
        <div className="flex items-center justify-between border-b border-(--v2-line) px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase">
          <span className="text-(--v2-mint)">Compiling learning path</span>
          <span className={cn(styles.display, "text-base font-semibold text-foreground tabular-nums")}>
            <CountUp value={100} pad={3} duration={total / 1000} />%
          </span>
        </div>
        <div className="h-1 bg-(--v2-line)">
          <motion.div
            className="h-full origin-left bg-linear-to-r from-(--v2-mint) to-(--v2-amber) shadow-[0_0_12px_var(--v2-mint)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: total / 1000, ease: "easeInOut" }}
          />
        </div>
        <div className="space-y-0.5 px-4 py-3 font-mono text-[11.5px] leading-6">
          {log.map((line, i) => (
            <div key={i} className="flex overflow-hidden whitespace-pre">
              <TypedLine line={line} start={timing[i]!.start} dur={timing[i]!.dur} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.dl
        variants={stepChild}
        className={cn(styles.chamfer, "divide-y divide-(--v2-line) bg-(--v2-surface)/85 shadow-[inset_0_0_0_1px_var(--v2-line)]")}
      >
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 px-4 py-2.5">
            <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{row.label}</dt>
            <dd className="text-sm font-medium">{row.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
