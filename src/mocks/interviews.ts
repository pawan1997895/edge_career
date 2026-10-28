import { routes } from "@/lib/routes";
import type {
  InterviewStage,
  InterviewSummary,
  LiveSession,
  Scorecard,
  ScriptedTurn,
  TranscriptTurn,
} from "@/types/interviews";

// Compact transcript rows: [speaker, minute:second, stage, text]. "I" = interviewer, "C" = candidate.
type Row = ["I" | "C", string, InterviewStage, string];

function transcript(sessionId: string, rows: Row[]): TranscriptTurn[] {
  return rows.map(([speaker, at, stage, text], i) => {
    const [m, s] = at.split(":").map(Number);
    return {
      id: `${sessionId}-t${i + 1}`,
      speaker: speaker === "I" ? "interviewer" : "candidate",
      atSec: (m ?? 0) * 60 + (s ?? 0),
      stage,
      text,
    };
  });
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export const interviewHistory: InterviewSummary[] = [
  {
    id: "iv-2041",
    type: "dsa",
    mode: "voice",
    title: "Rotting oranges",
    company: "Google",
    startedAt: "2026-10-26T20:30:00+05:30",
    durationMin: 45,
    status: "completed",
    overallScore: 3.6,
    recommendation: "lean_hire",
  },
  {
    id: "iv-2033",
    type: "hld",
    mode: "text",
    title: "Design a notification service",
    company: "Uber",
    startedAt: "2026-10-18T19:00:00+05:30",
    durationMin: 60,
    status: "completed",
    overallScore: 3.3,
    recommendation: "lean_hire",
  },
  {
    id: "iv-2027",
    type: "behavioral",
    mode: "voice",
    title: "Ownership and conflict",
    company: "Atlassian",
    startedAt: "2026-10-10T08:00:00+05:30",
    durationMin: 30,
    status: "completed",
    overallScore: 3.1,
    recommendation: "lean_no_hire",
  },
  {
    id: "iv-2019",
    type: "dsa",
    mode: "text",
    title: "Merge intervals",
    startedAt: "2026-09-28T21:15:00+05:30",
    durationMin: 45,
    status: "completed",
    overallScore: 3.1,
    recommendation: "lean_no_hire",
  },
  {
    id: "iv-2012",
    type: "lld",
    mode: "text",
    title: "Design a parking lot",
    startedAt: "2026-09-17T20:00:00+05:30",
    durationMin: 60,
    status: "completed",
    overallScore: 2.9,
    recommendation: "lean_no_hire",
  },
  {
    id: "iv-2004",
    type: "dsa",
    mode: "text",
    title: "Two sum",
    startedAt: "2026-09-06T22:10:00+05:30",
    durationMin: 4,
    status: "incomplete",
    note: "Ended after 4 minutes. Not scored and no minutes were charged.",
  },
];

// ---------------------------------------------------------------------------
// Scorecards
// ---------------------------------------------------------------------------

const iv2041Transcript = transcript("iv-2041", [
  ["I", "0:05", "intro", "Hi Aarav, thanks for joining. This is a 45-minute coding round. Could you start with a short introduction?"],
  ["C", "0:18", "intro", "Sure. I'm a backend engineer at a fintech startup in Bengaluru, about two years in. I mostly build payment reconciliation services in Java and Go."],
  ["I", "1:40", "problem", "Great. Here's the problem. You get a grid where 0 is empty, 1 is a fresh orange and 2 is a rotten one. Every minute, rotten oranges rot their four neighbours. Return the minutes until no fresh orange is left, or -1 if that never happens."],
  ["C", "2:55", "clarifying", "Can there be several rotten oranges at the start? And if there are no fresh oranges at all, should I return 0?"],
  ["I", "3:20", "clarifying", "Yes to both. Several rotten oranges can exist, and an empty or already-rotten grid returns 0."],
  ["C", "4:10", "clarifying", "And the grid is at most around 10 by 10, or could it be large?"],
  ["I", "4:22", "clarifying", "Assume up to 1,000 by 1,000."],
  ["C", "5:30", "approach", "Then I'd treat every rotten orange as a BFS source at minute zero, so all of them spread in parallel. I'll count fresh oranges up front and decrement as they rot, so I know at the end whether any were unreachable."],
  ["I", "7:05", "approach", "Why BFS rather than DFS here?"],
  ["C", "7:30", "approach", "BFS processes the grid level by level, and each level is exactly one minute. DFS would reach cells by long paths first and I'd have to keep updating the minimum time per cell."],
  ["I", "9:45", "code", "Sounds good. Go ahead and code it, and talk me through it."],
  ["C", "12:10", "code", "I'm pushing all rotten cells into a deque first, then processing one level per minute and checking the four directions."],
  ["I", "21:30", "code", "Let's dry-run the first example. What does your function return?"],
  ["C", "22:15", "code", "It returns 5, but the expected answer is 4. I think I'm counting the last level even when nothing new rotted. I'll only increment minutes when at least one orange rots in that level."],
  ["I", "24:40", "code", "Okay, that fixes it. Anything else you'd check?"],
  ["C", "25:05", "code", "The case where fresh oranges are left over. I return -1 if the fresh count is still above zero."],
  ["I", "27:10", "complexity", "What's the time and space complexity?"],
  ["C", "27:35", "complexity", "Every cell enters the queue at most once, so time is O(m × n). Space is O(m × n) in the worst case when most cells are rotten at once."],
  ["I", "31:20", "follow_ups", "Suppose the grid is huge and updates arrive as a stream: an orange can be added at any moment. How would you keep the answer up to date?"],
  ["C", "32:40", "follow_ups", "Hmm. I think I'd rerun the BFS when an update comes in. Maybe only from the changed cell… I'm not fully sure how to bound it."],
  ["I", "35:05", "follow_ups", "That's fine. One idea is to store each cell's rot time and only propagate where the new time is smaller. Could you reason about the cost?"],
  ["C", "36:20", "follow_ups", "Then each update touches only the cells whose time improves, so it's proportional to the affected region, not the whole grid."],
  ["I", "41:30", "wrap_up", "We're nearly out of time. Do you have any questions for me?"],
  ["C", "41:50", "wrap_up", "Yes: how does your team decide between BFS-style batch jobs and incremental updates in production?"],
  ["I", "43:40", "wrap_up", "Good question, usually it comes down to update frequency and freshness needs. Thanks Aarav, that's the end of the interview."],
]);

const iv2033Transcript = transcript("iv-2033", [
  ["I", "0:10", "intro", "Hi Aarav. Today we'll design a notification service for a ride-hailing app. Ready?"],
  ["C", "0:40", "intro", "Ready. I've worked on webhook delivery at my current job, so I'm familiar with retries and idempotency."],
  ["I", "1:30", "problem", "The service sends push, SMS and email notifications for trip events: driver assigned, driver arriving, trip receipts. Peak is about 50,000 notifications per second."],
  ["C", "3:05", "clarifying", "Do all notification types need the same delivery guarantee? A receipt email can be late, but 'driver arriving' is time-sensitive."],
  ["I", "3:40", "clarifying", "Right. Time-sensitive pushes should arrive within 2 seconds at p99. Receipts can take minutes."],
  ["C", "6:20", "approach", "I'd put a Kafka topic per priority, with separate consumer pools so a backlog of receipts never delays arrival alerts. Each consumer calls the right provider: FCM, APNs, an SMS gateway or SES."],
  ["I", "12:45", "approach", "How do you avoid sending the same notification twice when a consumer retries?"],
  ["C", "13:30", "approach", "Each event carries an idempotency key. Before sending, the consumer writes the key to Redis with a TTL; if the write fails because the key exists, it skips."],
  ["I", "24:10", "complexity", "Walk me through your capacity estimate for the queue and the dedupe store."],
  ["C", "25:30", "complexity", "50,000 per second at about 1 KB each is 50 MB/s into Kafka. For Redis, keys live for an hour, so roughly 180 million keys at maybe 100 bytes, about 18 GB, so a small cluster."],
  ["I", "33:00", "follow_ups", "The SMS provider in one region goes down for 20 minutes. What happens?"],
  ["C", "34:15", "follow_ups", "Retries with backoff… and I guess the messages would pile up in the queue until it recovers."],
  ["I", "35:30", "follow_ups", "Would you ever fail over to a second provider?"],
  ["C", "36:40", "follow_ups", "Yes, I should add a circuit breaker per provider and route to a secondary SMS vendor when it opens. I didn't include that in the diagram."],
  ["I", "55:20", "wrap_up", "Good. Let's stop here. Anything you'd change with more time?"],
  ["C", "55:50", "wrap_up", "I'd add per-user rate limits and a preferences service so users can mute categories."],
]);

const iv2027Transcript = transcript("iv-2027", [
  ["I", "0:05", "intro", "Hi Aarav. This round is about how you work with people. There are no right answers; I'm interested in specific examples."],
  ["C", "0:20", "intro", "Sounds good."],
  ["I", "1:10", "problem", "Tell me about a time you disagreed with a teammate on a technical decision."],
  ["C", "1:45", "approach", "We were deciding whether to move reconciliation jobs from cron to a queue. My lead wanted to keep cron. We discussed it and eventually we went with the queue."],
  ["I", "4:30", "clarifying", "What exactly did you do to resolve the disagreement?"],
  ["C", "5:10", "approach", "I wrote a one-page doc comparing failure modes and ran both versions on a week of production data. The queue version cut late reconciliations from 40 a week to 3."],
  ["I", "9:20", "follow_ups", "What would you do differently if you faced that situation again?"],
  ["C", "10:05", "follow_ups", "I'd bring the data earlier. We spent two weeks debating before I ran the comparison."],
  ["I", "14:00", "problem", "Tell me about a project you owned end to end."],
  ["C", "14:40", "approach", "I owned the refund-status API. I designed it, wrote most of it, and got it to production with the team."],
  ["I", "17:30", "clarifying", "Which parts were specifically yours, and what was the outcome?"],
  ["C", "18:15", "approach", "The API design and the retry logic were mine. Support tickets about refund status dropped, I think by about a third."],
  ["I", "27:40", "wrap_up", "Thanks Aarav, that's all from me."],
]);

const iv2019Transcript = transcript("iv-2019", [
  ["I", "0:08", "intro", "Hi Aarav, this is a 45-minute coding round over text. Ready when you are."],
  ["I", "1:00", "problem", "Given a list of intervals, merge all overlapping intervals and return the result."],
  ["C", "2:30", "clarifying", "Are the intervals sorted? And do [1,2] and [2,3] count as overlapping?"],
  ["I", "3:00", "clarifying", "Not sorted, and yes, touching intervals merge."],
  ["C", "4:40", "approach", "Sort by start, then walk through and extend the last merged interval while the next one starts before it ends."],
  ["I", "18:20", "code", "Your code fails on [[1,4],[2,3]]. Can you see why?"],
  ["C", "20:05", "code", "I'm setting the end to the new interval's end instead of the max of both. Fixed now."],
  ["I", "26:30", "complexity", "Complexity?"],
  ["C", "27:00", "complexity", "O(n log n) for the sort and O(n) for the scan."],
  ["I", "40:10", "wrap_up", "Thanks, that's time."],
]);

const iv2012Transcript = transcript("iv-2012", [
  ["I", "0:10", "intro", "Hi Aarav. Today's low-level design question: design a parking lot system."],
  ["C", "1:20", "clarifying", "How many levels, and which vehicle types? Do we need payments?"],
  ["I", "2:00", "clarifying", "Multiple levels; bikes, cars and trucks; hourly pricing with a ticket at entry."],
  ["C", "6:30", "approach", "Classes: ParkingLot, Level, ParkingSpot, Vehicle, Ticket. The lot finds the first free spot that fits the vehicle."],
  ["I", "14:00", "follow_ups", "How would you add weekend pricing without changing ParkingLot?"],
  ["C", "15:30", "follow_ups", "I'd add an if-else on the day in the fee calculation."],
  ["I", "16:10", "follow_ups", "Could a pattern help keep pricing rules separate?"],
  ["C", "17:20", "follow_ups", "A strategy interface for pricing, with weekday and weekend implementations."],
  ["I", "55:00", "wrap_up", "Thanks Aarav, that's time."],
]);

export const scorecards: Scorecard[] = [
  {
    ...interviewHistory[0]!,
    summary:
      "Strong start: you clarified edge cases and chose multi-source BFS with a clear reason. An off-by-one in the minute counter cost about five minutes, and the streaming follow-up needed a hint. Practise variant questions and dry-run before declaring code complete.",
    metrics: [
      {
        key: "problem_solving",
        score: 3.8,
        summary: "Asked the right clarifying questions and reached the optimal approach without hints.",
        evidence: [
          { turnId: "iv-2041-t4", quote: "Can there be several rotten oranges at the start? And if there are no fresh oranges at all, should I return 0?" },
          { turnId: "iv-2041-t8", quote: "I'd treat every rotten orange as a BFS source at minute zero, so all of them spread in parallel." },
        ],
        tips: [
          "State the edge cases you'll handle out loud before coding, then tick them off at the end.",
          "When you pick an algorithm, mention the alternative you rejected in one sentence; you did this well for BFS vs DFS.",
        ],
      },
      {
        key: "coding",
        score: 3.5,
        summary: "Clean, readable BFS, but the minute counter was off by one until the interviewer asked for a dry run.",
        evidence: [
          { turnId: "iv-2041-t14", quote: "It returns 5, but the expected answer is 4. I think I'm counting the last level even when nothing new rotted." },
        ],
        tips: [
          "Dry-run a 2×2 or 3×3 grid yourself before saying you're done.",
          "Level-order BFS: count a level only when it changes state. Keep a template for this pattern.",
        ],
      },
      {
        key: "communication",
        score: 4.0,
        summary: "Thought out loud consistently and explained each decision as you made it.",
        evidence: [
          { turnId: "iv-2041-t10", quote: "BFS processes the grid level by level, and each level is exactly one minute." },
          { turnId: "iv-2041-t12", quote: "I'm pushing all rotten cells into a deque first, then processing one level per minute." },
        ],
        tips: ["Open with a one-sentence summary of your approach before the details, so the interviewer can redirect you early."],
      },
      {
        key: "technical_depth",
        score: 3.2,
        summary: "Complexity analysis was correct; the streaming follow-up needed a hint before you could bound the cost.",
        evidence: [
          { turnId: "iv-2041-t18", quote: "Every cell enters the queue at most once, so time is O(m × n)." },
          { turnId: "iv-2041-t20", quote: "I think I'd rerun the BFS when an update comes in. Maybe only from the changed cell… I'm not fully sure how to bound it." },
        ],
        tips: [
          "Practise incremental versions of graph problems: what changes when one cell or edge updates?",
          "When unsure, reason about what work is strictly necessary and bound that, rather than rerunning everything.",
        ],
      },
    ],
    stageTimings: [
      { stage: "intro", actualMin: 1.5 },
      { stage: "problem", actualMin: 1.3 },
      { stage: "clarifying", actualMin: 2.6 },
      { stage: "approach", actualMin: 4.3 },
      { stage: "code", actualMin: 17.4 },
      { stage: "complexity", actualMin: 4.2 },
      { stage: "follow_ups", actualMin: 10.2 },
      { stage: "wrap_up", actualMin: 3.5 },
    ],
    transcript: iv2041Transcript,
    finalArtifact: {
      kind: "code",
      language: "python",
      content: `from collections import deque

class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        queue = deque()
        fresh = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    queue.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1

        minutes = 0
        while queue and fresh:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        queue.append((nr, nc))
            minutes += 1

        return minutes if fresh == 0 else -1
`,
    },
    practiseNext: [
      { title: "Course schedule", href: routes.problem("course-schedule"), reason: "More BFS on graphs, with a cycle-detection twist" },
      { title: "Word ladder", href: routes.problem("word-ladder"), reason: "Level-order BFS where the counter is easy to get wrong" },
      { title: "Lesson: BFS, DFS and topological sort", href: routes.lesson("lesson-graph-traversal"), reason: "Review incremental and multi-source BFS" },
    ],
  },
  {
    ...interviewHistory[1]!,
    summary:
      "Good separation of priorities and a sensible dedupe design. Capacity estimates were reasonable. Provider failure handling only appeared after prompting, which is what held technical depth back.",
    metrics: [
      {
        key: "problem_solving",
        score: 3.4,
        summary: "Clarified delivery guarantees per notification type early, which shaped the whole design.",
        evidence: [{ turnId: "iv-2033-t4", quote: "Do all notification types need the same delivery guarantee? A receipt email can be late, but 'driver arriving' is time-sensitive." }],
        tips: ["List functional and non-functional requirements explicitly before drawing the first box."],
      },
      { key: "coding", score: null, summary: "Not assessed in high-level design rounds.", evidence: [], tips: [] },
      {
        key: "communication",
        score: 3.6,
        summary: "Structured answers clearly; explained the dedupe flow step by step.",
        evidence: [{ turnId: "iv-2033-t8", quote: "Each event carries an idempotency key. Before sending, the consumer writes the key to Redis with a TTL." }],
        tips: ["Summarise the end-to-end flow once the diagram is done, from event to delivered notification."],
      },
      {
        key: "technical_depth",
        score: 2.9,
        summary: "Missed provider failover until asked, and did not discuss per-user rate limits until wrap-up.",
        evidence: [
          { turnId: "iv-2033-t12", quote: "Retries with backoff… and I guess the messages would pile up in the queue until it recovers." },
          { turnId: "iv-2033-t14", quote: "I should add a circuit breaker per provider and route to a secondary SMS vendor when it opens." },
        ],
        tips: [
          "For every external dependency in your diagram, say what happens when it is slow or down.",
          "Revise circuit breakers, bulkheads and multi-vendor failover.",
        ],
      },
    ],
    stageTimings: [
      { stage: "intro", actualMin: 1.3 },
      { stage: "problem", actualMin: 1.6 },
      { stage: "clarifying", actualMin: 3.3 },
      { stage: "approach", actualMin: 17.8 },
      { stage: "code", actualMin: 0 },
      { stage: "complexity", actualMin: 8.8 },
      { stage: "follow_ups", actualMin: 22.3 },
      { stage: "wrap_up", actualMin: 4.7 },
    ],
    transcript: iv2033Transcript,
    finalArtifact: {
      kind: "notes",
      content:
        "Requirements\n- Push, SMS, email for trip events\n- Arrival alerts p99 < 2 s; receipts can lag minutes\n- 50k notifications/s at peak\n\nDesign\n- Kafka topics per priority (high, normal, bulk)\n- Separate consumer pools per topic\n- Idempotency key per event, Redis SET NX with 1 h TTL\n- Providers: FCM, APNs, SMS gateway, SES\n\nEstimates\n- 50 MB/s into Kafka\n- ~18 GB Redis for dedupe keys\n\nAdded after hint\n- Circuit breaker per provider, secondary SMS vendor",
    },
    practiseNext: [
      { title: "Design a chat system", href: routes.hld("hld-chat-system"), reason: "Practise delivery guarantees and failure handling" },
      { title: "Lesson: Message queues and async processing", href: routes.lesson("lesson-message-queues"), reason: "Retries, dead-letter queues and back-pressure" },
    ],
  },
  {
    ...interviewHistory[2]!,
    summary:
      "Your conflict story had a strong data-driven resolution, but answers started vague and needed prompting for your specific actions and outcomes. Lead with the result and your role.",
    metrics: [
      {
        key: "problem_solving",
        score: 3.0,
        summary: "Resolved the disagreement with an experiment, but only described it after a follow-up.",
        evidence: [{ turnId: "iv-2027-t6", quote: "I wrote a one-page doc comparing failure modes and ran both versions on a week of production data." }],
        tips: ["Use STAR: put the Action and Result in your first answer, not after a follow-up."],
      },
      { key: "coding", score: null, summary: "Not assessed in behavioral rounds.", evidence: [], tips: [] },
      {
        key: "communication",
        score: 3.4,
        summary: "Clear once prompted; first answers were too general.",
        evidence: [{ turnId: "iv-2027-t4", quote: "We discussed it and eventually we went with the queue." }],
        tips: ["Say 'I' for your own actions and 'we' for the team's, so your contribution is unambiguous."],
      },
      {
        key: "technical_depth",
        score: 2.8,
        summary: "Outcomes were approximate (“about a third”) and lacked the technical detail that shows ownership.",
        evidence: [{ turnId: "iv-2027-t12", quote: "Support tickets about refund status dropped, I think by about a third." }],
        tips: ["Prepare exact numbers for each story in your story bank.", "Add one sentence of technical detail that only the owner would know."],
      },
    ],
    stageTimings: [
      { stage: "intro", actualMin: 1.1 },
      { stage: "problem", actualMin: 0.6 },
      { stage: "clarifying", actualMin: 3.4 },
      { stage: "approach", actualMin: 14.2 },
      { stage: "code", actualMin: 0 },
      { stage: "complexity", actualMin: 0 },
      { stage: "follow_ups", actualMin: 8.4 },
      { stage: "wrap_up", actualMin: 2.3 },
    ],
    transcript: iv2027Transcript,
    practiseNext: [
      { title: "Lesson: The STAR method", href: routes.lesson("lesson-star-method"), reason: "Structure stories so actions and results come first" },
      { title: "Behavioral Interviews elective", href: routes.module("behavioral-interviews"), reason: "Finish your story bank assignment" },
    ],
  },
  {
    ...interviewHistory[3]!,
    summary: "Correct approach quickly, but a bug in the merge step went unnoticed until the interviewer pointed it out.",
    metrics: [
      {
        key: "problem_solving",
        score: 3.4,
        summary: "Found the sort-and-scan approach right away.",
        evidence: [{ turnId: "iv-2019-t5", quote: "Sort by start, then walk through and extend the last merged interval while the next one starts before it ends." }],
        tips: ["Name the invariant your loop maintains before coding it."],
      },
      {
        key: "coding",
        score: 2.8,
        summary: "Missed the nested-interval case.",
        evidence: [{ turnId: "iv-2019-t7", quote: "I'm setting the end to the new interval's end instead of the max of both." }],
        tips: ["Test nested and touching intervals before submitting."],
      },
      {
        key: "communication",
        score: 3.2,
        summary: "Concise answers; little narration while coding in text mode.",
        evidence: [{ turnId: "iv-2019-t3", quote: "Are the intervals sorted? And do [1,2] and [2,3] count as overlapping?" }],
        tips: ["In text interviews, post short progress notes while you code."],
      },
      {
        key: "technical_depth",
        score: 3.0,
        summary: "Correct but brief complexity answer.",
        evidence: [{ turnId: "iv-2019-t9", quote: "O(n log n) for the sort and O(n) for the scan." }],
        tips: ["Mention space complexity and whether sorting in place is allowed."],
      },
    ],
    stageTimings: [
      { stage: "intro", actualMin: 0.9 },
      { stage: "problem", actualMin: 1.5 },
      { stage: "clarifying", actualMin: 2.2 },
      { stage: "approach", actualMin: 4.5 },
      { stage: "code", actualMin: 21.8 },
      { stage: "complexity", actualMin: 3.2 },
      { stage: "follow_ups", actualMin: 7.5 },
      { stage: "wrap_up", actualMin: 3.4 },
    ],
    transcript: iv2019Transcript,
    finalArtifact: {
      kind: "code",
      language: "python",
      content: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = [intervals[0]]
        for start, end in intervals[1:]:
            if start <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], end)
            else:
                merged.append([start, end])
        return merged
`,
    },
    practiseNext: [{ title: "Meeting rooms II", href: routes.problem("meeting-rooms-ii"), reason: "Next step up on interval problems" }],
  },
  {
    ...interviewHistory[4]!,
    summary: "Reasonable class breakdown, but extensibility questions exposed if-else pricing logic. Lean on patterns when requirements change.",
    metrics: [
      {
        key: "problem_solving",
        score: 3.0,
        summary: "Good clarifying questions on vehicle types and payments.",
        evidence: [{ turnId: "iv-2012-t2", quote: "How many levels, and which vehicle types? Do we need payments?" }],
        tips: ["Write down the requirements as a checklist and design against it."],
      },
      {
        key: "coding",
        score: 2.8,
        summary: "Classes compiled, but fee logic mixed concerns.",
        evidence: [{ turnId: "iv-2012-t6", quote: "I'd add an if-else on the day in the fee calculation." }],
        tips: ["Keep each class focused on one reason to change (single responsibility)."],
      },
      {
        key: "communication",
        score: 3.0,
        summary: "Clear naming; explained the class list well.",
        evidence: [{ turnId: "iv-2012-t4", quote: "Classes: ParkingLot, Level, ParkingSpot, Vehicle, Ticket." }],
        tips: ["Sketch the class relationships before writing code."],
      },
      {
        key: "technical_depth",
        score: 2.6,
        summary: "Reached the strategy pattern only after a hint.",
        evidence: [{ turnId: "iv-2012-t8", quote: "A strategy interface for pricing, with weekday and weekend implementations." }],
        tips: ["Revise Strategy, Factory and Observer with one example each."],
      },
    ],
    stageTimings: [
      { stage: "intro", actualMin: 1.2 },
      { stage: "problem", actualMin: 0.8 },
      { stage: "clarifying", actualMin: 4.5 },
      { stage: "approach", actualMin: 7.5 },
      { stage: "code", actualMin: 28 },
      { stage: "complexity", actualMin: 0 },
      { stage: "follow_ups", actualMin: 13 },
      { stage: "wrap_up", actualMin: 5 },
    ],
    transcript: iv2012Transcript,
    finalArtifact: {
      kind: "code",
      language: "java",
      content: `public interface PricingStrategy {
    long feeFor(Ticket ticket, Instant exitTime);
}

public class WeekdayPricing implements PricingStrategy {
    public long feeFor(Ticket ticket, Instant exitTime) {
        long hours = Duration.between(ticket.entryTime(), exitTime).toHours() + 1;
        return hours * ticket.vehicle().hourlyRate();
    }
}
`,
    },
    practiseNext: [{ title: "Design a rate limiter (LLD)", href: routes.lld("lld-rate-limiter"), reason: "Practise strategy-based extensibility" }],
  },
];

// ---------------------------------------------------------------------------
// Live sessions (scripted)
// ---------------------------------------------------------------------------

const meetingRoomsProblem: LiveSession["problem"] = {
  title: "Meeting rooms II",
  statement: [
    "You are given an array of meeting time intervals where `intervals[i] = [start, end]`.",
    "Return the minimum number of conference rooms required so that no two overlapping meetings share a room. A meeting ending at time `t` frees its room for a meeting starting at `t`.",
  ],
  examples: [
    { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2", explanation: "[0,30] overlaps both others, which do not overlap each other." },
    { input: "intervals = [[7,10],[2,4]]", output: "1" },
  ],
  constraints: ["1 ≤ intervals.length ≤ 10⁴", "0 ≤ start < end ≤ 10⁶"],
};

const meetingRoomsStarter: LiveSession["starterCode"] = {
  python: "class Solution:\n    def minMeetingRooms(self, intervals: list[list[int]]) -> int:\n        # Talk through your approach as you write\n        pass\n",
  java: "class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        return 0;\n    }\n}\n",
  cpp: "class Solution {\npublic:\n    int minMeetingRooms(vector<vector<int>>& intervals) {\n        return 0;\n    }\n};\n",
  javascript: "/**\n * @param {number[][]} intervals\n * @return {number}\n */\nfunction minMeetingRooms(intervals) {\n}\n",
  go: "func minMeetingRooms(intervals [][]int) int {\n\treturn 0\n}\n",
};

const voiceScript: ScriptedTurn[] = [
  { speaker: "interviewer", stage: "intro", latencyMs: 900, text: "Hi Aarav, I'm your interviewer today. This is a 45-minute coding round. Could you start with a quick introduction?" },
  { speaker: "candidate", stage: "intro", text: "Sure. I'm a backend engineer at a fintech startup in Bengaluru, about two years in, mostly Java and Go." },
  { speaker: "interviewer", stage: "problem", latencyMs: 1200, text: "Thanks. Here's the problem: given meeting intervals, find the minimum number of rooms so no two overlapping meetings share one. It's in your editor now." },
  { speaker: "candidate", stage: "clarifying", text: "Are the intervals sorted? And if one meeting ends at 10 and another starts at 10, do they conflict?" },
  { speaker: "interviewer", stage: "clarifying", latencyMs: 1100, text: "Good questions. They're unsorted, and a meeting ending at 10 frees the room for one starting at 10." },
  { speaker: "candidate", stage: "approach", text: "Then I'd sort by start time and keep a min-heap of end times. If the earliest end is at or before the next start, I reuse that room; otherwise I add one." },
  { speaker: "interviewer", stage: "approach", latencyMs: 1400, text: "That works. Is there a way to do it without a heap?" },
  { speaker: "candidate", stage: "approach", text: "Yes, I could sort starts and ends separately and sweep with two pointers, counting meetings in progress." },
  { speaker: "interviewer", stage: "code", latencyMs: 1000, text: "Pick whichever you prefer and talk me through it as you write." },
  { speaker: "candidate", stage: "code", text: "I'll do the heap version. Sorting first, then pushing end times as I go." },
  { speaker: "interviewer", stage: "complexity", latencyMs: 1300, text: "What's the time and space complexity?" },
  { speaker: "candidate", stage: "complexity", text: "O(n log n) for the sort plus log n per heap operation, so O(n log n) total, and O(n) space for the heap." },
  { speaker: "interviewer", stage: "follow_ups", latencyMs: 1700, text: "Suppose meetings arrive one at a time and you must report the room count live. What changes?" },
  { speaker: "candidate", stage: "follow_ups", text: "I'd keep the heap across calls and only push the new meeting, popping rooms that have ended by its start time." },
  { speaker: "interviewer", stage: "wrap_up", latencyMs: 1100, text: "Nice. That's all from me. Do you have any questions for me?" },
  { speaker: "candidate", stage: "wrap_up", text: "How does your team run interviews like this one in practice?" },
  { speaker: "interviewer", stage: "wrap_up", latencyMs: 1000, text: "Very similar to today. Thanks Aarav. You can end the interview to see your scorecard." },
];

// Text sessions: interviewer turns drive the chat; candidate turns (tagged with the stage
// they answer) are offered as sample replies so the demo can be clicked through.
const textScript: ScriptedTurn[] = [
  { speaker: "interviewer", stage: "intro", text: "Hi Aarav! This is a 45-minute coding round over chat. To start, tell me briefly what you work on." },
  { speaker: "candidate", stage: "intro", text: "I'm a backend engineer at a fintech startup in Bengaluru, mostly building payment reconciliation services in Java and Go." },
  { speaker: "interviewer", stage: "problem", text: "Thanks. Here's the problem (also pinned on the left): given meeting intervals, return the minimum number of rooms needed. Any questions before you start?" },
  { speaker: "candidate", stage: "problem", text: "Are the intervals sorted? And if one meeting ends at 10 and another starts at 10, do they need separate rooms?" },
  { speaker: "interviewer", stage: "clarifying", text: "Good question. Intervals are unsorted, and a meeting ending at t frees the room for one starting at t. Anything else to clarify?" },
  { speaker: "candidate", stage: "clarifying", text: "No, that's clear. Can I assume at least one interval?" },
  { speaker: "interviewer", stage: "approach", text: "Yes, at least one. Walk me through your approach before writing code. What data structure would you use?" },
  { speaker: "candidate", stage: "approach", text: "Sort by start time and keep a min-heap of end times. If the earliest end is ≤ the next start, pop it and reuse the room; push the new end either way. The heap size at the end is the answer." },
  { speaker: "interviewer", stage: "code", text: "Sounds reasonable. Go ahead and write it in the editor. I can see your code as you type." },
  { speaker: "candidate", stage: "code", text: "Done. I sort the intervals, then use heapq: pop when heap[0] <= start, then push end." },
  { speaker: "interviewer", stage: "complexity", text: "Looks good. What's the time and space complexity of your solution?" },
  { speaker: "candidate", stage: "complexity", text: "O(n log n) time for sorting and heap operations, O(n) space for the heap." },
  { speaker: "interviewer", stage: "follow_ups", text: "Follow-up: meetings now arrive one at a time and you must report the room count after each one. What would you change?" },
  { speaker: "candidate", stage: "follow_ups", text: "Keep the heap between calls. For each new meeting, pop ended meetings and push the new end; the max heap size seen so far is the answer." },
  { speaker: "interviewer", stage: "wrap_up", text: "Nice. That's all from me. Any questions for me? When you're done, end the interview to get your scorecard." },
  { speaker: "candidate", stage: "wrap_up", text: "No questions. Thanks for your time!" },
];

export const liveSessions: LiveSession[] = [
  {
    id: "iv-live-voice",
    type: "dsa",
    mode: "voice",
    title: "DSA coding round",
    company: "Google",
    durationMin: 45,
    problem: meetingRoomsProblem,
    starterCode: meetingRoomsStarter,
    script: voiceScript,
  },
  {
    id: "iv-live-text",
    type: "dsa",
    mode: "text",
    title: "DSA coding round",
    company: "Atlassian",
    durationMin: 45,
    problem: meetingRoomsProblem,
    starterCode: meetingRoomsStarter,
    script: textScript,
  },
  {
    id: "iv-live-avatar",
    type: "dsa",
    mode: "avatar",
    title: "DSA coding round",
    company: "Uber",
    durationMin: 45,
    problem: meetingRoomsProblem,
    starterCode: meetingRoomsStarter,
    script: voiceScript,
  },
];

export const interviewQuotaMeta = {
  minutesUsed: 46,
  resetsAt: "2026-11-20T00:00:00+05:30",
  planCaps: [
    { plan: "free" as const, minutes: 15, period: "one-time trial" },
    { plan: "pro" as const, minutes: 120, period: "per month" },
    { plan: "pro_plus" as const, minutes: 400, period: "per month" },
  ],
};
