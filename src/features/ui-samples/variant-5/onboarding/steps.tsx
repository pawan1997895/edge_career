"use client";

import { Briefcase, Check, GraduationCap, Repeat, Route, Sparkles, Timer } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS, type Level, type Persona, type SalaryBand } from "@/types/user";
import { LEVEL_DESCRIPTIONS, MAX_COMPANIES, type OnboardingAnswers } from "@/features/onboarding/steps";
import { neonSound } from "../sound";
import { AiCore, EASE } from "../ui";
import styles from "../neon.module.css";

type Start = NonNullable<OnboardingAnswers["start"]>;

/** Child of the step container: rises in, one after another. */
export const stepChild: Variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;

/** Graphite option card: a neon gradient edge, check pop and sheen when selected. */
function ChoiceCard({
  value,
  active,
  title,
  description,
  icon,
}: {
  value: string;
  active: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <RadioGroup.Item value={value} asChild>
      <motion.button
        type="button"
        variants={stepChild}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        transition={SPRING}
        className={cn(
          "group relative block h-full w-full rounded-2xl p-px text-left outline-none focus-visible:ring-4 focus-visible:ring-(--v5-emerald)/25",
          active ? "bg-(image:--v5-neon) shadow-[0_0_32px_-12px_var(--v5-emerald)]" : "bg-(--v5-line-strong) hover:bg-(--v5-emerald)/40",
        )}
      >
        <span
          className={cn(
            "relative flex h-full items-start gap-3.5 overflow-hidden rounded-[15px] p-4 transition-colors duration-300",
            active ? "bg-[color-mix(in_oklch,var(--v5-emerald)_9%,var(--v5-card))]" : "bg-(--v5-card)",
          )}
        >
          {active && <span aria-hidden className={styles.shine} />}
          {icon && (
            <span
              className={cn(
                "relative grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 [&_svg]:size-5",
                active ? "bg-(image:--v5-gradient) text-(--v5-ink)" : "bg-white/6 text-(--v5-emerald)",
              )}
            >
              {icon}
            </span>
          )}
          <span className="relative min-w-0 flex-1 pt-0.5">
            <span className="block text-[15px] leading-snug font-bold text-white">{title}</span>
            {description && <span className="mt-1 block text-sm text-white/55">{description}</span>}
          </span>
          <span className="relative grid size-6 shrink-0 place-items-center rounded-full border-2 border-white/20 transition-colors duration-300 group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-(--v5-lime)">
            <RadioGroup.Indicator asChild>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 22 }} className="text-(--v5-ink)">
                <Check className="size-3.5" strokeWidth={3} />
              </motion.span>
            </RadioGroup.Indicator>
          </span>
        </span>
      </motion.button>
    </RadioGroup.Item>
  );
}

function onPick<T extends string>(onChange: (v: T) => void) {
  return (v: string) => {
    neonSound.play("select");
    onChange(v as T);
  };
}

const PERSONA_ICONS: Record<Persona, React.ReactNode> = {
  student: <GraduationCap />,
  career_switcher: <Repeat />,
  working_engineer: <Briefcase />,
  senior_engineer: <Sparkles />,
};

export function PersonaStep({ value, onChange, labelledBy }: { value?: Persona; onChange: (v: Persona) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {(Object.keys(PERSONA_LABELS) as Persona[]).map((p) => (
        <ChoiceCard key={p} value={p} active={value === p} title={PERSONA_LABELS[p]} icon={PERSONA_ICONS[p]} />
      ))}
    </RadioGroup.Root>
  );
}

const LEVELS = Object.keys(LEVEL_LABELS) as Level[];

