import { ArrowRight, BookOpen, CircleCheck, Flame, Play, Plus, Send, Target } from "lucide-react";
import { ScoreRing } from "@/components/shared/score-ring";
import { StatCard } from "@/components/shared/stat-card";
import {
  DifficultyBadge,
  ItemStatusBadge,
  ModuleStatusBadge,
  PhaseBadge,
  VerdictBadge,
} from "@/components/shared/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DsSection, Specimen } from "@/features/design-system/components/ds-section";
import type { ItemStatus, ModuleStatus } from "@/types/curriculum";
import type { Verdict } from "@/types/practice";

const ITEM_STATUSES: ItemStatus[] = ["locked", "unlocked", "in_progress", "submitted", "passed", "failed"];
const MODULE_STATUSES: ModuleStatus[] = ["locked", "unlocked", "in_progress", "passed", "tested_out"];
const VERDICTS: Verdict[] = ["accepted", "wrong_answer", "time_limit_exceeded", "memory_limit_exceeded", "runtime_error", "compile_error", "pending"];

export function ButtonsAndBadges() {
  return (
    <>
      <DsSection id="buttons" title="Buttons" description="One primary action per area. Outline and ghost for secondary actions.">
        <Specimen label="Variants">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Specimen>
        <Specimen label="Sizes, icons and states">
          <Button size="sm">
            <Play /> Run
          </Button>
          <Button>
            <Send /> Submit
          </Button>
          <Button size="lg">
            Start checkpoint <ArrowRight />
          </Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <Plus />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Lesson">
            <BookOpen />
          </Button>
          <Button disabled>Disabled</Button>
        </Specimen>
      </DsSection>

      <DsSection id="badges" title="Badges and status" description="Statuses always use the shared badges so the same state looks the same everywhere.">
        <Specimen label="Badge variants">
          {(["default", "solid", "secondary", "outline", "muted", "success", "warning", "destructive", "info"] as const).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </Specimen>
        <Specimen label="Learning item status">
          {ITEM_STATUSES.map((s) => (
            <ItemStatusBadge key={s} status={s} />
          ))}
        </Specimen>
        <Specimen label="Module status">
          {MODULE_STATUSES.map((s) => (
            <ModuleStatusBadge key={s} status={s} />
          ))}
        </Specimen>
        <Specimen label="Judge verdicts">
          {VERDICTS.map((v) => (
            <VerdictBadge key={v} verdict={v} />
          ))}
        </Specimen>
        <Specimen label="Difficulty and roadmap phase">
          <DifficultyBadge difficulty="easy" />
          <DifficultyBadge difficulty="medium" />
          <DifficultyBadge difficulty="hard" />
          <PhaseBadge phase={0} />
          <PhaseBadge phase={1} />
          <PhaseBadge phase={2} />
          <PhaseBadge phase={3} />
        </Specimen>
      </DsSection>
    </>
  );
}

export function FormControls() {
  return (
    <DsSection id="forms" title="Form controls" description="Labels sit above inputs. Errors appear under the field in destructive text.">
      <Card className="grid gap-5 p-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ds-input">Text input</Label>
          <Input id="ds-input" placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ds-invalid">Invalid input</Label>
          <Input id="ds-invalid" defaultValue="aarav@" aria-invalid />
          <p className="text-xs text-destructive">Enter a valid email address.</p>
        </div>
        <div className="space-y-1.5">
          <Label>Select</Label>
          <Select defaultValue="python">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python 3</SelectItem>
              <SelectItem value="java">Java 21</SelectItem>
              <SelectItem value="cpp">C++ 20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ds-textarea">Textarea</Label>
          <Textarea id="ds-textarea" placeholder="Describe your trade-offs…" className="min-h-9" />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Label className="font-normal">
            <Checkbox defaultChecked /> Checkbox
          </Label>
          <Label className="font-normal">
            <Switch defaultChecked /> Switch
          </Label>
        </div>
        <RadioGroup defaultValue="voice" className="flex flex-wrap gap-5">
          <Label className="font-normal">
            <RadioGroupItem value="text" /> Text
          </Label>
          <Label className="font-normal">
            <RadioGroupItem value="voice" /> Voice
          </Label>
          <Label className="font-normal">
            <RadioGroupItem value="avatar" disabled /> Avatar
          </Label>
        </RadioGroup>
        <div className="space-y-2 md:col-span-2">
          <Label>Slider</Label>
          <Slider defaultValue={[14]} min={12} max={20} step={1} aria-label="Font size" />
        </div>
      </Card>
    </DsSection>
  );
}

export function CardsAndData() {
  return (
    <>
      <DsSection id="cards" title="Cards and stats" description="Cards group related content. Stat cards show one headline number.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Day streak" value="12" icon={Flame} hint="best: 19" />
          <StatCard label="Problems solved" value="23" icon={CircleCheck} trend={{ value: "+5", positive: true }} hint="this week" />
          <StatCard label="Atlassian readiness" value="72%" icon={Target} hint="estimate" />
          <StatCard label="Checkpoint" value="78%" trend={{ value: "-7 to pass", positive: false }} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Card with header, action and footer</CardTitle>
            <CardDescription>Module 4 · System Design</CardDescription>
            <CardAction>
              <Badge variant="info">In progress</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Required items</span>
              <span className="font-medium">89%</span>
            </div>
            <Progress value={89} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button size="sm">Continue</Button>
          </CardFooter>
        </Card>
      </DsSection>

      <DsSection id="tabs" title="Tabs" description="Segmented tabs switch views inside a card; line tabs split a page into sections.">
        <Specimen label="Segmented" className="block">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="hints">Hints</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-sm text-muted-foreground">
              Problem statement goes here.
            </TabsContent>
            <TabsContent value="submissions" className="text-sm text-muted-foreground">
              Past submissions go here.
            </TabsContent>
            <TabsContent value="hints" className="text-sm text-muted-foreground">
              Hints unlock one level at a time.
            </TabsContent>
          </Tabs>
        </Specimen>
        <Specimen label="Line" className="block">
          <Tabs defaultValue="account">
            <TabsList variant="line">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
          </Tabs>
        </Specimen>
      </DsSection>

      <DsSection id="tables" title="Tables" description="Tables scroll horizontally inside their card on small screens.">
        <Card className="px-0 py-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Longest substring without repeating characters</TableCell>
                <TableCell>
                  <DifficultyBadge difficulty="medium" />
                </TableCell>
                <TableCell>
                  <VerdictBadge verdict="accepted" />
                </TableCell>
                <TableCell className="text-right tabular-nums">88</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sliding window maximum</TableCell>
                <TableCell>
                  <DifficultyBadge difficulty="hard" />
                </TableCell>
                <TableCell>
                  <VerdictBadge verdict="time_limit_exceeded" />
                </TableCell>
                <TableCell className="text-right tabular-nums">41</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </DsSection>

      <DsSection id="scores" title="Progress and scores" description="Score rings turn amber in the human-review band just below the 85% bar.">
        <Specimen label="Progress tones" className="grid gap-3 sm:grid-cols-3">
          {(["primary", "success", "warning", "destructive", "info", "muted"] as const).map((tone, i) => (
            <div key={tone} className="space-y-1">
              <p className="text-xs text-muted-foreground">{tone}</p>
              <Progress value={30 + i * 12} tone={tone} />
            </div>
          ))}
        </Specimen>
        <Specimen label="Score ring (pass bar 85)">
          <ScoreRing score={91} label="passed" />
          <ScoreRing score={84} label="review" />
          <ScoreRing score={78} label="not yet" />
          <ScoreRing score={88} size={44} />
        </Specimen>
      </DsSection>
    </>
  );
}
