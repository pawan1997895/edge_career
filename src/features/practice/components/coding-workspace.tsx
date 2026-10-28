"use client";

import * as React from "react";
import { BookOpen, CodeXml, LoaderCircle, Play, Upload } from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { CodeEditor } from "@/components/shared/code-editor";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { WorkspacePanes } from "@/components/shared/workspace-panes";
import { ConsolePanel, type ConsoleTab } from "@/features/practice/components/console-panel";
import { EditorToolbar } from "@/features/practice/components/editor-toolbar";
import { ProblemPane } from "@/features/practice/components/problem-pane";
import { CODE_DEMO_VERDICTS, SQL_DEMO_VERDICTS, simulateRun, simulateSubmit } from "@/features/practice/lib/simulate-judge";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { routes } from "@/lib/routes";
import type { CodeLanguage, Language, ProblemDetail, Submission } from "@/types/practice";
import type { DemoVerdict, ProblemHint, SqlJudgeData } from "@/types/submissions";

const CODE_LANGUAGE_ORDER: CodeLanguage[] = ["python", "java", "cpp", "javascript", "go"];

/**
 * The coding / SQL workspace. All state lives here (not in the panes) because the
 * responsive layout renders the panes in two places: side by side on desktop, tabs on mobile.
 */
export function CodingWorkspace({
  problem,
  moduleLabel,
  submissions,
  hints,
  sqlJudge,
}: {
  problem: ProblemDetail;
  moduleLabel?: string;
  submissions: Submission[];
  hints: ProblemHint[];
  sqlJudge?: SqlJudgeData;
}) {
  const { toast } = useToast();
  const isSql = problem.kind === "sql";
  const languages: Language[] = isSql ? ["sql"] : CODE_LANGUAGE_ORDER.filter((l) => problem.starterCode[l] !== undefined);

  const [language, setLanguage] = React.useState<Language>(languages[0] ?? "python");
  const [codeByLanguage, setCodeByLanguage] = React.useState<Partial<Record<Language, string>>>(problem.starterCode);
  const [demoVerdict, setDemoVerdict] = React.useState<DemoVerdict>("accepted");
  const [revealedHints, setRevealedHints] = React.useState(0);
  const [consoleTab, setConsoleTab] = React.useState<ConsoleTab>("tests");
  const [consoleOpen, setConsoleOpen] = React.useState(true);
  const [lastAction, setLastAction] = React.useState<"run" | "submit" | null>(null);
  const [runKey, setRunKey] = React.useState(0);
  const [useCustom, setUseCustom] = React.useState(false);
  const [customInput, setCustomInput] = React.useState("");

  const code = codeByLanguage[language] ?? "";

  const run = useSimulatedAction(() => simulateRun(problem, language, demoVerdict, useCustom ? customInput : undefined, sqlJudge), 900);
  const submit = useSimulatedAction(() => simulateSubmit(problem, language, code, demoVerdict, submissions, sqlJudge), 1800);
  const busy = run.isLoading || submit.isLoading;
  const runSamples = run.run;

  // The simulated submission isn't saved, so "Full result" opens the closest mock submission.
  const fullResultHref = React.useMemo(() => {
    const match = submissions.find((s) => s.verdict === demoVerdict) ?? submissions[0];
    return match ? routes.submission(match.id) : routes.submissions;
  }, [submissions, demoVerdict]);

  const startRun = React.useCallback(() => {
    if (busy) return;
    setLastAction("run");
    setRunKey((k) => k + 1);
    setConsoleTab("results");
    setConsoleOpen(true);
    runSamples();
  }, [busy, runSamples]);

  function startSubmit() {
    if (busy) return;
    setLastAction("submit");
    setConsoleTab("results");
    setConsoleOpen(true);
    submit.run();
  }

  // Ctrl/⌘ + Enter runs the sample tests.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        startRun();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startRun]);

  const problemPane = (
    <ProblemPane
      problem={problem}
      moduleLabel={moduleLabel}
      hints={hints}
      revealedHints={revealedHints}
      onRevealHint={() => setRevealedHints((n) => Math.min(n + 1, 4))}
      submissions={submissions}
      latestSubmission={submit.data?.submission}
      latestHref={fullResultHref}
    />
  );

  const editorPane = (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorToolbar
        languages={languages}
        language={language}
        onLanguageChange={setLanguage}
        onReset={() => {
          setCodeByLanguage((current) => ({ ...current, [language]: problem.starterCode[language] ?? "" }));
          toast({ title: "Code reset to the starter template" });
        }}
        demoVerdict={demoVerdict}
        demoVerdicts={isSql ? SQL_DEMO_VERDICTS : CODE_DEMO_VERDICTS}
        onDemoVerdictChange={setDemoVerdict}
      />
      <div className="relative min-h-40 flex-1 bg-card">
        <div className="absolute inset-0">
          <CodeEditor value={code} language={language} onChange={(value) => setCodeByLanguage((current) => ({ ...current, [language]: value }))} />
        </div>
      </div>
      <ConsolePanel
        problem={problem}
        state={{
          tab: consoleTab,
          open: consoleOpen,
          lastAction,
          running: busy,
          runOutcome: run.data,
          submitOutcome: submit.data,
          runKey,
        }}
        demoVerdict={demoVerdict}
        onTabChange={setConsoleTab}
        onToggle={() => setConsoleOpen((open) => !open)}
        useCustom={useCustom}
        onUseCustomChange={setUseCustom}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        fullResultHref={fullResultHref}
      />
    </div>
  );

  return (
    <>
      <WorkspaceHeader
        backHref={routes.practice}
        backLabel="Problem bank"
        title={problem.title}
        meta={
          <>
            <DifficultyBadge difficulty={problem.difficulty} />
            {isSql && <Badge variant="muted">SQL</Badge>}
          </>
        }
        actions={
          <>
            <Tooltip content="Run sample tests (Ctrl + Enter)">
              <Button variant="outline" size="sm" onClick={startRun} disabled={busy}>
                {run.isLoading ? <LoaderCircle className="animate-spin" /> : <Play />}
                <span className="hidden sm:inline">Run</span>
              </Button>
            </Tooltip>
            <Button size="sm" onClick={startSubmit} disabled={busy}>
              {submit.isLoading ? <LoaderCircle className="animate-spin" /> : <Upload />}
              Submit
            </Button>
          </>
        }
      />
      <WorkspacePanes
        panes={[
          { id: "problem", title: "Problem", icon: <BookOpen className="size-4" />, content: problemPane, desktopClassName: "lg:w-[42%] xl:w-[40%]" },
          { id: "code", title: "Code", icon: <CodeXml className="size-4" />, content: editorPane },
        ]}
      />
    </>
  );
}
