"use client";

import { FileCode, X } from "lucide-react";
import { CodeEditor, type EditorLanguage } from "@/components/shared/code-editor";
import { EmptyState } from "@/components/shared/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LldFile, LldLanguage } from "@/types/system-design";

function editorLanguageFor(name: string): EditorLanguage {
  if (name.endsWith(".java")) return "java";
  if (name.endsWith(".py")) return "python";
  if (name.endsWith(".md")) return "markdown";
  return "plaintext";
}

/** Open-file tabs, language switch and the Monaco editor for the active file. */
export function EditorPane({
  openFiles,
  activeFile,
  language,
  onLanguageChange,
  onSelectTab,
  onCloseTab,
  onChange,
}: {
  openFiles: LldFile[];
  activeFile?: LldFile;
  language: LldLanguage;
  onLanguageChange: (language: LldLanguage) => void;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b bg-card pr-3">
        <div className="flex h-full min-w-0 flex-1 overflow-x-auto" role="tablist" aria-label="Open files">
          {openFiles.map((file) => {
            const active = file.id === activeFile?.id;
            return (
              <div
                key={file.id}
                className={cn(
                  "group flex h-full shrink-0 items-center gap-1 border-r pr-1 pl-3 font-mono text-[12.5px]",
                  active ? "bg-background text-foreground shadow-[inset_0_-2px_0_var(--primary)]" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <button type="button" role="tab" aria-selected={active} onClick={() => onSelectTab(file.id)} className="h-full">
                  {file.name}
                </button>
                <button
                  type="button"
                  aria-label={`Close ${file.name}`}
                  onClick={() => onCloseTab(file.id)}
                  className="flex size-5 items-center justify-center rounded hover:bg-accent"
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
        <Select value={language} onValueChange={(v) => onLanguageChange(v as LldLanguage)}>
          <SelectTrigger size="sm" aria-label="Language" className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="java">Java 21</SelectItem>
            <SelectItem value="python">Python 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative min-h-0 flex-1">
        {activeFile ? (
          <div className="absolute inset-0">
            <CodeEditor
              key={`${language}-${activeFile.id}`}
              value={activeFile.content}
              onChange={onChange}
              language={editorLanguageFor(activeFile.name)}
              readOnly={activeFile.readOnly}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <EmptyState icon={FileCode} title="No file open" description="Pick a file from the list to start editing." className="w-full max-w-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
