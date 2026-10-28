"use client";

import * as React from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasteryHeatmap } from "@/features/insights/components/mastery-heatmap";
import { SkillTable } from "@/features/insights/components/skill-table";
import { SKILL_CATEGORIES, type SkillCategory, type SkillMastery } from "@/types/insights";

type Sort = "lowest" | "highest" | "change";

const SORTERS: Record<Sort, (a: SkillMastery, b: SkillMastery) => number> = {
  lowest: (a, b) => a.mastery - b.mastery,
  highest: (a, b) => b.mastery - a.mastery,
  change: (a, b) => b.delta - a.delta,
};

/** Heatmap and skill table with a shared category filter. */
export function ProgressExplorer({ skills, weeks }: { skills: SkillMastery[]; weeks: string[] }) {
  const [category, setCategory] = React.useState<"all" | SkillCategory>("all");
  const [sort, setSort] = React.useState<Sort>("lowest");

  const filtered = category === "all" ? skills : skills.filter((s) => s.category === category);
  const sorted = [...filtered].sort(SORTERS[sort]);

  return (
    <div className="space-y-4">
      <Tabs value={category} onValueChange={(v) => setCategory(v as typeof category)}>
        <TabsList className="max-w-full">
          <TabsTrigger value="all">All skills</TabsTrigger>
          {SKILL_CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Mastery heatmap</CardTitle>
          <CardDescription>Your mastery at the end of each of the last 12 weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <MasteryHeatmap skills={filtered} weeks={weeks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All skills</CardTitle>
          <CardDescription>
            {filtered.length} skill{filtered.length === 1 ? "" : "s"}
            {category !== "all" ? ` in ${category}` : ""}
          </CardDescription>
          <CardAction>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger size="sm" aria-label="Sort skills">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="lowest">Lowest mastery first</SelectItem>
                <SelectItem value="highest">Highest mastery first</SelectItem>
                <SelectItem value="change">Biggest gain first</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <SkillTable skills={sorted} />
        </CardContent>
      </Card>
    </div>
  );
}
