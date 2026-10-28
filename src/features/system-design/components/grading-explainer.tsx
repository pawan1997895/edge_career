import { Boxes, Network } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = {
  hld: [
    "Automatic checks run on your diagram first, e.g. a single database with no replica is flagged as a single point of failure.",
    "The AI reviewer scores your diagram and written sections against the problem's rubric.",
    "When the grader is unsure, a human reviewer confirms the score before it counts.",
  ],
  lld: [
    "Hidden unit tests call your public classes and methods.",
    "A rubric scores SOLID principles, design patterns, extensibility and naming.",
    "Final score: 70% hidden tests, 30% rubric.",
  ],
};

/** Short "how grading works" panel for the system design landing page. */
export function GradingExplainer() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ExplainerCard icon={<Network className="size-4" />} title="How HLD is graded" description="Drag-and-drop canvas plus written sections" steps={STEPS.hld} />
      <ExplainerCard icon={<Boxes className="size-4" />} title="How LLD is graded" description="Multi-file coding workspace" steps={STEPS.lld} />
    </div>
  );
}

function ExplainerCard({ icon, title, description, steps }: { icon: React.ReactNode; title: string; description: string; steps: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span> {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2.5">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">{i + 1}</span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
