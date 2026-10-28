"use client";

import { Briefcase, Building, Check, GraduationCap, Repeat, Route, Sparkles, Target, Timer } from "lucide-react";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
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
        <RadioCard key={p} value={p} title={PERSONA_LABELS[p]} icon={PERSONA_ICONS[p]} />
      ))}
    </RadioGroup>
  );
}

export function LevelStep({ value, onChange }: { value?: Level; onChange: (v: Level) => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as Level)} className="sm:grid-cols-2">
      {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
        <RadioCard key={l} value={l} title={LEVEL_LABELS[l]} description={LEVEL_DESCRIPTIONS[l]} />
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
      <div className="flex flex-wrap gap-2" role="group" aria-label="Target companies">
        {options.map((company) => {
          const selected = value.includes(company);
          const disabled = full && !selected;
          return (
            <button
              key={company}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggle(company)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border bg-card px-3.5 text-sm transition-colors",
                selected ? "border-primary bg-accent text-accent-foreground" : "hover:bg-accent/50",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {selected ? <Check className="size-3.5" /> : <Building className="size-3.5 text-muted-foreground" />}
              {company}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {value.length} of {MAX_COMPANIES} selected
        {full && " · deselect one to choose another"}
      </p>
    </div>
  );
}

export function SalaryStep({ value, onChange }: { value?: SalaryBand; onChange: (v: SalaryBand) => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as SalaryBand)} className="sm:grid-cols-2">
      {(Object.keys(SALARY_LABELS) as SalaryBand[]).map((band) => (
        <RadioCard key={band} value={band} title={SALARY_LABELS[band]} description="Total annual compensation" />
      ))}
    </RadioGroup>
  );
}

export function StartStep({ value, onChange }: { value?: OnboardingAnswers["start"]; onChange: (v: "placement" | "module1") => void }) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={(v) => onChange(v as "placement" | "module1")}>
      <RadioCard
        value="placement"
        icon={<Timer />}
        title="Take the placement test (recommended)"
        description="About 90 minutes. Test out of the modules you already know and start where you’ll actually learn something."
      />
      <RadioCard
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
      <dl className="divide-y rounded-lg border">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-medium sm:text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-3 rounded-lg bg-muted/60 p-4 text-sm">
        <Target className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          We’ll use your targets to set readiness bars on your dashboard and to pick practice problems. You can change any of
          this later in your profile.
        </p>
      </div>
    </div>
  );
}
