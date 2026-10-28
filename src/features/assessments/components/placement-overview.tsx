import Link from "next/link";
import { ArrowRight, Clock, Compass, Info, ShieldCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatMinutes } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ExamDetail, PlacementSummary } from "@/types/assessments";
import { ExamSectionsTable } from "./exam-sections-table";
import { PlacementResultList } from "./placement-result-list";

const STEPS = [
  { title: "One section per module", detail: "Each section covers one core module you might already know." },
  { title: "Score 85% or more to test out", detail: "That module is marked tested out and the next one unlocks right away." },
  { title: "Below 85%, nothing is lost", detail: "You start that module normally, and your score sets which lessons we suggest first." },
];

export function PlacementOverview({ exam, summary }: { exam: ExamDetail; summary: PlacementSummary }) {
  const testedOut = summary.sections.filter((s) => s.testedOut);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Assessments", href: routes.assessments }, { label: "Placement test" }]}
        title="Placement test"
        description="Already comfortable with the basics? Test out of the modules you know instead of working through every lesson."
        actions={
          <Button asChild>
            <Link href={routes.examAttempt(exam.id)}>
              <Compass /> Retake placement test
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                {formatMinutes(exam.durationMin)} in total. You can stop after any section; finished sections still count.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-4 sm:grid-cols-3">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="rounded-lg border p-4">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <p className="mt-3 text-sm font-medium">{step.title}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Questions are drawn at random from a pool of {exam.poolSize}.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <ExamSectionsTable sections={exam.sections} />
            </CardContent>
          </Card>

          <Alert variant="info">
            <Info />
            <AlertTitle>Modules 5 and 6 can&apos;t be tested out</AlertTitle>
            <AlertDescription>
              Production Engineering and AI &amp; ML Engineering are graded on projects you build, so everyone completes them.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your last result</CardTitle>
              <CardDescription>
                Taken {formatDate(summary.takenAt)} · {formatMinutes(summary.durationMin)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <PlacementResultList sections={summary.sections} />
              <div className="rounded-md bg-success/8 px-3 py-2.5 text-[13px]">
                You tested out of {testedOut.map((s) => s.moduleTitle).join(", ")}. Other modules start from their first lesson.
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={routes.examResult(exam.id)}>
                  View full result <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="gap-3 p-5 text-[13px]">
            <p className="flex items-center gap-2 font-medium">
              <Clock className="size-4 text-muted-foreground" /> Retake policy
            </p>
            <p className="text-muted-foreground">
              You can retake the placement test once every 30 days. A retake only adds tested-out modules; it never locks one you
              already have. Available since {formatDate(summary.nextAvailableAt)}.
            </p>
            <p className="flex items-center gap-2 font-medium">
              <ShieldCheck className="size-4 text-muted-foreground" /> Same integrity rules
            </p>
            <p className="text-muted-foreground">Pastes and tab switches are logged, as in checkpoint exams.</p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
