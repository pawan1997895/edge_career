// Data access for tracks and modules. Replace the mock returns with API calls later.

import { modules, tracks } from "@/mocks/curriculum";
import type { LearningItem, Module, Track } from "@/types/curriculum";

export async function getTracks(): Promise<Track[]> {
  return tracks;
}

export async function getModules(): Promise<Module[]> {
  return modules;
}

export async function getModule(moduleId: string): Promise<Module | undefined> {
  return modules.find((m) => m.id === moduleId);
}

export async function getCoreModules(): Promise<Module[]> {
  return modules.filter((m) => m.trackId === "core");
}

export async function getElectives(): Promise<Module[]> {
  return modules.filter((m) => m.trackId === "electives");
}

/** The module the learner is currently working through. */
export async function getActiveModule(): Promise<Module> {
  return modules.find((m) => m.trackId === "core" && m.status === "in_progress") ?? modules[0]!;
}

/** Finds the curriculum item (and its module) that opens a given lesson, problem, design problem or exam. */
export async function findItemByRef(refId: string): Promise<{ module: Module; item: LearningItem } | undefined> {
  for (const mod of modules) {
    for (const topic of mod.topics) {
      const item = topic.items.find((i) => i.refId === refId);
      if (item) return { module: mod, item };
    }
  }
  return undefined;
}

/** Required items passed vs total, used for the unlock rule. */
export function requiredItemCounts(module: Module) {
  const required = module.topics.flatMap((t) => t.items).filter((i) => i.required);
  return { passed: required.filter((i) => i.status === "passed").length, total: required.length };
}
