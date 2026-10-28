// Display helpers for modules and their locking rules.

import type { ItemStatus, Module } from "@/types/curriculum";

export function moduleLabel(mod: Module) {
  return mod.number ? `Module ${mod.number}` : "Elective";
}

/** Prerequisite modules the learner has not finished yet. */
export function unmetPrerequisites(mod: Module, all: Module[]) {
  return mod.prerequisiteIds
    .map((id) => all.find((m) => m.id === id))
    .filter((m): m is Module => !!m && m.status !== "passed" && m.status !== "tested_out");
}

/** One-line explanation of what unlocks a locked module. */
export function lockReason(mod: Module, all: Module[]) {
  const blocker = unmetPrerequisites(mod, all)[0];
  if (!blocker) return undefined;
  const name = blocker.number ? `Module ${blocker.number}` : blocker.title;
  if (blocker.status === "in_progress" || blocker.status === "unlocked") {
    return `Pass the ${name} checkpoint (${blocker.checkpoint.passScore}%+) to unlock`;
  }
  return `Complete ${name} · ${blocker.title} to unlock`;
}

/** Modules this one unlocks when passed: the next core module and any electives that depend on it. */
export function unlockedBy(mod: Module, all: Module[]) {
  return all.filter((m) => m.prerequisiteIds.includes(mod.id));
}

export function itemActionLabel(status: ItemStatus) {
  switch (status) {
    case "locked":
      return "Locked";
    case "unlocked":
      return "Start";
    case "in_progress":
      return "Continue";
    case "submitted":
      return "View";
    case "passed":
      return "Review";
    case "failed":
      return "Retry";
  }
}
