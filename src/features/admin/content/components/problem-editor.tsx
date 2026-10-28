"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { DifficultyBadge } from "@/components/shared/status-badges";
import { CiStatusBadge } from "@/features/admin/content/content-badges";
import { ChecksPanel } from "@/features/admin/content/components/checks-panel";
import { OpenPrDialog } from "@/features/admin/content/components/open-pr-dialog";
import { ProblemCodeTab } from "@/features/admin/content/components/problem-code-tab";
import { ProblemDetailsTab } from "@/features/admin/content/components/problem-details-tab";
import { ProblemRubricTab } from "@/features/admin/content/components/problem-rubric-tab";
import { ProblemTestsTab } from "@/features/admin/content/components/problem-tests-tab";
import { VersionHistory } from "@/features/admin/content/components/version-history";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { routes } from "@/lib/routes";
import type { CiCheck, CommitEntry, HiddenTestGroup, ProblemFileMeta, Rubric } from "@/types/admin-content";
import type { CodeLanguage, ProblemDetail } from "@/types/practice";

export interface ProblemEditorProps {
  problem: ProblemDetail;
  file: ProblemFileMeta;
  checks: CiCheck[];
  hiddenGroups: HiddenTestGroup[];
  history: CommitEntry[];
  rubric: Rubric;
  modules: { id: string; title: string }[];
  signature: string;
  harnesses: Partial<Record<CodeLanguage, string>>;
  referenceSolution: string;
  schemaSql: string;
}

export function ProblemEditor(props: ProblemEditorProps) {
  const { problem, file, checks } = props;
  const [dirty, setDirty] = React.useState(false);
  const markDirty = React.useCallback(() => setDirty(true), []);
  const rerun = useSimulatedAction(() => checks, 2200);
  const path = `content/problems/${problem.id}/`;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: routes.admin.overview },
          { label: "Curriculum & problems", href: `${routes.admin.content}?tab=problems` },
          { label: problem.title },
        ]}
        title={problem.title}
        description={
          <span className="flex items-center gap-1.5">
            <FileCode className="size-3.5" /> <code className="text-xs">{path}problem.yaml</code>
          </span>
        }
        meta={
          <>
            <Badge variant="outline" className="uppercase">
              {problem.kind}
            </Badge>
            <DifficultyBadge difficulty={problem.difficulty} />
            {rerun.isLoading ? <CiStatusBadge status="running" /> : <CiStatusBadge status={file.ciStatus} />}
            {dirty && <Badge variant="warning">Unsaved changes</Badge>}
          </>
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={routes.problem(problem.id)} target="_blank">
                <ExternalLink /> Preview as learner
              </Link>
            </Button>
            <OpenPrDialog path={path} defaultTitle={`Update ${problem.id}`} dirty={dirty} />
          </>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="details" className="min-w-0">
          <TabsList variant="line">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="code">{problem.kind === "sql" ? "Schema & reference" : "Signature & boilerplate"}</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <ProblemDetailsTab problem={problem} modules={props.modules} onChange={markDirty} />
          </TabsContent>
          <TabsContent value="code">
            <ProblemCodeTab
              problem={problem}
              signature={props.signature}
              harnesses={props.harnesses}
              referenceSolution={props.referenceSolution}
              schemaSql={props.schemaSql}
            />
          </TabsContent>
          <TabsContent value="tests">
            <ProblemTestsTab sampleTests={problem.sampleTests} hiddenGroups={props.hiddenGroups} onChange={markDirty} />
          </TabsContent>
          <TabsContent value="rubric">
            <ProblemRubricTab rubric={props.rubric} onChange={markDirty} />
          </TabsContent>
          <TabsContent value="history">
            <VersionHistory commits={props.history} description="Every change to this folder, newest first." />
          </TabsContent>
        </Tabs>

        <aside className="space-y-4">
          <ChecksPanel checks={checks} running={rerun.isLoading} onRerun={rerun.run} />
          <Card>
            <CardHeader>
              <CardTitle>File</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
                <dt className="text-muted-foreground">Author</dt>
                <dd>{file.author}</dd>
                <dt className="text-muted-foreground">Limits</dt>
                <dd>
                  {problem.timeLimitMs / 1000} s · {problem.memoryLimitMb} MB
                </dd>
                <dt className="text-muted-foreground">Tests</dt>
                <dd>
                  {file.sampleTests} sample · {file.hiddenTests} hidden
                </dd>
                <dt className="text-muted-foreground">Rubric</dt>
                <dd>
                  <code className="text-xs">{file.rubricVersion}</code>
                </dd>
                <dt className="text-muted-foreground">Last commit</dt>
                <dd>
                  <code className="text-xs">{file.lastCommit.sha}</code>
                </dd>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
