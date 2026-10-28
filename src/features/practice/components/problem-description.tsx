import Link from "next/link";
import { Building, Clock, Cpu, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/shared/rich-text";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { routes } from "@/lib/routes";
import type { ProblemDetail } from "@/types/practice";

/** Problem statement, examples, constraints, limits and tags. */
export function ProblemDescription({ problem, moduleLabel }: { problem: ProblemDetail; moduleLabel?: string }) {
  return (
    <div className="space-y-6 p-4 sm:p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-xs text-muted-foreground">· {problem.acceptanceRate}% acceptance</span>
          {moduleLabel && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <Link href={routes.module(problem.moduleId)} className="text-xs text-muted-foreground hover:text-primary">
                {moduleLabel}
              </Link>
            </>
          )}
        </div>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">{problem.title}</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {problem.topics.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3 text-sm leading-relaxed">
        {problem.statement.map((paragraph, i) => (
          <p key={i}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>

      <section className="space-y-3">
        {problem.examples.map((example, i) => (
          <div key={i}>
            <h3 className="mb-1.5 text-sm font-semibold">Example {i + 1}</h3>
            <div className="space-y-1 rounded-md border bg-muted/40 p-3 font-mono text-[13px]">
              <p className="whitespace-pre-wrap">
                <span className="font-sans font-medium text-muted-foreground">Input: </span>
                {example.input}
              </p>
              <p className="whitespace-pre-wrap">
                <span className="font-sans font-medium text-muted-foreground">Output: </span>
                {example.output}
              </p>
              {example.explanation && (
                <p className="font-sans text-muted-foreground">
                  <span className="font-medium">Explanation: </span>
                  <RichText text={example.explanation} />
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-1.5 text-sm font-semibold">Constraints</h3>
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-muted-foreground marker:text-border">
          {problem.constraints.map((c) => (
            <li key={c} className="font-mono">
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-2 text-[13px] sm:grid-cols-3">
        <Limit icon={<Clock />} label="Time limit" value={`${problem.timeLimitMs / 1000} s`} />
        <Limit icon={<Cpu />} label="Memory limit" value={`${problem.memoryLimitMb} MB`} />
        <Limit icon={<EyeOff />} label="Hidden tests" value={String(problem.hiddenTestCount)} />
      </section>

      {problem.companies.length > 0 && (
        <section>
          <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
            <Building className="size-4 text-muted-foreground" /> Asked at
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {problem.companies.map((c) => (
              <Badge key={c} variant="outline">
                {c}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Limit({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
      <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium">{value}</span>
    </div>
  );
}
