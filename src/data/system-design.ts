// Data access for the system design workbench. Replace the mock returns with API calls later.

import { designProblems, hldProblems, lldProblems } from "@/mocks/system-design";
import type { DesignProblemSummary, HldProblem, LldProblem } from "@/types/system-design";

export async function getDesignProblems(): Promise<DesignProblemSummary[]> {
  return designProblems;
}

export async function getHldProblem(designId: string): Promise<HldProblem | undefined> {
  return hldProblems.find((p) => p.id === designId);
}

export async function getLldProblem(designId: string): Promise<LldProblem | undefined> {
  return lldProblems.find((p) => p.id === designId);
}
