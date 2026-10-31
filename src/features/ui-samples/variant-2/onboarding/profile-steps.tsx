"use client";

import { Briefcase, GraduationCap, Repeat, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, type Level, type Persona } from "@/types/user";
import { LEVEL_DESCRIPTIONS } from "@/features/onboarding/steps";
import { commandSound } from "../sound";
import { CountUp, EASE } from "../ui";
import styles from "../command.module.css";
import { CardFrame, CardTag, LockCorners, stepChild } from "./parts";

const PERSONAS: { id: Persona; code: string; icon: LucideIcon }[] = [
  { id: "student", code: "Student", icon: GraduationCap },
  { id: "career_switcher", code: "Switcher", icon: Repeat },
  { id: "working_engineer", code: "Engineer", icon: Briefcase },
  { id: "senior_engineer", code: "Senior", icon: Sparkles },
];

const LEVELS = Object.keys(LEVEL_LABELS) as Level[];

const optionButton =
  "group relative block w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--v2-mint)";

/** Step 1: four "operator profile" cards, selected with a target lock. */
export function PersonaStep({ value, onChange, labelledBy }: { value?: Persona; onChange: (v: Persona) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root
      value={value ?? ""}
      onValueChange={(v) => {
        commandSound.play("select");
        onChange(v as Persona);
      }}
      aria-labelledby={labelledBy}
      className="grid gap-3 sm:grid-cols-2"
    >
      {PERSONAS.map(({ id, code, icon: Icon }, i) => {
        const active = value === id;
        return (
          <RadioGroup.Item key={id} value={id} asChild>
            <motion.button type="button" variants={stepChild} whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} className={optionButton}>
              <CardFrame active={active} innerClassName="flex flex-col gap-3 p-4">
                <CardTag index={i} code={code} active={active} />
                <span className="flex items-center gap-3.5">
                  <span
                    className={cn(
                      styles.chamfer,
                      "grid size-12 shrink-0 place-items-center transition-colors duration-300 [--v2-cut:9px] [&_svg]:size-5.5",
                      active ? "bg-(--v2-mint) text-(--v2-ink)" : "bg-(--v2-surface) text-(--v2-mint) shadow-[inset_0_0_0_1px_var(--v2-line)]",
                    )}
                  >
                    <Icon />
                  </span>
                  <span className="text-[15px] leading-snug font-medium">{PERSONA_LABELS[id]}</span>
                </span>
                <span aria-hidden className="font-mono text-[11px] text-muted-foreground">
                  profile.type = <span className="text-(--v2-mint)">&quot;{id}&quot;</span>
                </span>
              </CardFrame>
              <LockCorners active={active} />
            </motion.button>
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}

/** Step 2: a calibration scale from Beginner to SDE 3 with a power bar and a level readout. */
export function LevelStep({ value, onChange, labelledBy }: { value?: Level; onChange: (v: Level) => void; labelledBy: string }) {
  const selected = value ? LEVELS.indexOf(value) : -1;

  return (
    <div className="space-y-5">
      <RadioGroup.Root
        value={value ?? ""}
        onValueChange={(v) => {
          commandSound.play("select");
          onChange(v as Level);
        }}
        aria-labelledby={labelledBy}
        orientation="horizontal"
        className="relative grid gap-3 sm:grid-cols-4 sm:gap-2"
      >
        {/* Power bar behind the nodes (wider screens) */}
        <span aria-hidden className="absolute top-[30px] right-[12.5%] left-[12.5%] hidden h-0.5 bg-(--v2-line) sm:block" />
        <motion.span
          aria-hidden
          className="absolute top-[30px] left-[12.5%] hidden h-0.5 w-[75%] origin-left bg-linear-to-r from-(--v2-mint) to-(--v2-amber) shadow-[0_0_12px_var(--v2-mint)] sm:block"
          initial={false}
          animate={{ scaleX: selected <= 0 ? 0 : selected / (LEVELS.length - 1) }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        {LEVELS.map((level, i) => {
          const active = value === level;
          const reached = selected >= i;
          return (
            <RadioGroup.Item key={level} value={level} asChild>
              <motion.button
                type="button"
                variants={stepChild}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  optionButton,
                  "flex items-center gap-4 p-2 sm:flex-col sm:gap-3 sm:text-center",
                )}
              >
                <span className="relative grid size-11 shrink-0 place-items-center">
                  <span
                    className={cn(
                      "absolute inset-1.5 rotate-45 border-2 transition-all duration-300",
                      reached ? "border-(--v2-mint) bg-(--v2-mint)" : "border-(--v2-line-strong) bg-(--v2-bg) group-hover:border-(--v2-mint)",
                      active && "shadow-[0_0_22px_var(--v2-mint)]",
                    )}
                  />
                  {active && <span className={cn(styles.pulse, "absolute inset-0 rotate-45 border border-(--v2-mint)")} />}
                  <span className={cn("relative font-mono text-[11px] font-bold", reached ? "text-(--v2-ink)" : "text-muted-foreground")}>
                    L{i}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-sm font-medium", active ? "text-(--v2-mint)" : "text-foreground")}>{LEVEL_LABELS[level]}</span>
                  <span className="block text-xs text-muted-foreground sm:sr-only">{LEVEL_DESCRIPTIONS[level]}</span>
                </span>
              </motion.button>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      {/* Readout of the chosen level (the radio buttons already announce it, so this is visual only) */}
      <motion.div
        aria-hidden
        variants={stepChild}
        className={cn(styles.chamfer, "hidden items-center gap-5 bg-(--v2-surface)/85 px-5 py-4 shadow-[inset_0_0_0_1px_var(--v2-line)] sm:flex")}
      >
        <span className={cn(styles.display, "text-5xl leading-none font-semibold text-(--v2-mint) tabular-nums")}>
          {value ? <CountUp value={selected} pad={2} duration={0.6} /> : "--"}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[10px] tracking-[0.18em] text-(--v2-amber) uppercase">Calibrated level</span>
          <span className="mt-1 block text-sm text-foreground">{value ? LEVEL_LABELS[value] : "Awaiting selection"}</span>
          <span className="block text-sm text-muted-foreground">
            {value ? LEVEL_DESCRIPTIONS[value] : "Choose the role closest to your experience today."}
          </span>
        </span>
      </motion.div>
    </div>
  );
}
