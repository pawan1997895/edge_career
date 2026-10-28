"use client";

import { CodeEditor } from "@/components/shared/code-editor";
import type { Language } from "@/types/practice";

/** Read-only view of submitted code, sized to fit up to `maxLines` lines. */
export function CodeViewer({ code, language, maxLines = 28 }: { code: string; language: Language; maxLines?: number }) {
  const lines = Math.min(code.split("\n").length + 1, maxLines);
  const height = lines * 19 + 24;
  return (
    <div className="overflow-hidden rounded-md border" style={{ height }}>
      <CodeEditor value={code} language={language} readOnly />
    </div>
  );
}
