// Data access for Module 5 projects and Module 6 notebooks. Replace the mock returns with API calls later.

import { githubConnection, notebooks, projects } from "@/mocks/projects";
import type { GitHubConnection, NotebookDetail, NotebookSummary, ProjectDetail, ProjectSummary } from "@/types/projects";

export async function getGitHubConnection(): Promise<GitHubConnection> {
  return githubConnection;
}

export async function getProjects(): Promise<ProjectSummary[]> {
  return projects;
}

export async function getProject(projectId: string): Promise<ProjectDetail | undefined> {
  return projects.find((p) => p.id === projectId);
}

export async function getNotebooks(): Promise<NotebookSummary[]> {
  return notebooks;
}

export async function getNotebook(notebookId: string): Promise<NotebookDetail | undefined> {
  return notebooks.find((n) => n.id === notebookId);
}
