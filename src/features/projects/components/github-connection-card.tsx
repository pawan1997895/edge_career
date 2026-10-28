"use client";

import * as React from "react";
import { Lock, LoaderCircle, Settings2 } from "lucide-react";
import { GitHubIcon } from "@/components/shared/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { formatDate } from "@/lib/format";
import type { GitHubConnection } from "@/types/projects";

/** Edge Career GitHub App: connection status and which repositories it may read. */
export function GitHubConnectionCard({ connection }: { connection: GitHubConnection }) {
  const { toast } = useToast();
  const [connected, setConnected] = React.useState(connection.connected);
  const [repos, setRepos] = React.useState(connection.repositories);
  const [manageOpen, setManageOpen] = React.useState(false);
  const connect = useSimulatedAction(() => true, 1500);

  // A finished connect action counts as connected.
  const isConnected = connected || connect.status === "success";
  const selected = repos.filter((r) => r.selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitHubIcon className="size-4" /> GitHub App
        </CardTitle>
        <CardDescription>Projects are graded from your own repositories. The app reads code and commits; it never pushes.</CardDescription>
        {isConnected && (
          <CardAction>
            <Badge variant="success">Connected</Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-3">
            <p className="text-sm">
              Signed in as <span className="font-medium">{connection.account}</span>
              <span className="text-muted-foreground"> · installed {formatDate(connection.installedAt)}</span>
            </p>
            <div>
              <p className="text-xs text-muted-foreground">Repositories the app can read ({selected.length})</p>
              <ul className="mt-1.5 space-y-1">
                {selected.map((r) => (
                  <li key={r.name} className="flex items-center gap-2 font-mono text-[12.5px]">
                    {r.private && <Lock className="size-3 text-muted-foreground" />}
                    {r.name}
                  </li>
                ))}
                {selected.length === 0 && <li className="text-sm text-muted-foreground">No repositories selected yet.</li>}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Connect GitHub to submit Module 5 projects. You choose exactly which repositories to share.</p>
        )}
      </CardContent>
      <CardFooter className="flex-wrap">
        {isConnected ? (
          <>
            <Button variant="outline" size="sm" onClick={() => setManageOpen(true)}>
              <Settings2 /> Manage repositories
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                setConnected(false);
                connect.reset();
                toast({ title: "GitHub disconnected" });
              }}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={connect.run} disabled={connect.isLoading}>
            {connect.isLoading ? <LoaderCircle className="animate-spin" /> : <GitHubIcon className="size-4" />}
            {connect.isLoading ? "Waiting for GitHub…" : "Install the GitHub App"}
          </Button>
        )}
      </CardFooter>

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Repository access</DialogTitle>
            <DialogDescription>Choose which repositories the Edge Career app can read.</DialogDescription>
          </DialogHeader>
          <ul className="divide-y rounded-md border">
            {repos.map((r) => (
              <li key={r.name}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5">
                  <Checkbox
                    checked={r.selected}
                    onCheckedChange={(checked) => setRepos((list) => list.map((x) => (x.name === r.name ? { ...x, selected: checked === true } : x)))}
                  />
                  <span className="flex-1 font-mono text-[12.5px]">{r.name}</span>
                  {r.private && <Badge variant="muted">Private</Badge>}
                </label>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button
              onClick={() => {
                setManageOpen(false);
                toast({ title: "Repository access updated", variant: "success" });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
