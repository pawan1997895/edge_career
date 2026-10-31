"use client";

import { Crosshair } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { SALARY_LABELS, type SalaryBand } from "@/types/user";
import { MAX_COMPANIES } from "@/features/onboarding/steps";
import { commandSound } from "../sound";
import { CountUp, EASE } from "../ui";
import styles from "../command.module.css";
import { SALARY_RANGES } from "./copy";
import { CardFrame, LockCorners, stepChild } from "./parts";

const BANDS = Object.keys(SALARY_LABELS) as SalaryBand[];
const BAR_HEIGHTS = ["40%", "58%", "78%", "100%"];

const monogram = (name: string) => name.slice(0, 2).toUpperCase();

/** Step 3: lock up to three target companies; locked targets fill the slots above the grid. */
export function CompaniesStep({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const full = value.length >= MAX_COMPANIES;

  function toggle(company: string) {
    commandSound.play(value.includes(company) ? "toggle" : "select");
    onChange(value.includes(company) ? value.filter((c) => c !== company) : [...value, company]);
  }

  return (
    <div className="space-y-5">
      <motion.div variants={stepChild} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div aria-hidden className={cn(styles.chamfer, "flex shrink-0 items-center gap-3 bg-(--v2-surface)/85 px-4 py-3 shadow-[inset_0_0_0_1px_var(--v2-line)]")}>
          <Crosshair className="size-5 text-(--v2-amber)" />
          <span>
            <span className={cn(styles.display, "block text-3xl leading-none font-semibold tabular-nums")}>
              <span className="text-(--v2-mint)">
                <CountUp value={value.length} pad={2} duration={0.4} />
              </span>
              <span className="text-muted-foreground">/{String(MAX_COMPANIES).padStart(2, "0")}</span>
            </span>
            <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Targets locked</span>
          </span>
        </div>
        <div aria-hidden className="grid flex-1 grid-cols-3 gap-2">
          {Array.from({ length: MAX_COMPANIES }, (_, i) => {
            const company = value[i];
            return (
              <div
                key={i}
                className={cn(
                  styles.chamfer,
                  "relative flex min-w-0 flex-col justify-center px-3 py-2 [--v2-cut:10px]",
                  company ? "bg-(--v2-mint)/12 shadow-[inset_0_0_0_1px_var(--v2-line-strong)]" : "bg-(--v2-bg)/70 shadow-[inset_0_0_0_1px_var(--v2-line)]",
                )}
              >
                <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">Slot {i + 1}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={company ?? "empty"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className={cn("truncate text-sm", company ? "font-medium text-(--v2-mint)" : "text-muted-foreground/50")}
                  >
                    {company ?? "— empty —"}
                  </motion.span>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={stepChild} role="group" aria-label="Target companies" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((company) => {
          const selected = value.includes(company);
          const disabled = full && !selected;
          return (
            <motion.button
              key={company}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggle(company)}
              whileHover={disabled ? undefined : { y: -2 }}
              whileTap={disabled ? undefined : { scale: 0.96 }}
              className={cn(
                "group relative block text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--v2-mint)",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              <CardFrame active={selected} className="[--v2-cut:9px]" innerClassName="flex items-center gap-2.5 px-2.5 py-2 [--v2-cut:9px]">
                <span
                  aria-hidden
                  className={cn(
                    styles.chamfer,
                    "grid size-8 shrink-0 place-items-center font-mono text-[11px] font-bold transition-colors duration-300 [--v2-cut:6px]",
                    selected ? "bg-(--v2-mint) text-(--v2-ink)" : "bg-(--v2-surface) text-(--v2-mint) shadow-[inset_0_0_0_1px_var(--v2-line)]",
                  )}
                >
                  {monogram(company)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{company}</span>
                  <span aria-hidden className={cn("block font-mono text-[9px] tracking-[0.16em] uppercase", selected ? "text-(--v2-mint)" : "text-muted-foreground/60")}>
                    {selected ? "● Locked" : "Lock target"}
                  </span>
                </span>
              </CardFrame>
              {selected && (
                // One ring burst when a company is locked.
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.12 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 border border-(--v2-mint)"
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.p variants={stepChild} className="font-mono text-xs text-muted-foreground">
        {value.length} of {MAX_COMPANIES} selected
        {full && " · deselect one to choose another"}
      </motion.p>
    </div>
  );
}

/** Step 4: a big compensation readout that counts to the chosen band, picked from rising bars. */
export function SalaryStep({ value, onChange, labelledBy }: { value?: SalaryBand; onChange: (v: SalaryBand) => void; labelledBy: string }) {
  const range = value ? SALARY_RANGES[value] : undefined;

  return (
    <div className="space-y-5">
      <motion.div
        aria-hidden
        variants={stepChild}
        className={cn(styles.chamfer, "bg-(--v2-surface)/85 px-5 py-4 shadow-[inset_0_0_0_1px_var(--v2-line)] sm:px-6 sm:py-5")}
      >
        <span className="block font-mono text-[10px] tracking-[0.18em] text-(--v2-amber) uppercase">Target · total annual compensation</span>
        <span className={cn(styles.display, "mt-2 flex items-baseline gap-1 text-5xl leading-none font-semibold tabular-nums sm:text-6xl")}>
          <span className="text-muted-foreground">₹</span>
          {range ? (
            <span className="text-(--v2-mint)">
              <CountUp value={range[0]} duration={0.7} />
              {range[1] !== null ? (
                <>
                  <span className="text-muted-foreground">–</span>
                  <CountUp value={range[1]} duration={0.7} />
                </>
              ) : (
                "+"
              )}
            </span>
          ) : (
            <span className="text-muted-foreground/50">--</span>
          )}
          <span className="ml-1 text-2xl text-muted-foreground sm:text-3xl">LPA</span>
        </span>
      </motion.div>

      <RadioGroup.Root
        value={value ?? ""}
        onValueChange={(v) => {
          commandSound.play("select");
          onChange(v as SalaryBand);
        }}
        aria-labelledby={labelledBy}
        orientation="horizontal"
        className="grid grid-cols-4 gap-2 sm:gap-3"
      >
        {BANDS.map((band, i) => {
          const active = value === band;
          return (
            <RadioGroup.Item key={band} value={band} asChild>
              <motion.button
                type="button"
                variants={stepChild}
                whileTap={{ scale: 0.97 }}
                className="group relative flex flex-col items-stretch gap-2 text-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--v2-mint)"
              >
                <span className="flex h-32 items-end sm:h-36">
                  <motion.span
                    className={cn(
                      "relative block w-full origin-bottom overflow-hidden transition-[background-color,box-shadow] duration-300",
                      active
                        ? "bg-linear-to-t from-(--v2-mint) to-(--v2-amber) shadow-[0_0_24px_-4px_var(--v2-mint)]"
                        : "bg-(--v2-mint)/10 shadow-[inset_0_0_0_1px_var(--v2-line-strong)] group-hover:bg-(--v2-mint)/20",
                    )}
                    style={{ height: BAR_HEIGHTS[i] }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 + i * 0.07 }}
                  >
                    {active && <span aria-hidden className={styles.cardScan} />}
                  </motion.span>
                </span>
                <span className={cn("font-mono text-[11px] leading-tight sm:text-xs", active ? "font-semibold text-(--v2-mint)" : "text-muted-foreground")}>
                  {SALARY_LABELS[band]}
                </span>
                <LockCorners active={active} />
              </motion.button>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>
      <motion.p variants={stepChild} className="text-xs text-muted-foreground">
        Total annual compensation.
      </motion.p>
    </div>
  );
}
