"use client";

import { Ellipsis, FileCode, FilePlus, FileText, Lock, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PaneHeader } from "@/components/shared/workspace-panes";
import { cn } from "@/lib/utils";
import type { LldFile } from "@/types/system-design";

/** Files in the LLD workspace. README is read-only; other files can be renamed or deleted. */
export function FileTree({
  files,
  activeId,
  onOpen,
  onCreate,
  onRename,
  onDelete,
}: {
  files: LldFile[];
  activeId?: string;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-card">
      <PaneHeader
        title="Files"
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="New file" onClick={onCreate}>
            <FilePlus />
          </Button>
        }
      />
      <ul className="min-h-0 flex-1 overflow-y-auto p-2">
        {files.map((file) => {
          const Icon = file.name.endsWith(".md") ? FileText : FileCode;
          const active = file.id === activeId;
          return (
            <li key={file.id} className="group relative">
              <button
                type="button"
                onClick={() => onOpen(file.id)}
                className={cn(
                  "flex h-8 w-full items-center gap-2 rounded-md px-2 pr-8 text-left text-[13px]",
                  active ? "bg-accent font-medium text-accent-foreground" : "hover:bg-accent/60",
                )}
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate font-mono text-[12.5px]">{file.name}</span>
                {file.readOnly && <Lock className="ml-auto size-3 shrink-0 text-muted-foreground" aria-label="Read only" />}
              </button>
              {!file.readOnly && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Actions for ${file.name}`}
                      className="absolute top-1 right-1 flex size-6 items-center justify-center rounded text-muted-foreground opacity-100 hover:bg-background hover:text-foreground focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <Ellipsis className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={() => onRename(file.id)}>
                      <Pencil /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(file.id)}>
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
