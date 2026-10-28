"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useSimulatedAction } from "@/hooks/use-simulated-action";
import { routes } from "@/lib/routes";
import type { ExamDetail, ExamQuestion } from "@/types/assessments";
import type { Language } from "@/types/practice";
import { defaultLanguage, INTEGRITY_LABELS, isAnswered, type Answer, type IntegrityEvent } from "./attempt-types";
import { ExamTimer } from "./exam-timer";
import { IntegrityLog } from "./integrity-log";
import { QuestionNavigator, QuestionStrip, type NavigatorState } from "./question-navigator";
import { QuestionPanel } from "./question-panel";
import { SubmitExamDialog } from "./submit-exam-dialog";

/** Full-screen exam. All state is local in the mock; answers would autosave to the API. */
export function ExamAttempt({ exam, questions }: { exam: ExamDetail; questions: ExamQuestion[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const totalSec = exam.durationMin * 60;

  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  const [languages, setLanguages] = React.useState<Record<string, Language>>({});
  const [flagged, setFlagged] = React.useState<string[]>([]);
  const [events, setEvents] = React.useState<IntegrityEvent[]>([]);
  const [remaining, setRemaining] = React.useState(totalSec);
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const submit = useSimulatedAction(() => true, 1500);

  // Countdown.
  React.useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  // Leave for the result page once submitted, or when time runs out.
  React.useEffect(() => {
    if (submit.status === "success" || remaining === 0) router.push(routes.examResult(exam.id));
  }, [submit.status, remaining, router, exam.id]);

  // Integrity logging: pastes, tab switches and leaving the window.
  const live = React.useRef({ current, remaining });
  const eventId = React.useRef(0);
  React.useEffect(() => {
    live.current = { current, remaining };
  });
  React.useEffect(() => {
    function log(kind: IntegrityEvent["kind"]) {
      const { current: index, remaining: left } = live.current;
      const id = ++eventId.current;
      setEvents((list) => [...list, { id, kind, atSec: totalSec - left, questionNumber: index + 1 }]);
      toast({ title: `${INTEGRITY_LABELS[kind]} — logged`, description: "Logged events are reviewed with your result." });
    }
    const onPaste = () => log("paste");
    const onVisibility = () => {
      if (document.visibilityState === "hidden") log("tab_switch");
    };
    let blurTimer: ReturnType<typeof setTimeout> | undefined;
    const onBlur = () => {
      // A tab switch fires blur first; only log "left the window" when the tab is still visible.
      blurTimer = setTimeout(() => {
        if (document.visibilityState === "visible") log("focus_loss");
      }, 150);
    };
    document.addEventListener("paste", onPaste, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      clearTimeout(blurTimer);
      document.removeEventListener("paste", onPaste, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [toast, totalSec]);

  const languageFor = (q: ExamQuestion) => languages[q.id] ?? defaultLanguage(q);
  const states: NavigatorState[] = questions.map((q) => ({
    answered: isAnswered(q, answers[q.id], languageFor(q)),
    flagged: flagged.includes(q.id),
  }));
  const question = questions[current]!;

  function goTo(index: number) {
    setCurrent(Math.min(questions.length - 1, Math.max(0, index)));
  }

  function changeLanguage(q: ExamQuestion, language: Language) {
    setLanguages((l) => ({ ...l, [q.id]: language }));
    setAnswers((a) => ({ ...a, [q.id]: q.starterCode?.[language] ?? "" }));
  }

  const submitButton = (
    <Button size="sm" onClick={() => setSubmitOpen(true)}>
      <Send /> <span className="hidden sm:inline">Submit</span>
    </Button>
  );

  return (
    <>
      <WorkspaceHeader
        backHref={routes.exam(exam.id)}
        backLabel="Exam details"
        title={exam.title}
        meta={<Badge variant="outline">Attempt {exam.attempts.length + 1}</Badge>}
        center={<ExamTimer remainingSec={remaining} />}
        actions={
          <>
            <IntegrityLog events={events} />
            {submitButton}
          </>
        }
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
          <QuestionNavigator questions={questions} states={states} current={current} onSelect={goTo} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b bg-card px-3 lg:hidden">
            <div className="min-w-0 flex-1">
              <QuestionStrip states={states} current={current} onSelect={goTo} />
            </div>
            <ExamTimer remainingSec={remaining} className="md:hidden" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <QuestionPanel
              key={question.id}
              question={question}
              number={current + 1}
              total={questions.length}
              answer={answers[question.id]}
              language={languageFor(question)}
              flagged={flagged.includes(question.id)}
              onAnswer={(value) => setAnswers((a) => ({ ...a, [question.id]: value }))}
              onLanguageChange={(language) => changeLanguage(question, language)}
              onToggleFlag={() =>
                setFlagged((list) => (list.includes(question.id) ? list.filter((id) => id !== question.id) : [...list, question.id]))
              }
            />
          </div>

          <footer className="flex items-center justify-between gap-2 border-t bg-card px-4 py-3">
            <Button variant="outline" size="sm" onClick={() => goTo(current - 1)} disabled={current === 0}>
              <ChevronLeft /> Previous
            </Button>
            <span className="text-[13px] text-muted-foreground tabular-nums">
              {states.filter((s) => s.answered).length}/{questions.length} answered
            </span>
            {current < questions.length - 1 ? (
              <Button size="sm" onClick={() => goTo(current + 1)}>
                Next <ChevronRight />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setSubmitOpen(true)}>
                <Send /> Review and submit
              </Button>
            )}
          </footer>
        </div>
      </div>

      <SubmitExamDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        states={states}
        remainingSec={remaining}
        integrityEvents={events.length}
        submitting={submit.isLoading || submit.status === "success"}
        onSubmit={submit.run}
        onJump={(index) => {
          setSubmitOpen(false);
          goTo(index);
        }}
      />
    </>
  );
}
