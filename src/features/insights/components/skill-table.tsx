import Link from "next/link";
import { ArrowRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkline } from "@/features/insights/components/sparkline";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SkillMastery } from "@/types/insights";

/** Every tracked skill with its mastery, 4-week change, 12-week trend and where to practise it. */
export function SkillTable({ skills }: { skills: SkillMastery[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Skill</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead className="w-40">Mastery</TableHead>
          <TableHead>4-week change</TableHead>
          <TableHead className="hidden lg:table-cell">12-week trend</TableHead>
          <TableHead className="hidden sm:table-cell">Last practised</TableHead>
          <TableHead className="text-right">Practise</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((s) => (
          <TableRow key={s.skill}>
            <TableCell className="font-medium">{s.skill}</TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">{s.category}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress
                  value={s.mastery}
                  tone={s.mastery >= 80 ? "success" : s.mastery >= 60 ? "primary" : "warning"}
                  className="w-20"
                  aria-label={`${s.skill} mastery`}
                />
                <span className="w-7 text-right tabular-nums">{s.mastery}</span>
              </div>
            </TableCell>
            <TableCell>
              <Delta value={s.delta} />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Sparkline values={s.weekly} />
            </TableCell>
            <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">{formatRelative(s.lastPracticed)}</TableCell>
            <TableCell className="text-right">
              <Link
                href={s.practice.href}
                className="inline-flex max-w-44 items-center gap-1 text-[13px] text-primary hover:underline"
                title={s.practice.label}
              >
                <span className="truncate">{s.practice.label}</span>
                <ArrowRight className="size-3.5 shrink-0" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function Delta({ value }: { value: number }) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[13px] tabular-nums",
        value > 0 && "text-success",
        value < 0 && "text-destructive",
        value === 0 && "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {value > 0 ? `+${value}` : value}
    </span>
  );
}
