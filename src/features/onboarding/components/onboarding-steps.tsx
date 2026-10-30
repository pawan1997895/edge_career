"use client";

import { Briefcase, Building, Check, GraduationCap, Repeat, Route, Sparkles, Target, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RadioGroup } from "@/components/ui/radio-group";
import { PRESS_SPRING, stepItem } from "@/components/ai-theme/presets";
import { cn } from "@/lib/utils";
import {
  LEVEL_LABELS,
  PERSONA_LABELS,
  SALARY_LABELS,
  type Level,
  type Persona,
  type SalaryBand,
} from "@/types/user";
import { LEVEL_DESCRIPTIONS, MAX_COMPANIES, type OnboardingAnswers } from "@/features/onboarding/steps";
import { OptionCard } from "./option-card";

const PERSONA_ICONS: Record<Persona, React.ReactNode> = {
  student: <GraduationCap />,
  career_switcher: <Repeat />,
  working_engineer: <Briefcase />,
  senior_engineer: <Sparkles />,
};

export function PersonaStep({ value, onChange }: { value?: Persona; onChange: (v: Persona) => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as Persona)}>
      {(Object.keys(PERSONA_LABELS) as Persona[]).map((p) => (
        <OptionCard key={p} value={p} title={PERSONA_LABELS[p]} icon={PERSONA_ICONS[p]} />
      ))}
    </RadioGroup>
  );
}

export function LevelStep({ value, onChange }: { value?: Level; onChange: (v: Level) => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as Level)} className="sm:grid-cols-2">
      {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
        <OptionCard key={l} value={l} title={LEVEL_LABELS[l]} description={LEVEL_DESCRIPTIONS[l]} />
      ))}
    </RadioGroup>
  );
}

export function CompaniesStep({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const full = value.length >= MAX_COMPANIES;
  function toggle(company: string) {
    onChange(value.includes(company) ? value.filter((c) => c !== company) : [...value, company]);
  }
  return (
    <div>
      <motion.div variants={stepItem} className="flex flex-wrap gap-2" role="group" aria-label="Target companies">
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
              whileTap={disabled ? undefined : { scale: 0.95 }}
              transition={PRESS_SPRING}
              className={cn(
                "relative inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm outline-none transition-[border-color,background-color,box-shadow,color] duration-300",
                "focus-visible:ring-[3px] focus-visible:ring-(--ec-cyan)/40",
                selected
                  ? "border-(--ec-cyan)/70 bg-(--ec-blue)/15 text-foreground shadow-[0_0_20px_-8px_var(--ec-cyan)]"
                  : "border-border/70 bg-background/40 hover:border-(--ec-blue)/50 hover:bg-background/60",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {selected && (
                // One ring burst when a company is picked.
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 rounded-full border border-(--ec-cyan)"
                />
              )}
              <AnimatePresence mode="wait" initial={false}>
                {selected ? (
                  <motion.span
                    key="selected"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 520, damping: 24 }}
                    className="text-(--ec-cyan)"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                    <Building className="size-3.5 text-muted-foreground" />
                  </motion.span>
                )}
              </AnimatePresence>
              {company}
            </motion.button>
          );
        })}
      </motion.div>
      <motion.div variants={stepItem} className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span aria-hidden className="flex gap-1.5">
          {Array.from({ length: MAX_COMPANIES }, (_, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ scale: i < value.length ? 1 : 0.75 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className={cn(
                "size-2 rounded-full transition-colors duration-300",
                i < value.length ? "bg-(--ec-cyan) shadow-[0_0_8px_var(--ec-cyan)]" : "bg-muted",
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

export function SalaryStep({ value, onChange }: { value?: SalaryBand; onChange: (v: SalaryBand) => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as SalaryBand)} className="sm:grid-cols-2">
      {(Object.keys(SALARY_LABELS) as SalaryBand[]).map((band) => (
        <OptionCard key={band} value={band} title={SALARY_LABELS[band]} description="Total annual compensation" />
      ))}
    </RadioGroup>
  );
}

export function StartStep({ value, onChange }: { value?: OnboardingAnswers["start"]; onChange: (v: "placement" | "module1") => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as "placement" | "module1")}>
      <OptionCard
        value="placement"
        icon={<Timer />}
        title="Take the placement test (recommended)"
        description="About 90 minutes. Test out of the modules you already know and start where you’ll actually learn something."
      />
      <OptionCard
        value="module1"
        icon={<Route />}
        title="Start from Module 1"
        description="Work through everything in order. You can still take the placement test later from Assessments."
      />
    </RadioGroup>
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
      <dl className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-background/30">
        {rows.map((row) => (
          <motion.div
            key={row.label}
            variants={stepItem}
            className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4"
          >
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-medium sm:text-right">{row.value}</dd>
          </motion.div>
        ))}
      </dl>
      <motion.div
        variants={stepItem}
        className="flex gap-3 rounded-xl border border-(--ec-cyan)/25 bg-(--ec-cyan)/8 p-4 text-sm shadow-[0_0_30px_-14px_var(--ec-cyan)]"
      >
        <Target className="mt-0.5 size-4 shrink-0 text-(--ec-cyan)" />
        <p className="text-muted-foreground">
          We’ll use your targets to set readiness bars on your dashboard and to pick practice problems. You can change any of
          this later in your profile.
        </p>
      </motion.div>
    </div>
  );
}
