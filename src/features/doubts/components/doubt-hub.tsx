"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HINT_LEVELS, type DoubtMessage, type DoubtThread, type HintLevel } from "@/types/doubts";
import { ContextPanel } from "./context-panel";
import { ChatPane, ConversationHeader, type HubView } from "./conversation";
import { ThreadList, type StatusFilter } from "./thread-list";

const NEW_THREAD_TITLE = "New doubt";
const REPLY_DELAY_MS = 1400;

/** Canned reply for the mock. The real reply comes from the AI layer with this thread's context. */
function cannedReply(thread: DoubtThread): string {
  const { lastResult, lessonMoment } = thread.context;
  if (lastResult && lastResult.tone !== "info") {
    const firstLine = lastResult.detail.split("\n")[0];
    return `Start from the failing case: \`${firstLine}\`. Trace your code on it by hand. Which line is the first to produce a value you didn't expect? Ask for the next hint whenever you want more help.`;
  }
  if (lessonMoment) {
    return `Good question. The idea at ${formatClock(lessonMoment.atSec)} in “${lessonMoment.lessonTitle}” is easiest to see with a tiny example: try it with three items first, then explain it back in your own words. If it's still unclear, ask for a hint and I'll go one step further.`;
  }
  return "Thanks, that helps. Can you share the problem or lesson this is about, and what you've tried so far? Then I can point you to the right concept without giving away the answer.";
}

export function DoubtHub({
  initialThreads,
  initialSelectedId,
  newThreadHints,
}: {
  initialThreads: DoubtThread[];
  initialSelectedId: string;
  newThreadHints: DoubtThread["hints"];
}) {
  const { toast } = useToast();
  const [threads, setThreads] = React.useState(initialThreads);
  const [selectedId, setSelectedId] = React.useState(initialSelectedId);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<StatusFilter>("all");
  const [typingId, setTypingId] = React.useState<string | null>(null);
  const [listOpen, setListOpen] = React.useState(false);
  const [view, setView] = React.useState<HubView>("chat");
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextId = React.useRef(0);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const thread = threads.find((t) => t.id === selectedId) ?? threads[0];

  function updateThread(id: string, change: (t: DoubtThread) => DoubtThread) {
    setThreads((list) => list.map((t) => (t.id === id ? change(t) : t)));
  }

  function newMessage(role: DoubtMessage["role"], content: string, hintLevel?: HintLevel): DoubtMessage {
    nextId.current += 1;
    return { id: `local-${nextId.current}`, role, content, hintLevel, at: new Date().toISOString() };
  }

  /** Shows the typing state, then appends the assistant's reply. */
  function replyLater(id: string, content: (t: DoubtThread) => string, hintLevel?: HintLevel) {
    setTypingId(id);
    const timer = setTimeout(() => {
      setThreads((list) =>
        list.map((t) =>
          t.id === id
            ? {
                ...t,
                hintsGiven: hintLevel ? [...t.hintsGiven, hintLevel] : t.hintsGiven,
                messages: [...t.messages, { ...newMessage("assistant", content(t), hintLevel) }],
              }
            : t,
        ),
      );
      setTypingId(null);
    }, REPLY_DELAY_MS);
    timers.current.push(timer);
  }

  function send(text: string) {
    if (!thread) return;
    const message = newMessage("learner", text);
    updateThread(thread.id, (t) => ({
      ...t,
      draft: false,
      title: t.title === NEW_THREAD_TITLE ? (text.length > 60 ? `${text.slice(0, 57)}…` : text) : t.title,
      updatedAt: message.at,
      messages: [...t.messages, message],
    }));
    replyLater(thread.id, cannedReply);
  }

  function requestHint() {
    if (!thread) return;
    const next = HINT_LEVELS[thread.hintsGiven.length];
    if (!next) return;
    const message = newMessage("learner", `Can I have a ${next.label.toLowerCase()} hint?`);
    updateThread(thread.id, (t) => ({ ...t, draft: false, updatedAt: message.at, messages: [...t.messages, message] }));
    replyLater(thread.id, (t) => t.hints[next.id], next.id);
  }

  function toggleResolved() {
    if (!thread) return;
    const resolved = thread.status !== "resolved";
    updateThread(thread.id, (t) => ({ ...t, status: resolved ? "resolved" : "open" }));
    toast({ title: resolved ? "Marked as resolved" : "Doubt reopened", variant: resolved ? "success" : "default" });
  }

  function createThread() {
    nextId.current += 1;
    const draft: DoubtThread = {
      id: `draft-new-${nextId.current}`,
      title: NEW_THREAD_TITLE,
      source: "general",
      status: "open",
      updatedAt: new Date().toISOString(),
      hintsGiven: [],
      hints: newThreadHints,
      messages: [],
      draft: true,
      context: {},
    };
    setThreads((list) => [draft, ...list]);
    select(draft.id);
  }

  function select(id: string) {
    setSelectedId(id);
    setListOpen(false);
    setView("chat");
  }

  const list = (
    <ThreadList
      threads={threads}
      selectedId={thread?.id ?? ""}
      query={query}
      filter={filter}
      onQueryChange={setQuery}
      onFilterChange={setFilter}
      onSelect={select}
      onNew={createThread}
    />
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0">
      <aside className="hidden w-72 shrink-0 border-r bg-card lg:block">{list}</aside>
      <Sheet open={listOpen} onOpenChange={setListOpen}>
        <SheetContent side="left" className="w-80 gap-0 p-0">
          <SheetTitle className="sr-only">Your doubts</SheetTitle>
          {list}
        </SheetContent>
      </Sheet>

      {thread && (
        <>
          <section className="flex min-w-0 flex-1 flex-col" aria-label="Conversation">
            <ConversationHeader
              thread={thread}
              view={view}
              onViewChange={setView}
              onOpenList={() => setListOpen(true)}
              onToggleResolved={toggleResolved}
            />
            <div className={cn("min-h-0 flex-1 overflow-y-auto bg-card xl:hidden", view !== "context" && "hidden")}>
              <ContextPanel context={thread.context} />
            </div>
            <ChatPane
              key={thread.id}
              thread={thread}
              typing={typingId === thread.id}
              onSend={send}
              onHint={requestHint}
              className={cn(view === "context" && "hidden xl:flex")}
            />
          </section>

          <aside className="hidden w-88 shrink-0 overflow-y-auto border-l bg-card xl:block" aria-label="Context">
            <ContextPanel context={thread.context} />
          </aside>
        </>
      )}
    </div>
  );
}
