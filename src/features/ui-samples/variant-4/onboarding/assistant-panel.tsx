"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, SALARY_LABELS } from "@/types/user";
import type { OnboardingAnswers, OnboardingStepId } from "@/features/onboarding/steps";
import { AiBuddy, Card, EASE, LiveEditor, SpeechBubble, Tag, type CodeLine, type Tok, type TagTone } from "../ui";
import styles from "../studio.module.css";
import { MENTOR_TIPS, STACK } from "./copy";

function field(name: string, value: string | undefined): CodeLine {
  const val: Tok[] = value ? [["str", `"${value}"`], ["punc", ","]] : [["kw", "null"], ["punc", ","]];
  return [["prop", `  ${name}`], ["punc", ": "], ...val];
}

/** The answers as a small TypeScript object; each line is keyed by its content so a changed line re-types. ASCII only. */
function profileLines(a: OnboardingAnswers): { key: string; line: CodeLine }[] {
  const targets: { key: string; line: CodeLine }[] = a.companies.length
    ? [
        { key: "targets-open", line: [["prop", "  targets"], ["punc", ": ["]] },
        ...a.companies.map((c) => ({ key: `target-${c}`, line: [["str", `    "${c}"`], ["punc", ","]] as CodeLine })),
        { key: "targets-close", line: [["punc", "  ],"]] },
      ]
    : [{ key: "targets-empty", line: [["prop", "  targets"], ["punc", ": [],"]] }];
  return [
    { key: "open", line: [["kw", "const "], ["prop", "profile"], ["punc", " = {"]] },
    { key: `persona-${a.persona}`, line: field("persona", a.persona) },
    { key: `level-${a.level}`, line: field("level", a.level) },
    ...targets,
    { key: `salary-${a.salary}`, line: field("salary", a.salary) },
    { key: `start-${a.start}`, line: field("start", a.start) },
    { key: "close", line: [["punc", "};"]] },
  ];
}

/** Tags for what the visitor has chosen so far. */
function answerTags(a: OnboardingAnswers): { key: string; text: string; tone: TagTone }[] {
  return [
    ...(a.level ? [{ key: "level", text: LEVEL_LABELS[a.level], tone: "purple" as const }] : []),
    ...a.companies.map((c) => ({ key: `c-${c}`, text: c, tone: "cyan" as const })),
    ...(a.salary ? [{ key: "salary", text: SALARY_LABELS[a.salary], tone: "amber" as const }] : []),
    ...(a.start ? [{ key: "start", text: a.start === "placement" ? "Placement test" : "Module 1", tone: "teal" as const }] : []),
  ];
}

/** Mentor tip for the current step (wide screens show the full panel; smaller screens just this). */
export function MentorTip({ stepId, className }: { stepId: OnboardingStepId; className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-start gap-3", className)}>
      <AiBuddy size={44} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepId}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.25 }}
          className="min-w-0 flex-1"
        >
          <SpeechBubble className="text-[13px] leading-snug">{MENTOR_TIPS[stepId]}</SpeechBubble>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Right-hand panel on wide screens: the mentor, a live profile.ts and the learning stack. Decorative. */
export function AssistantPanel({ stepId, answers, className }: { stepId: OnboardingStepId; answers: OnboardingAnswers; className?: string }) {
  const tags = answerTags(answers);
  return (
    <div aria-hidden className={cn("space-y-4", className)}>
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold">
          <span className="relative flex size-2">
            <span className={cn(styles.pulse, "absolute inset-0 rounded-full bg-[oklch(0.7_0.15_155)]")} />
            <span className="relative size-2 rounded-full bg-[oklch(0.7_0.15_155)]" />
          </span>
          AI mentor
        </div>
        <MentorTip stepId={stepId} />
      </Card>

      <LiveEditor file="profile.ts" lines={profileLines(answers)} />

      <Card className="p-4">
        <p className="text-xs font-bold">Your learning stack</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STACK.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.4 + i * 0.06 }}
            >
              <Tag tone="indigo">{s}</Tag>
            </motion.span>
          ))}
          <AnimatePresence initial={false}>
            {tags.map((t) => (
              <motion.span
                key={t.key}
                layout
                initial={{ opacity: 0, scale: 0.6, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              >
                <Tag tone={t.tone}>{t.text}</Tag>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
