"use client";

import * as React from "react";
import { Eye } from "lucide-react";
import { CodeEditor } from "@/components/shared/code-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGE_LABELS, type CodeLanguage } from "@/types/practice";

const DEFAULT_NOTES =
  "Approach\n- Sort meetings by start time\n- Min-heap of end times = rooms in use\n- Reuse a room when heap[0] <= start\n\nEdge cases\n- Back-to-back meetings share a room\n- Single meeting → 1 room";

export interface SharedWorkspaceState {
  languages: CodeLanguage[];
  language: CodeLanguage;
  setLanguage: (language: CodeLanguage) => void;
  code: string;
  setCode: (code: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

/** Editor state lives in the room so the desktop and mobile layouts show the same code. */
export function useSharedWorkspace(starterCode: Partial<Record<CodeLanguage, string>>): SharedWorkspaceState {
  const languages = Object.keys(starterCode) as CodeLanguage[];
  const [language, setLanguage] = React.useState<CodeLanguage>(languages[0] ?? "python");
  const [codeByLanguage, setCodeByLanguage] = React.useState(starterCode);
  const [notes, setNotes] = React.useState(DEFAULT_NOTES);
  return {
    languages,
    language,
    setLanguage,
    code: codeByLanguage[language] ?? "",
    setCode: (code) => setCodeByLanguage((prev) => ({ ...prev, [language]: code })),
    notes,
    setNotes,
  };
}

/** Code and notes the interviewer can see live, like a shared screen. */
export function SharedWorkspace({ state }: { state: SharedWorkspaceState }) {
  return (
    <Tabs defaultValue="code" className="flex min-h-0 flex-1 gap-0">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b bg-card px-3">
        <TabsList className="h-8">
          <TabsTrigger value="code" className="text-[13px]">
            Code
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-[13px]">
            Notes
          </TabsTrigger>
        </TabsList>
        <span className="ml-1 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <span className="size-1.5 rounded-full bg-success" />
          <Eye className="size-3.5" /> Interviewer can see your code
        </span>
        <div className="ml-auto">
          <Select value={state.language} onValueChange={(v) => state.setLanguage(v as CodeLanguage)}>
            <SelectTrigger size="sm" className="w-40" aria-label="Language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {LANGUAGE_LABELS[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <TabsContent value="code" className="min-h-0 flex-1 data-[state=inactive]:hidden">
        <CodeEditor language={state.language} value={state.code} onChange={state.setCode} />
      </TabsContent>
      <TabsContent value="notes" className="flex min-h-0 flex-1 flex-col gap-2 p-3 data-[state=inactive]:hidden">
        <p className="text-xs text-muted-foreground">
          Notes and quick diagram outlines are shared with the interviewer. Design rounds open the full design canvas here.
        </p>
        <Textarea
          value={state.notes}
          onChange={(e) => state.setNotes(e.target.value)}
          className="min-h-0 flex-1 resize-none font-mono text-[13px]"
          aria-label="Shared notes"
        />
      </TabsContent>
    </Tabs>
  );
}
