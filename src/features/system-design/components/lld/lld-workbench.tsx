"use client";

import * as React from "react";
import { CodeXml, FlaskConical, FolderOpen, Play, Send } from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { WorkspacePanes } from "@/components/shared/workspace-panes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { DesignStatusBadge } from "@/features/system-design/components/design-status-badge";
import { SaveIndicator } from "@/features/system-design/components/save-indicator";
import { EditorPane } from "@/features/system-design/components/lld/editor-pane";
import { FileNameDialog } from "@/features/system-design/components/lld/file-name-dialog";
import { FileTree } from "@/features/system-design/components/lld/file-tree";
import { LldResultsPanel, type LldSubmissionResult } from "@/features/system-design/components/lld/lld-results-panel";
import { routes } from "@/lib/routes";
import type { LldFile, LldLanguage, LldProblem } from "@/types/system-design";

const EXTENSION: Record<LldLanguage, string> = { java: ".java", python: ".py" };

function templateFor(language: LldLanguage, name: string) {
  if (language === "java") {
    const className = name.replace(/\.java$/, "");
    return `public class ${className} {\n\n}\n`;
  }
  return `# ${name}\n\n`;
}

type DialogState = { mode: "create" } | { mode: "rename"; fileId: string } | null;

/** Multi-file LLD workspace: file tree, editor and the tests/rubric panel. */
export function LldWorkbench({ problem }: { problem: LldProblem }) {
  const { toast } = useToast();
  const [language, setLanguage] = React.useState<LldLanguage>("java");
  const [files, setFiles] = React.useState(problem.files);
  const firstCodeFile = (lang: LldLanguage) => files[lang].find((f) => !f.readOnly)?.id ?? files[lang][0]?.id;
  const [openIds, setOpenIds] = React.useState<string[]>(() => ["readme", problem.files.java.find((f) => !f.readOnly)?.id].filter(Boolean) as string[]);
  const [activeId, setActiveId] = React.useState<string | undefined>(() => problem.files.java.find((f) => !f.readOnly)?.id);
  const [dialog, setDialog] = React.useState<DialogState>(null);
  const [saving, setSaving] = React.useState(false);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nextId = React.useRef(1);

  React.useEffect(() => () => clearTimeout(saveTimer.current), []);

  const currentFiles = files[language];
  const openFiles = openIds.map((id) => currentFiles.find((f) => f.id === id)).filter((f): f is LldFile => Boolean(f));
  const activeFile = currentFiles.find((f) => f.id === activeId);

  const tests = useSimulatedAction(() => problem.tests, 1800);
  const submit = useSimulatedAction<LldSubmissionResult>(() => {
    const passed = problem.tests.filter((t) => t.passed).length;
    const rubricScore = problem.rubric.reduce((s, c) => s + c.score, 0);
    const rubricMax = problem.rubric.reduce((s, c) => s + c.max, 0);
    const testsPercent = (passed / problem.tests.length) * 100;
    const rubricPercent = Math.round((rubricScore / rubricMax) * 100);
    return { testsPassed: passed, testsTotal: problem.tests.length, rubricPercent, total: Math.round(testsPercent * 0.7 + rubricPercent * 0.3) };
  }, 2600);

  function markDirty() {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaving(false), 700);
  }

  function updateFiles(update: (list: LldFile[]) => LldFile[]) {
    setFiles((current) => ({ ...current, [language]: update(current[language]) }));
    markDirty();
  }

  function openFile(id: string) {
    setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setActiveId(id);
  }

  function closeTab(id: string) {
    const remaining = openIds.filter((x) => x !== id);
    setOpenIds(remaining);
    if (activeId === id) setActiveId(remaining[remaining.length - 1]);
  }

  function switchLanguage(next: LldLanguage) {
    setLanguage(next);
    // File ids are shared between the Java and Python versions, so open tabs carry over where they exist.
    const available = new Set(files[next].map((f) => f.id));
    const keep = openIds.filter((id) => available.has(id));
    setOpenIds(keep.length ? keep : [firstCodeFile(next)].filter(Boolean) as string[]);
    if (!activeId || !available.has(activeId)) setActiveId(keep[0] ?? firstCodeFile(next));
  }

  function confirmDialog(name: string) {
    if (dialog?.mode === "create") {
      const id = `new-${nextId.current++}`;
      updateFiles((list) => [...list, { id, name, content: templateFor(language, name) }]);
      openFile(id);
      toast({ title: `Created ${name}`, variant: "success" });
    } else if (dialog?.mode === "rename") {
      updateFiles((list) => list.map((f) => (f.id === dialog.fileId ? { ...f, name } : f)));
    }
    setDialog(null);
  }

  function deleteFile(id: string) {
    const file = currentFiles.find((f) => f.id === id);
    updateFiles((list) => list.filter((f) => f.id !== id));
    closeTab(id);
    if (file) toast({ title: `Deleted ${file.name}` });
  }

  function handleSubmit() {
    submit.run();
    toast({ title: "Submission received", description: "Running hidden tests and the rubric review." });
  }

  const renaming = dialog?.mode === "rename" ? currentFiles.find((f) => f.id === dialog.fileId) : undefined;

  return (
    <>
      <WorkspaceHeader
        backHref={routes.systemDesign}
        backLabel="System design"
        title={problem.title}
        meta={
          <>
            <Badge variant="secondary">LLD</Badge>
            <DifficultyBadge difficulty={problem.difficulty} />
            <DesignStatusBadge status={problem.status} />
          </>
        }
        center={<SaveIndicator saving={saving} />}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={tests.run} disabled={tests.isLoading}>
              <Play /> <span className="hidden sm:inline">Run tests</span>
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submit.isLoading}>
              <Send /> <span className="hidden sm:inline">Submit</span>
            </Button>
          </>
        }
      />
      <WorkspacePanes
        panes={[
          {
            id: "files",
            title: "Files",
            icon: <FolderOpen className="size-4" />,
            desktopClassName: "lg:w-56 lg:shrink-0",
            content: (
              <FileTree
                files={currentFiles}
                activeId={activeId}
                onOpen={openFile}
                onCreate={() => setDialog({ mode: "create" })}
                onRename={(fileId) => setDialog({ mode: "rename", fileId })}
                onDelete={deleteFile}
              />
            ),
          },
          {
            id: "editor",
            title: "Code",
            icon: <CodeXml className="size-4" />,
            content: (
              <div className="flex min-h-0 flex-1 flex-col">
                <EditorPane
                  openFiles={openFiles}
                  activeFile={activeFile}
                  language={language}
                  onLanguageChange={switchLanguage}
                  onSelectTab={setActiveId}
                  onCloseTab={closeTab}
                  onChange={(value) => activeFile && updateFiles((list) => list.map((f) => (f.id === activeFile.id ? { ...f, content: value } : f)))}
                />
              </div>
            ),
          },
          {
            id: "results",
            title: "Tests & rubric",
            icon: <FlaskConical className="size-4" />,
            desktopClassName: "lg:w-[380px] lg:shrink-0",
            content: (
              <LldResultsPanel
                problem={problem}
                fileCount={currentFiles.filter((f) => !f.readOnly).length}
                testState={tests.status}
                testResults={tests.data}
                onRunTests={tests.run}
                submission={submit.data}
                submitting={submit.isLoading}
              />
            ),
          },
        ]}
      />
      <FileNameDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.mode ?? "create"}
        initialName={renaming?.name ?? ""}
        extension={EXTENSION[language]}
        existingNames={currentFiles.map((f) => f.name)}
        onConfirm={confirmDialog}
      />
    </>
  );
}
