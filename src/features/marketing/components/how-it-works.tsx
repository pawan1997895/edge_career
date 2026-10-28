import { BookOpen, CodeXml, Mic, Network, Target } from "lucide-react";
import { MarketingSection } from "@/features/marketing/components/section";

const STEPS = [
  { icon: BookOpen, title: "Learn", body: "Short expert lessons with avatar video, synced transcripts and notes." },
  { icon: CodeXml, title: "Practise", body: "Solve problems in the judge. Hidden tests and an AI review show what to fix." },
  { icon: Network, title: "Design", body: "Sketch architectures on the canvas and build class designs with tests." },
  { icon: Mic, title: "Interview", body: "Talk through problems with the AI interviewer and get a scorecard." },
  { icon: Target, title: "Get ready", body: "Track mastery per skill and readiness for your target companies." },
];

export function HowItWorks() {
  return (
    <MarketingSection
      eyebrow="How it works"
      title="One path from fundamentals to offer-ready"
      description="Each module ends with a checkpoint. Pass it with 85% or more and the next module unlocks."
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <step.icon className="size-4.5" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
            </div>
            <h3 className="mt-4 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </MarketingSection>
  );
}
