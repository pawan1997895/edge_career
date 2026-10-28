import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SkillMastery } from "@/types/insights";

/** The lowest-mastery skills with a direct link to practise each. */
export function WeakestSkillsCard({ skills }: { skills: SkillMastery[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus next</CardTitle>
        <CardDescription>Your lowest-mastery skills right now.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((s) => (
          <div key={s.skill} className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{s.skill}</span>
              <span className="tabular-nums text-muted-foreground">{s.mastery}</span>
            </div>
            <Progress value={s.mastery} tone="warning" aria-label={`${s.skill} mastery`} />
            <Button variant="outline" size="sm" asChild className="w-full justify-between">
              <Link href={s.practice.href}>
                <span className="truncate">Practise now: {s.practice.label}</span>
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
