import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMinutes } from "@/lib/format";
import type { ExamSection } from "@/types/assessments";

const KIND_LABELS: Record<ExamSection["kind"], string> = {
  single: "Multiple choice",
  multi: "Multiple select",
  code: "Coding",
  design: "Written design",
  mixed: "MCQ + short answer",
};

export function ExamSectionsTable({ sections }: { sections: ExamSection[] }) {
  const showDuration = sections.some((s) => s.durationMin);
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Section</TableHead>
          <TableHead className="hidden sm:table-cell">Format</TableHead>
          <TableHead className="text-right">Questions</TableHead>
          {showDuration && <TableHead className="text-right">Time</TableHead>}
          <TableHead className="text-right">Weight</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sections.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.title}</TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">{KIND_LABELS[s.kind]}</TableCell>
            <TableCell className="text-right tabular-nums">{s.questionCount}</TableCell>
            {showDuration && <TableCell className="text-right tabular-nums">{s.durationMin ? formatMinutes(s.durationMin) : "—"}</TableCell>}
            <TableCell className="text-right tabular-nums">{s.weight}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
