import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { PromptVersion } from "@/types/admin-ops";

export function PromptVersions({ prompts }: { prompts: PromptVersion[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt and rubric versions</CardTitle>
        <CardDescription>Versioned in code (packages/llm). Agreement is measured against the human-graded set.</CardDescription>
      </CardHeader>
      <div className="pt-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Feature</TableHead>
              <TableHead>Latest change</TableHead>
              <TableHead className="text-right">Agreement</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-medium">
                      {p.name}@{p.version}
                    </code>
                    <Badge variant={p.kind === "rubric" ? "info" : "secondary"}>{p.kind === "rubric" ? "Rubric" : "Prompt"}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.feature}</TableCell>
                <TableCell className="min-w-64 text-[13px]">{p.change}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.evalAgreement !== undefined ? (
                    <span className={p.evalAgreement >= 90 ? "text-success" : "text-warning-foreground dark:text-warning"}>{p.evalAgreement}%</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(p.updatedAt)}
                  <div className="text-xs">{p.author}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
