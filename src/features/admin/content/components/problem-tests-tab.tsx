"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import type { HiddenTestGroup } from "@/types/admin-content";
import type { TestCase } from "@/types/practice";

interface DraftTest extends TestCase {
  group: string;
  hidden: boolean;
}

export function ProblemTestsTab({
  sampleTests,
  hiddenGroups,
  onChange,
}: {
  sampleTests: TestCase[];
  hiddenGroups: HiddenTestGroup[];
  onChange: () => void;
}) {
  const [drafts, setDrafts] = React.useState<DraftTest[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const totalHidden = hiddenGroups.reduce((sum, g) => sum + g.count, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sample tests</CardTitle>
          <CardDescription>Visible to learners in the workspace. tests/sample/</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
              <Plus /> Add test
            </Button>
          </CardAction>
        </CardHeader>
        <div className="mt-4 border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Expected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTests.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-mono text-xs">{t.input}</TableCell>
                  <TableCell className="font-mono text-xs">{t.expected}</TableCell>
                </TableRow>
              ))}
              {drafts.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">
                    {t.id}{" "}
                    <Badge variant="warning" className="ml-1">
                      New · {t.hidden ? t.group : "sample"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.input}</TableCell>
                  <TableCell className="font-mono text-xs">{t.expected || <span className="text-muted-foreground">from reference</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hidden tests</CardTitle>
          <CardDescription>
            {totalHidden} tests carry 70% of the score. Their contents are never shown to learners; only the group and verdict are.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {hiddenGroups.map((g) => (
            <div key={g.name} className="rounded-md border p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{g.name}</span>
                <span className="text-sm tabular-nums">{g.count}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{g.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AddTestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        groups={hiddenGroups.map((g) => g.name)}
        onAdd={(test) => {
          setDrafts((current) => [...current, { ...test, id: `new-${current.length + 1}` }]);
          onChange();
        }}
      />
    </div>
  );
}

function AddTestDialog({
  open,
  onOpenChange,
  groups,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: string[];
  onAdd: (test: Omit<DraftTest, "id">) => void;
}) {
  const { toast } = useToast();
  const [hidden, setHidden] = React.useState(true);
  const [group, setGroup] = React.useState(groups[1] ?? groups[0] ?? "Edge cases");
  const [input, setInput] = React.useState("");
  const [expected, setExpected] = React.useState("");
  const [error, setError] = React.useState("");

  function submit() {
    if (!input.trim()) {
      setError("Input is required.");
      return;
    }
    onAdd({ input: input.trim(), expected: expected.trim(), group, hidden });
    toast({ title: "Test added to the draft", description: "It will be committed with your pull request.", variant: "success" });
    setInput("");
    setExpected("");
    setError("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a test</DialogTitle>
          <DialogDescription>Leave the expected output empty to generate it from the reference solution.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="hidden-test">Hidden test</Label>
              <p className="mt-1 text-xs text-muted-foreground">Hidden tests count toward the score.</p>
            </div>
            <Switch id="hidden-test" checked={hidden} onCheckedChange={setHidden} />
          </div>
          {hidden && (
            <div className="grid gap-1.5">
              <Label>Group</Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="test-input">Input (JSON)</Label>
            <Textarea
              id="test-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"s": ""}'
              aria-invalid={!!error}
              className="font-mono text-[13px]"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="test-expected">Expected output (optional)</Label>
            <Textarea id="test-expected" value={expected} onChange={(e) => setExpected(e.target.value)} className="min-h-14 font-mono text-[13px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Add test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
