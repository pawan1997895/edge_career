import { routes } from "@/lib/routes";
import type { CompanyReadiness, InterviewOutcome, SalaryReadiness, SkillMastery } from "@/types/insights";

/** Start date of each of the last 12 weeks, oldest first (matches SkillMastery.weekly). */
export const masteryWeeks = [
  "2026-08-10",
  "2026-08-17",
  "2026-08-24",
  "2026-08-31",
  "2026-09-07",
  "2026-09-14",
  "2026-09-21",
  "2026-09-28",
  "2026-10-05",
  "2026-10-12",
  "2026-10-19",
  "2026-10-26",
];

const n = null;

export const skillMastery: SkillMastery[] = [
  // Foundations (tested out via the placement test)
  { skill: "Complexity analysis", category: "Foundations", mastery: 89, delta: 2, lastPracticed: "2026-10-24T20:00:00+05:30", weekly: [84, 85, 85, 86, 86, 87, 87, 87, 88, 88, 89, 89], practice: { label: "Count primes", href: routes.problem("count-primes") } },
  { skill: "Recursion", category: "Foundations", mastery: 86, delta: -1, lastPracticed: "2026-10-02T21:00:00+05:30", weekly: [83, 84, 86, 87, 87, 88, 88, 87, 87, 86, 86, 86], practice: { label: "Thinking recursively", href: routes.lesson("lesson-recursion") } },

  // DSA
  { skill: "Arrays & hashing", category: "DSA", mastery: 92, delta: 1, lastPracticed: "2026-10-21T19:30:00+05:30", weekly: [86, 88, 89, 90, 90, 91, 91, 91, 91, 92, 92, 92], practice: { label: "Top K frequent elements", href: routes.problem("top-k-frequent-elements") } },
  { skill: "Two pointers", category: "DSA", mastery: 88, delta: 0, lastPracticed: "2026-10-12T22:10:00+05:30", weekly: [74, 79, 83, 85, 87, 88, 88, 88, 88, 88, 88, 88], practice: { label: "Trapping rain water", href: routes.problem("trapping-rain-water") } },
  { skill: "Sliding window", category: "DSA", mastery: 74, delta: -6, lastPracticed: "2026-10-26T22:40:00+05:30", weekly: [62, 70, 76, 79, 80, 80, 80, 80, 80, 79, 77, 74], practice: { label: "Sliding window maximum", href: routes.problem("sliding-window-maximum") } },
  { skill: "Monotonic stack", category: "DSA", mastery: 69, delta: -3, lastPracticed: "2026-10-08T21:15:00+05:30", weekly: [n, 55, 63, 68, 71, 72, 72, 72, 72, 71, 70, 69], practice: { label: "Trapping rain water", href: routes.problem("trapping-rain-water") } },
  { skill: "Trees", category: "DSA", mastery: 85, delta: 1, lastPracticed: "2026-10-18T20:00:00+05:30", weekly: [n, n, 70, 78, 82, 84, 84, 84, 84, 85, 85, 85], practice: { label: "Level order traversal", href: routes.problem("binary-tree-level-order") } },
  { skill: "Graphs", category: "DSA", mastery: 81, delta: 4, lastPracticed: "2026-10-25T21:50:00+05:30", weekly: [n, n, n, 64, 72, 76, 77, 77, 77, 78, 80, 81], practice: { label: "Alien dictionary", href: routes.problem("alien-dictionary") } },
  { skill: "Dynamic programming", category: "DSA", mastery: 66, delta: 3, lastPracticed: "2026-10-23T22:30:00+05:30", weekly: [n, n, n, n, 48, 56, 60, 61, 62, 63, 65, 66], practice: { label: "Coin change", href: routes.problem("coin-change") } },
  { skill: "Heaps", category: "DSA", mastery: 83, delta: 2, lastPracticed: "2026-10-20T19:00:00+05:30", weekly: [n, n, n, n, n, 70, 78, 80, 81, 81, 82, 83], practice: { label: "Meeting rooms II", href: routes.problem("meeting-rooms-ii") } },
  { skill: "Binary search", category: "DSA", mastery: 58, delta: 5, lastPracticed: "2026-10-26T20:15:00+05:30", weekly: [n, n, n, n, n, 41, 46, 50, 51, 53, 55, 58], practice: { label: "Median of two sorted arrays", href: routes.problem("median-of-two-sorted-arrays") } },

  // Databases
  { skill: "SQL joins & aggregation", category: "Databases", mastery: 90, delta: 1, lastPracticed: "2026-10-14T21:00:00+05:30", weekly: [n, n, n, n, n, n, 78, 86, 88, 89, 89, 90], practice: { label: "Monthly active users", href: routes.problem("monthly-active-users") } },
  { skill: "Window functions", category: "Databases", mastery: 77, delta: 4, lastPracticed: "2026-10-22T22:00:00+05:30", weekly: [n, n, n, n, n, n, n, 60, 68, 72, 75, 77], practice: { label: "Consecutive login streaks", href: routes.problem("consecutive-login-streaks") } },
  { skill: "Indexing & transactions", category: "Databases", mastery: 71, delta: 0, lastPracticed: "2026-10-06T20:30:00+05:30", weekly: [n, n, n, n, n, n, n, n, 69, 71, 71, 71], practice: { label: "B-tree indexes and isolation", href: routes.lesson("lesson-indexes") } },

  // System design
  { skill: "SOLID & OOP", category: "System design", mastery: 84, delta: 9, lastPracticed: "2026-10-16T21:30:00+05:30", weekly: [n, n, n, n, n, n, n, n, 70, 75, 82, 84], practice: { label: "Design an elevator system", href: routes.lld("lld-elevator") } },
  { skill: "Design patterns", category: "System design", mastery: 79, delta: 11, lastPracticed: "2026-10-19T22:00:00+05:30", weekly: [n, n, n, n, n, n, n, n, n, 68, 75, 79], practice: { label: "Design a rate limiter", href: routes.lld("lld-rate-limiter") } },
  { skill: "API design", category: "System design", mastery: 73, delta: 8, lastPracticed: "2026-10-24T20:45:00+05:30", weekly: [n, n, n, n, n, n, n, n, n, 62, 68, 73], practice: { label: "Design a URL shortener", href: routes.hld("hld-url-shortener") } },
  { skill: "Caching", category: "System design", mastery: 76, delta: 10, lastPracticed: "2026-10-25T21:10:00+05:30", weekly: [n, n, n, n, n, n, n, n, n, 60, 70, 76], practice: { label: "Design a news feed", href: routes.hld("hld-news-feed") } },
  { skill: "Sharding & consistent hashing", category: "System design", mastery: 52, delta: 12, lastPracticed: "2026-10-27T17:40:00+05:30", weekly: [n, n, n, n, n, n, n, n, n, n, 40, 52], practice: { label: "Consistent hashing lesson", href: routes.lesson("lesson-consistent-hashing") } },
  { skill: "Message queues", category: "System design", mastery: 41, delta: 0, lastPracticed: "2026-10-19T20:00:00+05:30", weekly: [n, n, n, n, n, n, n, n, n, n, 41, 41], practice: { label: "Message queues lesson", href: routes.lesson("lesson-message-queues") } },

  // Behavioral
  { skill: "STAR stories", category: "Behavioral", mastery: 48, delta: 6, lastPracticed: "2026-10-20T08:30:00+05:30", weekly: [n, n, n, n, n, n, n, n, n, 38, 42, 48], practice: { label: "Mock behavioral interview", href: routes.interviewSetup("behavioral") } },
];

