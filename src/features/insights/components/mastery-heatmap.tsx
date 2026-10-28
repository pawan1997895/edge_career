import { MASTERY_BUCKETS, formatWeek, masteryCellClass } from "@/features/insights/lib";
import { cn } from "@/lib/utils";
import type { SkillMastery } from "@/types/insights";

/** Skills (rows) × last 12 weeks (columns), shaded by mastery at the end of each week. */
export function MasteryHeatmap({ skills, weeks }: { skills: SkillMastery[]; weeks: string[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-separate border-spacing-1 text-xs">
          <caption className="sr-only">Skill mastery per week</caption>
          <thead>
            <tr>
              <th scope="col" className="w-48 text-left font-medium text-muted-foreground">
                Skill
              </th>
              {weeks.map((w, i) => (
                <th key={w} scope="col" className={cn("text-center font-normal text-muted-foreground", i % 2 === 1 && "max-sm:text-transparent")}>
                  {formatWeek(w)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryRows key={category} category={category} skills={skills.filter((s) => s.category === category)} weeks={weeks} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span>Mastery</span>
        {[...MASTERY_BUCKETS].reverse().map((b) => (
          <span key={b.label} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm", b.className)} /> {b.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-muted" /> Not practised yet
        </span>
      </div>
    </div>
  );
}

function CategoryRows({ category, skills, weeks }: { category: string; skills: SkillMastery[]; weeks: string[] }) {
  return (
    <>
      <tr>
        <th colSpan={weeks.length + 1} scope="colgroup" className="pt-3 text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {category}
        </th>
      </tr>
      {skills.map((skill) => (
        <tr key={skill.skill}>
          <th scope="row" className="truncate pr-2 text-left text-[13px] font-normal">
            {skill.skill}
          </th>
          {skill.weekly.map((value, i) => {
            const label = `${skill.skill}, week of ${formatWeek(weeks[i]!)}: ${value === null ? "not practised yet" : `${value}`}`;
            return (
              <td key={weeks[i]} className="p-0">
                <div title={label} className={cn("h-6 rounded-sm", masteryCellClass(value))}>
                  <span className="sr-only">{label}</span>
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
