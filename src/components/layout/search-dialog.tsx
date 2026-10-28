"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { adminNav, learnerNav } from "@/lib/navigation";
import { screenGroups } from "@/lib/screens";
import { cn } from "@/lib/utils";
import type { ShellVariant } from "@/components/layout/app-shell";

interface SearchEntry {
  title: string;
  href: string;
  group: string;
}

/** Quick navigation (Ctrl/⌘ K). Searches pages; content search comes with the backend. */
export function SearchDialog({ open, onOpenChange, variant }: { open: boolean; onOpenChange: (open: boolean) => void; variant: ShellVariant }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);

  const entries = React.useMemo<SearchEntry[]>(() => {
    const nav = (variant === "admin" ? adminNav : learnerNav).flatMap((s) =>
      s.items.map((i) => ({ title: i.title, href: i.href, group: "Pages" })),
    );
    const screens = screenGroups.flatMap((g) => g.screens.map((s) => ({ title: s.title, href: s.href, group: g.title })));
    const seen = new Set<string>();
    return [...nav, ...screens].filter((e) => (seen.has(e.href) ? false : (seen.add(e.href), true)));
  }, [variant]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? entries.filter((e) => `${e.title} ${e.group}`.toLowerCase().includes(q)) : entries;
    return list.slice(0, 12);
  }, [entries, query]);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    onOpenChange(false);
    setQuery("");
    router.push(entry.href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="top-[20%] max-w-xl translate-y-0 gap-0 p-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlight((h) => Math.min(h + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter") {
                go(results[highlight]);
              }
            }}
            placeholder="Search pages and screens…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No pages match “{query}”.</li>}
          {results.map((entry, i) => (
            <li key={entry.href}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => go(entry)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm",
                  i === highlight && "bg-accent text-accent-foreground",
                )}
              >
                <span className="flex-1 truncate">{entry.title}</span>
                <span className="truncate text-xs text-muted-foreground">{entry.group}</span>
                {i === highlight && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
