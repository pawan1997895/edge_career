"use client";

import { Briefcase, Check, CodeXml, Crown, GraduationCap, Layers, Repeat, Route, Sparkles, Sprout, Timer } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS, type Level, type Persona, type SalaryBand } from "@/types/user";
import { LEVEL_DESCRIPTIONS, MAX_COMPANIES, type OnboardingAnswers } from "@/features/onboarding/steps";
import { studioSound } from "../sound";
import { AiBuddy, EASE, type TagTone } from "../ui";
import { useReducedMotion } from "../use-reduced-motion";
import styles from "../studio.module.css";

type Start = NonNullable<OnboardingAnswers["start"]>;

/** Child of the step container: rises in, one after another. */
export const stepChild: Variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;

const TILE: Record<TagTone, string> = {
  indigo: "bg-[oklch(0.95_0.04_280)] text-(--v4-indigo)",
  purple: "bg-[oklch(0.95_0.04_305)] text-(--v4-purple)",
  cyan: "bg-[oklch(0.95_0.04_222)] text-[oklch(0.52_0.12_225)]",
  amber: "bg-[oklch(0.96_0.05_80)] text-[oklch(0.55_0.13_65)]",
  teal: "bg-[oklch(0.95_0.04_175)] text-[oklch(0.5_0.1_175)]",
};

function ChoiceCard({
  value,
  active,
  title,
  description,
  icon,
  tone,
}: {
  value: string;
  active: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon: React.ReactNode;
  tone: TagTone;
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
          "group relative flex h-full w-full items-start gap-3.5 overflow-hidden rounded-2xl border-2 bg-white p-4 text-left outline-none transition-[border-color,box-shadow,background-color] duration-300",
          "focus-visible:ring-4 focus-visible:ring-(--v4-indigo)/20",
          active
            ? "border-(--v4-indigo) bg-[oklch(0.985_0.015_290)] shadow-[0_16px_36px_-18px_var(--v4-indigo)]"
            : "border-(--v4-line) shadow-[0_4px_14px_-10px_oklch(0.4_0.1_285/0.3)] hover:border-(--v4-indigo)/35 hover:shadow-[0_14px_30px_-18px_var(--v4-indigo)]",
        )}
      >
        {active && <span aria-hidden className={styles.shine} />}
        <span
          className={cn(
            "relative grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 [&_svg]:size-5",
            active ? "bg-(image:--v4-gradient) text-white" : TILE[tone],
          )}
        >
          {icon}
        </span>
        <span className="relative min-w-0 flex-1 pt-0.5">
          <span className="block text-[15px] leading-snug font-bold">{title}</span>
          {description && <span className="mt-1 block text-sm text-(--v4-muted)">{description}</span>}
        </span>
        <span className="relative grid size-6 shrink-0 place-items-center rounded-full border-2 border-(--v4-line) transition-colors duration-300 group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-(image:--v4-gradient)">
          <RadioGroup.Indicator asChild>
            <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 22 }} className="text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </motion.span>
          </RadioGroup.Indicator>
        </span>
      </motion.button>
    </RadioGroup.Item>
  );
}

function onPick<T extends string>(onChange: (v: T) => void) {
  return (v: string) => {
    studioSound.play("select");
    onChange(v as T);
  };
}

const PERSONAS: { id: Persona; icon: React.ReactNode; tone: TagTone }[] = [
  { id: "student", icon: <GraduationCap />, tone: "indigo" },
  { id: "career_switcher", icon: <Repeat />, tone: "cyan" },
  { id: "working_engineer", icon: <Briefcase />, tone: "purple" },
  { id: "senior_engineer", icon: <Sparkles />, tone: "amber" },
];

export function PersonaStep({ value, onChange, labelledBy }: { value?: Persona; onChange: (v: Persona) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {PERSONAS.map((p) => (
        <ChoiceCard key={p.id} value={p.id} active={value === p.id} title={PERSONA_LABELS[p.id]} icon={p.icon} tone={p.tone} />
      ))}
    </RadioGroup.Root>
  );
}

const LEVELS: { id: Level; icon: React.ReactNode; tone: TagTone }[] = [
  { id: "beginner", icon: <Sprout />, tone: "teal" },
  { id: "sde1", icon: <CodeXml />, tone: "cyan" },
  { id: "sde2", icon: <Layers />, tone: "indigo" },
  { id: "sde3", icon: <Crown />, tone: "purple" },
];

export function LevelStep({ value, onChange, labelledBy }: { value?: Level; onChange: (v: Level) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {LEVELS.map((l) => (
        <ChoiceCard
          key={l.id}
          value={l.id}
          active={value === l.id}
          title={LEVEL_LABELS[l.id]}
          description={LEVEL_DESCRIPTIONS[l.id]}
          icon={l.icon}
          tone={l.tone}
        />
      ))}
    </RadioGroup.Root>
  );
}

const MONO_TONES: TagTone[] = ["indigo", "cyan", "purple", "amber", "teal"];

