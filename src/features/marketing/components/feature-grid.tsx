import {
  ChartColumn,
  CircleCheck,
  CodeXml,
  MessageCircleQuestionMark,
  Mic,
  Network,
  TriangleAlert,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketingSection } from "@/features/marketing/components/section";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  visual: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: Video,
    title: "Avatar lessons with transcripts",
    body: "Expert-reviewed scripts presented on video. Click any line of the transcript to jump there, or ask about that exact moment.",
    visual: <TranscriptVisual />,
  },
  {
    icon: CodeXml,
    title: "Code judge with AI feedback",
    body: "Run code in a sealed sandbox in five languages plus SQL. Every submission gets hidden-test results, a complexity estimate and areas of improvement.",
    visual: <JudgeVisual />,
  },
  {
    icon: MessageCircleQuestionMark,
    title: "Doubt hub with escalating hints",
    body: "Stuck? The assistant sees your problem, code and latest error, and hints one step at a time. It never hands you the full solution.",
    visual: <HintLadderVisual />,
  },
  {
    icon: Network,
    title: "System design workbench",
    body: "Drag typed blocks onto a canvas, write requirements and trade-offs, and get instant checks before an AI review against the rubric.",
    visual: <DesignVisual />,
  },
  {
    icon: Mic,
    title: "Voice mock interviewer",
    body: "A realistic interview flow, from clarifying questions to follow-ups. You can interrupt, and it sees your code as you write it.",
    visual: <InterviewVisual />,
  },
  {
    icon: ChartColumn,
    title: "Skill heatmap and readiness",
    body: "Mastery per skill weights your recent results more. Readiness bars for each company and salary level are expert-set estimates.",
    visual: <HeatmapVisual />,
  },
];

export function FeatureGrid() {
  return (
    <MarketingSection
      id="features"
      eyebrow="Features"
      title="Everything you need to prepare, in one place"
      description="Built around how engineering interviews actually work in product companies."
      className="bg-card/50"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="flex flex-col rounded-lg border bg-card p-5">
            <feature.icon className="size-5 text-primary" />
            <h3 className="mt-3 font-semibold">{feature.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{feature.body}</p>
            <div className="mt-5 rounded-md border bg-background p-3">{feature.visual}</div>
          </article>
        ))}
      </div>
      <FairGrading />
    </MarketingSection>
  );
}

function FairGrading() {
  const points = [
    { value: "70%", label: "of a coding score comes from hidden tests" },
    { value: "80–88%", label: "scores near the pass bar go to a human reviewer" },
    { value: "Appeals", label: "on every grade, answered by a person" },
  ];
  return (
    <div className="mt-8 grid gap-6 rounded-lg border bg-card p-6 md:grid-cols-[1.2fr_2fr] md:items-center">
      <div>
        <h3 className="font-semibold">Grading you can trust</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A wrong score should never lock you out. Tests do most of the grading, and people check the close calls.
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-3">
        {points.map((p) => (
          <div key={p.value}>
            <dt className="text-xl font-semibold tracking-tight">{p.value}</dt>
            <dd className="mt-0.5 text-sm text-muted-foreground">{p.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TranscriptVisual() {
  const lines = [
    { t: "04:12", text: "Each server owns the arc up to the next point on the ring." },
    { t: "04:31", text: "Adding a server only moves keys from one neighbour.", active: true },
    { t: "04:50", text: "Virtual nodes spread the load more evenly." },
  ];
  return (
    <ul className="space-y-1.5 text-xs">
      {lines.map((line) => (
        <li key={line.t} className={cn("flex gap-2 rounded px-1.5 py-1", line.active && "bg-accent text-accent-foreground")}>
          <span className="font-mono text-muted-foreground">{line.t}</span>
          <span>{line.text}</span>
        </li>
      ))}
    </ul>
  );
}

function JudgeVisual() {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex flex-wrap gap-1">
        {["Python", "Java", "C++", "JS", "Go", "SQL"].map((l) => (
          <span key={l} className="rounded border px-1.5 py-0.5 font-mono text-[11px]">
            {l}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Badge variant="success">
          <CircleCheck /> Accepted
        </Badge>
        <span className="text-muted-foreground">42/42 tests · 2 s / 256 MB limits</span>
      </div>
    </div>
  );
}

function HintLadderVisual() {
  const steps = ["Nudge", "Concept", "Approach", "Pseudocode"];
  return (
    <div className="flex items-center gap-1 text-[11px]">
      {steps.map((step, i) => (
        <span
          key={step}
          className={cn(
            "flex-1 rounded px-1.5 py-1 text-center font-medium",
            i < 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {step}
        </span>
      ))}
    </div>
  );
}

function DesignVisual() {
  const boxes = ["Client", "Load balancer", "API", "Postgres"];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-[11px]">
        {boxes.map((box, i) => (
          <span key={box} className="flex flex-1 items-center gap-1">
            <span className={cn("flex-1 truncate rounded border bg-card px-1.5 py-1 text-center", i === 3 && "border-warning")}>{box}</span>
            {i < boxes.length - 1 && <span className="text-muted-foreground">→</span>}
          </span>
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-warning-foreground dark:text-warning">
        <TriangleAlert className="size-3.5" /> Single database with no replica
      </p>
    </div>
  );
}

function InterviewVisual() {
  const stages = ["Intro", "Problem", "Clarify", "Approach", "Code", "Complexity", "Follow-ups", "Wrap-up"];
  return (
    <div className="space-y-2 text-xs">
      <div className="flex gap-1">
        {stages.map((stage, i) => (
          <span key={stage} title={stage} className={cn("h-1.5 flex-1 rounded-full", i <= 4 ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Stage 5 of 8 · Code</span>
        <span>Avg reply 1.2 s</span>
      </div>
    </div>
  );
}

function HeatmapVisual() {
  // Deterministic pattern so server and client render the same cells.
  const rows = 4;
  const cols = 12;
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const level = ((i * 7 + Math.floor(i / cols) * 3) % 5) / 4;
        return <span key={i} className="aspect-square rounded-[2px] bg-primary" style={{ opacity: 0.12 + level * 0.8 }} />;
      })}
    </div>
  );
}
