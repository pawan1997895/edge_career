// Data access for the learner dashboard. Replace the mock return with one API call later.

import { dashboardSummary } from "@/mocks/dashboard";
import type { DashboardSummary } from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return dashboardSummary;
}
