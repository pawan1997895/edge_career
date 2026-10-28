"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import type { Language } from "@/types/practice";

const MONACO_LANGUAGE: Record<Language | "typescript" | "markdown" | "plaintext" | "json" | "yaml", string> = {
  python: "python",
  java: "java",
  cpp: "cpp",
  javascript: "javascript",
  go: "go",
  sql: "sql",
  typescript: "typescript",
  markdown: "markdown",
  plaintext: "plaintext",
  json: "json",
  yaml: "yaml",
};

export type EditorLanguage = keyof typeof MONACO_LANGUAGE;

/**
 * Monaco editor themed to match the app. Monaco loads from a CDN in this mock UI;
 * it shows a skeleton while loading.
 */
export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  height = "100%",
  fontSize = 13,
  lineNumbers = true,
}: {
  value: string;
  onChange?: (value: string) => void;
  language: EditorLanguage;
  readOnly?: boolean;
  height?: string | number;
  fontSize?: number;
  lineNumbers?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <Editor
      height={height}
      language={MONACO_LANGUAGE[language]}
      value={value}
      onChange={(next) => onChange?.(next ?? "")}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
      loading={
        <div className="flex size-full flex-col gap-2 p-4">
          {[70, 45, 60, 30, 55].map((w, i) => (
            <Skeleton key={i} className="h-3.5" style={{ width: `${w}%` }} />
          ))}
        </div>
      }
      options={{
        readOnly,
        fontSize,
        fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        lineNumbers: lineNumbers ? "on" : "off",
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: readOnly ? "none" : "line",
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      }}
    />
  );
}
