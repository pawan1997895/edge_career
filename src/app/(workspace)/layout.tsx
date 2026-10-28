// Full-screen workspaces (coding, SQL, design canvas, interview room, exam attempt, notebooks).
// No sidebar: each page renders its own WorkspaceHeader and fills the viewport.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-dvh flex-col overflow-hidden bg-background">{children}</div>;
}