export const companyReadiness: CompanyReadiness[] = [
  {
    company: "Atlassian",
    level: "SDE 2 (P40)",
    score: 72,
    target: 80,
    isTarget: true,
    focus: "Strong coding plus a values-based behavioral round and system design",
    gaps: [
      { skill: "STAR stories", current: 48, needed: 70, href: routes.interviewSetup("behavioral") },
      { skill: "Sharding & consistent hashing", current: 52, needed: 70, href: routes.lesson("lesson-consistent-hashing") },
      { skill: "Dynamic programming", current: 66, needed: 75, href: routes.problem("coin-change") },
    ],
  },
  {
    company: "Google",
    level: "L4",
    score: 64,
    target: 85,
    isTarget: true,
    focus: "Hard algorithm rounds with deep complexity discussion",
    gaps: [
      { skill: "Binary search", current: 58, needed: 80, href: routes.problem("median-of-two-sorted-arrays") },
      { skill: "Dynamic programming", current: 66, needed: 82, href: routes.problem("coin-change") },
      { skill: "Graphs", current: 81, needed: 85, href: routes.problem("alien-dictionary") },
    ],
  },
  {
    company: "Uber",
    level: "SDE 2",
    score: 70,
    target: 82,
    isTarget: true,
    focus: "Practical coding, real-time systems and scale",
    gaps: [
      { skill: "Message queues", current: 41, needed: 70, href: routes.lesson("lesson-message-queues") },
      { skill: "Sliding window", current: 74, needed: 82, href: routes.problem("sliding-window-maximum") },
      { skill: "Sharding & consistent hashing", current: 52, needed: 72, href: routes.lesson("lesson-consistent-hashing") },
    ],
  },
  {
    company: "Microsoft",
    level: "SDE 2 (L62)",
    score: 74,
    target: 80,
    isTarget: false,
    focus: "Coding fundamentals, OOP design and collaboration",
    gaps: [
      { skill: "Monotonic stack", current: 69, needed: 75, href: routes.problem("trapping-rain-water") },
      { skill: "STAR stories", current: 48, needed: 65, href: routes.interviewSetup("behavioral") },
    ],
  },
  {
    company: "Flipkart",
    level: "SDE 2",
    score: 79,
    target: 78,
    isTarget: false,
    focus: "Machine coding round, DSA and LLD",
    gaps: [{ skill: "Design patterns", current: 79, needed: 80, href: routes.lld("lld-rate-limiter") }],
  },
  {
    company: "Razorpay",
    level: "SDE 2",
    score: 81,
    target: 76,
    isTarget: false,
    focus: "Payments-grade correctness, SQL and API design",
    gaps: [],
  },
];

export const salaryReadiness: SalaryReadiness[] = [
  { band: "10-20", score: 94, target: 60, isTarget: false },
  { band: "20-35", score: 82, target: 72, isTarget: false },
  { band: "35-50", score: 71, target: 82, isTarget: true },
  { band: "50+", score: 58, target: 88, isTarget: false },
];

/** Outcomes the learner has reported. Empty to start; the readiness page adds to it locally. */
export const reportedOutcomes: InterviewOutcome[] = [];
