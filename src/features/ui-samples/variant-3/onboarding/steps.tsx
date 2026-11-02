"use client";

import { Briefcase, Check, GraduationCap, Repeat, Route, Sparkles, Timer } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS, type Level, type Persona, type SalaryBand } from "@/types/user";
import { LEVEL_DESCRIPTIONS, MAX_COMPANIES, type OnboardingAnswers } from "@/features/onboarding/steps";
import { minimalSound } from "../sound";
import { EASE } from "../ui";
import styles from "../minimal.module.css";

type Start = NonNullable<OnboardingAnswers["start"]>;

/** Child of the step container: rises in, one after another. */
export const stepChild: Variants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const SPRING = { type: "spring", stiffness: 500, damping: 32 } as const;

const choiceButton =
  "group relative block h-full w-full rounded-2xl p-px text-left outline-none focus-visible:ring-2 focus-visible:ring-(--v3-cyan) focus-visible:ring-offset-2 focus-visible:ring-offset-(--v3-bg)";

/** Thin edge that brightens on hover and turns into a gradient when selected, around a soft surface. */
function ChoiceFrame({ active, className, children }: { active: boolean; className?: string; children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden className="absolute inset-0 rounded-2xl bg-(--v3-line) transition-colors duration-300 group-hover:bg-(--v3-line-strong)" />
      <span
        aria-hidden
        className={cn("absolute inset-0 rounded-2xl bg-(image:--v3-gradient) transition-opacity duration-300", active ? "opacity-100" : "opacity-0")}
      />
      <span
        className={cn(
          "relative flex h-full overflow-hidden rounded-[15px] transition-colors duration-300",
          active ? "bg-[color-mix(in_oklch,var(--v3-blue)_11%,var(--v3-surface))]" : "bg-(--v3-surface)",
          className,
        )}
      >
        {active && <span aria-hidden className={styles.shine} />}
        {children}
      </span>
    </>
  );
}

function CheckBubble() {
  return (
    <span className="relative grid size-5 shrink-0 place-items-center rounded-full border border-(--v3-line-strong) transition-colors duration-300 group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-white">
      <RadioGroup.Indicator asChild>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 24 }} className="text-(--v3-bg)">
          <Check className="size-3" strokeWidth={3} />
        </motion.span>
      </RadioGroup.Indicator>
    </span>
  );
}

function ChoiceCard({
  value,
  active,
  title,
  description,
  icon,
  titleClassName,
}: {
  value: string;
  active: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  titleClassName?: string;
}) {
  return (
    <RadioGroup.Item value={value} asChild>
      <motion.button
        type="button"
        variants={stepChild}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={SPRING}
        className={cn(choiceButton, active && "shadow-[0_18px_44px_-22px_var(--v3-blue)]")}
      >
        <ChoiceFrame active={active} className="items-start gap-3.5 p-4">
          {icon && (
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 [&_svg]:size-[18px]",
                active ? "bg-white/12 text-white" : "bg-white/[0.05] text-(--v3-cyan)",
              )}
            >
              {icon}
            </span>
          )}
          <span className="min-w-0 flex-1 pt-0.5">
            <span className={cn("block text-[15px] font-medium", titleClassName)}>{title}</span>
            {description && <span className="mt-1 block text-sm text-muted-foreground">{description}</span>}
          </span>
          <CheckBubble />
        </ChoiceFrame>
      </motion.button>
    </RadioGroup.Item>
  );
}

function onPick<T extends string>(onChange: (v: T) => void) {
  return (v: string) => {
    minimalSound.play("select");
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

export function LevelStep({ value, onChange, labelledBy }: { value?: Level; onChange: (v: Level) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {(Object.keys(LEVEL_LABELS) as Level[]).map((l, i) => (
        <ChoiceCard
          key={l}
          value={l}
          active={value === l}
          title={LEVEL_LABELS[l]}
          description={LEVEL_DESCRIPTIONS[l]}
          icon={<span className="font-mono text-xs font-semibold">L{i}</span>}
        />
      ))}
    </RadioGroup.Root>
  );
}

export function CompaniesStep({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const full = value.length >= MAX_COMPANIES;

  function toggle(company: string) {
    minimalSound.play(value.includes(company) ? "toggle" : "select");
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
              whileHover={disabled ? undefined : { y: -1 }}
              whileTap={disabled ? undefined : { scale: 0.96 }}
              transition={SPRING}
              className={cn(
                "group relative h-10 rounded-full p-px text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--v3-cyan) focus-visible:ring-offset-2 focus-visible:ring-offset-(--v3-bg)",
                selected && "shadow-[0_10px_30px_-16px_var(--v3-blue)]",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              <span aria-hidden className="absolute inset-0 rounded-full bg-(--v3-line) transition-colors group-hover:bg-(--v3-line-strong)" />
              <span
                aria-hidden
                className={cn("absolute inset-0 rounded-full bg-(image:--v3-gradient) transition-opacity duration-300", selected ? "opacity-100" : "opacity-0")}
              />
              <span
                className={cn(
                  "relative flex h-full items-center gap-1.5 rounded-full px-4 transition-colors duration-300",
                  selected ? "bg-[color-mix(in_oklch,var(--v3-blue)_14%,var(--v3-surface))] text-foreground" : "bg-(--v3-surface) text-foreground/85",
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
                      className="overflow-hidden text-(--v3-cyan)"
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
      <motion.div variants={stepChild} className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
        <span aria-hidden className="flex gap-1.5">
          {Array.from({ length: MAX_COMPANIES }, (_, i) => (
            <span
              key={i}
              className={cn("h-1.5 w-6 rounded-full transition-colors duration-300", i < value.length ? "bg-(image:--v3-gradient)" : "bg-white/10")}
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
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid grid-cols-2 gap-3">
      {(Object.keys(SALARY_LABELS) as SalaryBand[]).map((band) => (
        <ChoiceCard
          key={band}
          value={band}
          active={value === band}
          title={SALARY_LABELS[band]}
          titleClassName="text-xl font-semibold tracking-tight"
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
        className="flex items-center gap-3.5 rounded-2xl border border-(--v3-cyan)/20 bg-(--v3-cyan)/[0.06] p-4"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-8 shrink-0">
          <circle cx="12" cy="12" r="11" fill="none" stroke="var(--v3-cyan)" strokeOpacity="0.35" strokeWidth="1.5" />
          <motion.path
            d="M7 12.5l3.2 3.2L17 9"
            fill="none"
            stroke="var(--v3-cyan)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          />
        </svg>
        <div>
          <p className="text-sm font-medium">Your learning path is ready</p>
          <p className="text-sm text-muted-foreground">
            We’ll use your targets to set readiness bars on your dashboard and to pick practice problems.
          </p>
        </div>
      </motion.div>
      <motion.dl variants={stepChild} className="divide-y divide-(--v3-line) rounded-2xl border border-(--v3-line) bg-(--v3-surface)">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-medium sm:text-right">{row.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