export function CompaniesStep({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const full = value.length >= MAX_COMPANIES;

  function toggle(company: string) {
    studioSound.play(value.includes(company) ? "toggle" : "select");
    onChange(value.includes(company) ? value.filter((c) => c !== company) : [...value, company]);
  }

  return (
    <div>
      <motion.div variants={stepChild} role="group" aria-label="Target companies" className="flex flex-wrap gap-2.5">
        {options.map((company, i) => {
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
                "inline-flex h-11 items-center gap-2 rounded-full border-2 bg-white py-1 pr-4 pl-1.5 text-sm font-semibold outline-none transition-[border-color,box-shadow,background-color] duration-300 focus-visible:ring-4 focus-visible:ring-(--v4-indigo)/20",
                selected
                  ? "border-(--v4-indigo) bg-[oklch(0.985_0.015_290)] shadow-[0_10px_24px_-14px_var(--v4-indigo)]"
                  : "border-(--v4-line) hover:border-(--v4-indigo)/35",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-7 place-items-center rounded-full text-[11px] font-extrabold transition-colors duration-300",
                  selected ? "bg-(image:--v4-gradient) text-white" : TILE[MONO_TONES[i % MONO_TONES.length]!],
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {selected ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 520, damping: 24 }}>
                      <Check className="size-3.5" strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <motion.span key="letter" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                      {company[0]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {company}
            </motion.button>
          );
        })}
      </motion.div>
      <motion.div variants={stepChild} className="mt-5 flex items-center gap-3 text-sm font-medium text-(--v4-muted)">
        <span aria-hidden className="flex gap-1.5">
          {Array.from({ length: MAX_COMPANIES }, (_, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ scale: i < value.length ? 1 : 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className={cn("h-2 w-7 rounded-full transition-colors duration-300", i < value.length ? "bg-(image:--v4-gradient)" : "bg-(--v4-line)")}
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

/** A tiny rising-bars meter: `level` of 4 bars filled. */
function Meter({ level }: { level: number }) {
  return (
    <span className="flex h-5 items-end gap-0.5">
      {[0.35, 0.55, 0.78, 1].map((h, i) => (
        <span key={i} className={cn("w-1.5 rounded-sm", i < level ? "bg-current" : "bg-current opacity-25")} style={{ height: `${h * 100}%` }} />
      ))}
    </span>
  );
}

const BANDS: { id: SalaryBand; tone: TagTone }[] = [
  { id: "10-20", tone: "teal" },
  { id: "20-35", tone: "cyan" },
  { id: "35-50", tone: "indigo" },
  { id: "50+", tone: "purple" },
];

export function SalaryStep({ value, onChange, labelledBy }: { value?: SalaryBand; onChange: (v: SalaryBand) => void; labelledBy: string }) {
  return (
    <RadioGroup.Root value={value ?? ""} onValueChange={onPick(onChange)} aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {BANDS.map((b, i) => (
        <ChoiceCard
          key={b.id}
          value={b.id}
          active={value === b.id}
          title={<span className="text-lg">{SALARY_LABELS[b.id]}</span>}
          description="Total annual compensation"
          icon={<Meter level={i + 1} />}
          tone={b.tone}
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
        tone="indigo"
        title="Take the placement test (recommended)"
        description="About 90 minutes. Test out of the modules you already know and start where you’ll actually learn something."
      />
      <ChoiceCard
        value="module1"
        active={value === "module1"}
        icon={<Route />}
        tone="cyan"
        title="Start from Module 1"
        description="Work through everything in order. You can still take the placement test later from Assessments."
      />
    </RadioGroup.Root>
  );
}

const BURST = ["{}", "</>", "=>", "AI", "JS", "TS", "01", "fn()", "[]", "&&", "10", "=="] as const;

/** One-time burst of code symbols from the mentor when the plan is ready. */
function CodeBurst() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 left-7 size-0">
      {BURST.map((symbol, i) => {
        const angle = (i / BURST.length) * Math.PI * 2;
        const distance = 70 + (i % 3) * 22;
        return (
          <motion.span
            key={symbol}
            className={cn(styles.mono, "absolute -translate-x-1/2 -translate-y-1/2 text-xs font-bold", i % 2 ? "text-(--v4-purple)" : "text-(--v4-cyan)")}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
            animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 + (i % 4) * 0.04 }}
          >
            {symbol}
          </motion.span>
        );
      })}
    </span>
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
        className="relative flex items-center gap-4 rounded-2xl bg-linear-to-r from-[oklch(0.95_0.04_295)] to-[oklch(0.95_0.04_222)] p-4"
      >
        <CodeBurst />
        <AiBuddy size={52} />
        <div>
          <p className="text-[15px] font-bold">Your learning path is ready</p>
          <p className="text-sm text-(--v4-muted)">
            We’ll use your targets to set readiness bars on your dashboard and to pick practice problems.
          </p>
        </div>
      </motion.div>
      <motion.dl variants={stepChild} className="divide-y divide-(--v4-line) overflow-hidden rounded-2xl border border-(--v4-line) bg-white">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-sm text-(--v4-muted)">{row.label}</dt>
            <dd className="text-sm font-bold sm:text-right">{row.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