/** Experience as a slider: a glowing thumb glides between four stops along a neon track. */
export function LevelStep({ value, onChange, labelledBy }: { value?: Level; onChange: (v: Level) => void; labelledBy: string }) {
  const selected = value ? LEVELS.indexOf(value) : -1;
  return (
    <div className="space-y-5">
      <RadioGroup.Root
        value={value ?? ""}
        onValueChange={onPick(onChange)}
        aria-labelledby={labelledBy}
        orientation="horizontal"
        className="relative grid grid-cols-4"
      >
        <span aria-hidden className="absolute top-[22px] right-[12.5%] left-[12.5%] h-1.5 -translate-y-1/2 rounded-full bg-white/10" />
        <motion.span
          aria-hidden
          className="absolute top-[22px] left-[12.5%] h-1.5 w-[75%] origin-left -translate-y-1/2 rounded-full bg-(image:--v5-gradient) shadow-[0_0_14px_-2px_var(--v5-emerald)]"
          initial={false}
          animate={{ scaleX: selected <= 0 ? 0 : selected / (LEVELS.length - 1) }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        {LEVELS.map((l, i) => {
          const active = value === l;
          return (
            <RadioGroup.Item key={l} value={l} asChild>
              <motion.button
                type="button"
                variants={stepChild}
                whileTap={{ scale: 0.96 }}
                className="group relative flex flex-col items-center gap-2 rounded-xl px-1 pb-2 text-center outline-none focus-visible:ring-4 focus-visible:ring-(--v5-emerald)/25"
              >
                <span className="relative grid size-11 place-items-center">
                  <span
                    className={cn(
                      "size-3 rounded-full transition-colors duration-300",
                      i <= selected ? "bg-(--v5-emerald)" : "bg-white/25 group-hover:bg-white/50",
                    )}
                  />
                  {active && (
                    <motion.span
                      layoutId="v5-level-thumb"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute inset-0 grid place-items-center rounded-full border-2 border-(--v5-lime) bg-(--v5-bg) shadow-[0_0_22px_-2px_var(--v5-lime)]"
                    >
                      <span className={cn(styles.mono, "text-xs font-bold text-(--v5-lime)")}>L{i}</span>
                    </motion.span>
                  )}
                </span>
                <span className={cn("text-sm font-bold transition-colors", active ? "text-white" : "text-white/60")}>{LEVEL_LABELS[l]}</span>
                <span className="sr-only">{LEVEL_DESCRIPTIONS[l]}</span>
              </motion.button>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      <motion.div
        aria-hidden
        variants={stepChild}
        className="flex min-h-20 items-center gap-4 rounded-2xl border border-(--v5-line-strong) bg-(--v5-bg)/60 px-5 py-4"
      >
        <span className={cn(styles.mono, "text-3xl font-bold", value ? "text-(--v5-emerald)" : "text-white/20")}>{value ? `L${selected}` : "L?"}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value ?? "none"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="min-w-0"
          >
            <span className="block text-sm font-bold text-white">{value ? LEVEL_LABELS[value] : "Slide to your level"}</span>
            <span className="block text-sm text-white/55">{value ? LEVEL_DESCRIPTIONS[value] : "Pick the stop closest to your experience today."}</span>
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function CompaniesStep({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const full = value.length >= MAX_COMPANIES;

  function toggle(company: string) {
    neonSound.play(value.includes(company) ? "toggle" : "select");
    onChange(value.includes(company) ? value.filter((c) => c !== company) : [...value, company]);
  }

  return (
    <div>
      <motion.div variants={stepChild} role="group" aria-label="Target companies" className="flex flex-wrap gap-2.5">
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
              whileTap={disabled ? undefined : { scale: 0.95 }}
              transition={SPRING}
              className={cn(
                "relative h-10 rounded-full p-px text-sm font-semibold outline-none focus-visible:ring-4 focus-visible:ring-(--v5-emerald)/25",
                selected ? "bg-(image:--v5-neon) shadow-[0_0_22px_-8px_var(--v5-emerald)]" : "bg-(--v5-line-strong) hover:bg-(--v5-emerald)/40",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              <span
                className={cn(
                  "flex h-full items-center gap-1.5 rounded-full px-4 transition-colors duration-300",
                  selected ? "bg-[color-mix(in_oklch,var(--v5-emerald)_12%,var(--v5-card))] text-white" : "bg-(--v5-card) text-white/80",
                )}
              >
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.span
                      key="check"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden text-(--v5-lime)"
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
                {company}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
      <motion.div variants={stepChild} className="mt-5 flex items-center gap-3 text-sm font-medium text-white/55">
        <span aria-hidden className="flex gap-1.5">
          {Array.from({ length: MAX_COMPANIES }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-7 rounded-full transition-[background-color,box-shadow] duration-300",
                i < value.length ? "bg-(image:--v5-gradient) shadow-[0_0_10px_-2px_var(--v5-emerald)]" : "bg-white/10",
              )}
            />
          ))}
        </span>
        <span>
          {value.length} of {MAX_COMPANIES} selected
          {full && " · deselect one to choose another"}
        </span>
      </motion.div>
    </div>
  );
}

export function SalaryStep({ value, onChange, labelledBy }: { value?: SalaryBand; onChange: (v: SalaryBand) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {(Object.keys(SALARY_LABELS) as SalaryBand[]).map((band) => (
        <ChoiceCard
          key={band}
          value={band}
          active={value === band}
          title={<span className="text-xl tracking-tight">{SALARY_LABELS[band]}</span>}
          description="Total annual compensation"
        />
      ))}
    </RadioGroup.Root>
  );
}

export function StartStep({ value, onChange, labelledBy }: { value?: Start; onChange: (v: Start) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3">
      <ChoiceCard
        value="placement"
        active={value === "placement"}
        icon={<Timer />}
        title="Take the placement test (recommended)"
        description="About 90 minutes. Test out of the modules you already know and start where you’ll actually learn something."
      />
      <ChoiceCard
        value="module1"
        active={value === "module1"}
        icon={<Route />}
        title="Start from Module 1"
        description="Work through everything in order. You can still take the placement test later from Assessments."
      />
    </RadioGroup.Root>
  );
}

export function SummaryStep({ answers }: { answers: OnboardingAnswers }) {
  const rows = [
    { label: "About you", value: answers.persona ? PERSONA_LABELS[answers.persona] : "—" },
    { label: "Experience", value: answers.level ? LEVEL_LABELS[answers.level] : "—" },
    { label: "Target companies", value: answers.companies.join(", ") || "—" },
    { label: "Target salary", value: answers.salary ? SALARY_LABELS[answers.salary] : "—" },
    { label: "Starting point", value: answers.start === "placement" ? "Placement test" : "Module 1" },
  ];
  return (
    <div className="space-y-4">
      <motion.div
        variants={stepChild}
        className="flex items-center gap-4 rounded-2xl border border-(--v5-emerald)/25 bg-[color-mix(in_oklch,var(--v5-emerald)_8%,var(--v5-card))] p-4"
      >
        <AiCore size={52} pulse={1} />
        <div>
          <p className="text-[15px] font-bold text-white">Path compiled. Your learning plan is ready</p>
          <p className="text-sm text-white/55">We’ll use your targets to set readiness bars on your dashboard and to pick practice problems.</p>
        </div>
      </motion.div>
      <motion.dl variants={stepChild} className="divide-y divide-(--v5-line) overflow-hidden rounded-2xl border border-(--v5-line-strong) bg-(--v5-bg)/50">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-sm text-white/50">{row.label}</dt>
            <dd className="text-sm font-bold text-white sm:text-right">{row.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
