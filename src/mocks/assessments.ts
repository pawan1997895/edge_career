import { routes } from "@/lib/routes";
import type { ExamAttempt, ExamQuestion, ExamSection, PlacementSummary, ReviewCase } from "@/types/assessments";

export const PASS_SCORE = 85;
export const REVIEW_BAND = { min: 80, max: 88 };
export const RETAKE_COOLDOWN_HOURS = 24;
export const PLACEMENT_EXAM_ID = "exam-placement";

/** Exam layout per module. Modules not listed use DEFAULT_LAYOUT. */
export const examLayouts: Record<string, { durationMin: number; poolSize: number; sections: ExamSection[] }> = {
  "programming-foundations": {
    durationMin: 60,
    poolSize: 90,
    sections: [
      { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 10, weight: 40 },
      { id: "coding", title: "Coding", kind: "code", questionCount: 2, weight: 60 },
    ],
  },
  "data-structures-algorithms": {
    durationMin: 120,
    poolSize: 240,
    sections: [
      { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 8, weight: 25 },
      { id: "coding", title: "Coding", kind: "code", questionCount: 3, weight: 75 },
    ],
  },
  "databases-sql": {
    durationMin: 75,
    poolSize: 110,
    sections: [
      { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 8, weight: 30 },
      { id: "queries", title: "SQL queries", kind: "code", questionCount: 3, weight: 70 },
    ],
  },
  "system-design": {
    durationMin: 90,
    poolSize: 120,
    sections: [
      { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 6, weight: 30 },
      { id: "lld", title: "LLD coding", kind: "code", questionCount: 1, weight: 35 },
      { id: "hld", title: "HLD short answer", kind: "design", questionCount: 1, weight: 35 },
    ],
  },
  "production-engineering": {
    durationMin: 60,
    poolSize: 80,
    sections: [
      { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 8, weight: 40 },
      { id: "scenario", title: "Incident scenario", kind: "design", questionCount: 1, weight: 60 },
    ],
  },
  "ai-ml-engineering": {
    durationMin: 90,
    poolSize: 90,
    sections: [
      { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 8, weight: 40 },
      { id: "notebook", title: "Notebook task", kind: "code", questionCount: 1, weight: 60 },
    ],
  },
};

export const DEFAULT_LAYOUT = {
  durationMin: 60,
  poolSize: 60,
  sections: [
    { id: "concepts", title: "Concepts", kind: "mixed", questionCount: 8, weight: 50 },
    { id: "applied", title: "Applied problem", kind: "code", questionCount: 1, weight: 50 },
  ] satisfies ExamSection[],
};

export const placementLayout = {
  durationMin: 120,
  poolSize: 300,
  sections: [
    { id: "pf", title: "Programming foundations", kind: "mixed", questionCount: 12, weight: 25, durationMin: 20 },
    { id: "dsa", title: "Data structures & algorithms", kind: "mixed", questionCount: 13, weight: 25, durationMin: 45 },
    { id: "sql", title: "Databases & SQL", kind: "mixed", questionCount: 8, weight: 25, durationMin: 25 },
    { id: "sd", title: "System design", kind: "mixed", questionCount: 6, weight: 25, durationMin: 30 },
  ] satisfies ExamSection[],
};

export const examAttempts: ExamAttempt[] = [
  {
    id: "att-m4-1",
    examId: "exam-system-design",
    examTitle: "Module 4 checkpoint · System Design",
    attemptNumber: 1,
    takenAt: "2026-10-21T19:10:00+05:30",
    score: 78,
    outcome: "not_passed",
    humanReviewed: false,
    reviewNote: "Below the review band. HLD answer missed replication and capacity estimates.",
    durationMin: 86,
    integrityEvents: 0,
  },
  {
    id: "att-m3-1",
    examId: "exam-databases-sql",
    examTitle: "Module 3 checkpoint · Databases & SQL",
    attemptNumber: 1,
    takenAt: "2026-09-19T18:00:00+05:30",
    score: 86,
    outcome: "passed",
    humanReviewed: true,
    reviewNote: "Near the pass line, so a reviewer checked it and confirmed the pass.",
    durationMin: 71,
    integrityEvents: 1,
  },
  {
    id: "att-m2-2",
    examId: "exam-data-structures-algorithms",
    examTitle: "Module 2 checkpoint · Data Structures & Algorithms",
    attemptNumber: 2,
    takenAt: "2026-08-12T20:30:00+05:30",
    score: 89,
    outcome: "passed",
    humanReviewed: false,
    durationMin: 112,
    integrityEvents: 0,
  },
  {
    id: "att-m2-1",
    examId: "exam-data-structures-algorithms",
    examTitle: "Module 2 checkpoint · Data Structures & Algorithms",
    attemptNumber: 1,
    takenAt: "2026-08-04T19:45:00+05:30",
    score: 81,
    outcome: "not_passed",
    humanReviewed: true,
    reviewNote: "Reviewer confirmed not passed: the graph question missed disconnected components.",
    durationMin: 118,
    integrityEvents: 2,
  },
  {
    id: "att-placement-1",
    examId: PLACEMENT_EXAM_ID,
    examTitle: "Placement test",
    attemptNumber: 1,
    takenAt: "2026-06-02T11:30:00+05:30",
    score: 91,
    outcome: "passed",
    humanReviewed: false,
    reviewNote: "Tested out of Module 1. Other sections were below 85%.",
    durationMin: 104,
    integrityEvents: 0,
  },
];

export const placementSummary: PlacementSummary = {
  takenAt: "2026-06-02T11:30:00+05:30",
  durationMin: 104,
  nextAvailableAt: "2026-07-02T11:30:00+05:30",
  sections: [
    { moduleId: "programming-foundations", moduleTitle: "Programming Foundations", score: 91, testedOut: true },
    { moduleId: "data-structures-algorithms", moduleTitle: "Data Structures & Algorithms", score: 72, testedOut: false },
    { moduleId: "databases-sql", moduleTitle: "Databases & SQL", score: 61, testedOut: false },
    { moduleId: "system-design", moduleTitle: "System Design (LLD + HLD)", score: 48, testedOut: false },
  ],
};

export const reviewCases: ReviewCase[] = [
  {
    id: "rc-news-feed",
    title: "Design a news feed",
    kind: "design",
    origin: "low_confidence",
    openedAt: "2026-10-27T16:05:00+05:30",
    status: "queued",
    aiScore: 83,
    href: routes.hld("hld-news-feed"),
  },
  {
    id: "rc-trapping",
    title: "Trapping rain water · readability score",
    kind: "submission",
    origin: "appeal",
    openedAt: "2026-10-25T21:12:00+05:30",
    status: "in_review",
    aiScore: 84,
    href: routes.submissions,
  },
  {
    id: "rc-m3",
    title: "Module 3 checkpoint · attempt 1",
    kind: "exam",
    origin: "near_threshold",
    openedAt: "2026-09-19T19:15:00+05:30",
    status: "resolved",
    aiScore: 86,
    finalScore: 87,
    resolution: "Pass confirmed. Reviewer added one point for a correct alternative to the window-function query.",
    href: routes.examResult("exam-databases-sql"),
  },
  {
    id: "rc-m2",
    title: "Module 2 checkpoint · attempt 1",
    kind: "exam",
    origin: "near_threshold",
    openedAt: "2026-08-04T21:50:00+05:30",
    status: "resolved",
    aiScore: 81,
    finalScore: 80,
    resolution: "Not passed. The graph solution failed on disconnected components; a fresh question set was used for the retake.",
    href: routes.examResult("exam-data-structures-algorithms"),
  },
];

// Demo question sets. A real exam draws a fresh randomized set from the module's pool.

export const systemDesignQuestions: ExamQuestion[] = [
  {
    id: "q1",
    sectionTitle: "Concepts",
    kind: "single",
    points: 5,
    prompt: "In consistent hashing, why are virtual nodes added for each physical server?",
    options: [
      { id: "a", label: "To make hash lookups O(1) instead of O(log n)" },
      { id: "b", label: "To spread each server's load across the ring so keys are balanced" },
      { id: "c", label: "To replicate every key to all servers" },
      { id: "d", label: "To avoid hashing keys at all" },
    ],
  },
  {
    id: "q2",
    sectionTitle: "Concepts",
    kind: "single",
    points: 5,
    prompt: "A product page is read 200× more often than it is updated, and a stale price for a few seconds is acceptable. Which caching strategy fits best?",
    options: [
      { id: "a", label: "Write-through cache with no expiry" },
      { id: "b", label: "Cache-aside with a short TTL and invalidation on update" },
      { id: "c", label: "No cache; add read replicas only" },
      { id: "d", label: "Write-back cache that flushes once a day" },
    ],
  },
  {
    id: "q3",
    sectionTitle: "Concepts",
    kind: "multi",
    points: 5,
    prompt: "Which of these remove a single point of failure? Select all that apply.",
    options: [
      { id: "a", label: "Adding a read replica with automatic failover for the primary database" },
      { id: "b", label: "Running two load balancers in active–passive mode" },
      { id: "c", label: "Increasing the instance size of the only API server" },
      { id: "d", label: "Running the queue as a three-node cluster" },
    ],
  },
  {
    id: "q4",
    sectionTitle: "Concepts",
    kind: "single",
    points: 5,
    prompt: "`PaymentService` has a switch statement on payment type that grows every time a method is added. Which principle does this break most directly?",
    options: [
      { id: "a", label: "Single responsibility" },
      { id: "b", label: "Open/closed" },
      { id: "c", label: "Liskov substitution" },
      { id: "d", label: "Interface segregation" },
    ],
  },
  {
    id: "q5",
    sectionTitle: "Concepts",
    kind: "multi",
    points: 5,
    prompt: "Which rate-limiting algorithms allow short bursts above the average rate? Select all that apply.",
    options: [
      { id: "a", label: "Token bucket" },
      { id: "b", label: "Leaky bucket (as a queue)" },
      { id: "c", label: "Fixed window counter" },
      { id: "d", label: "Sliding window log" },
    ],
  },
  {
    id: "q6",
    sectionTitle: "Concepts",
    kind: "single",
    points: 5,
    prompt: "A queue guarantees at-least-once delivery. What must the consumer do?",
    options: [
      { id: "a", label: "Nothing; each message arrives exactly once" },
      { id: "b", label: "Make processing idempotent, e.g. by de-duplicating on a message id" },
      { id: "c", label: "Acknowledge before processing" },
      { id: "d", label: "Use a single consumer only" },
    ],
  },
  {
    id: "q7",
    sectionTitle: "LLD coding",
    kind: "code",
    points: 35,
    prompt:
      "Implement a token-bucket rate limiter. `allow(userId, nowMs)` returns true if the request is allowed. Each user has a bucket of `capacity` tokens that refills at `refillPerSecond`. Keep the design open for other algorithms.",
    starterCode: {
      java: "interface RateLimiter {\n    boolean allow(String userId, long nowMs);\n}\n\nclass TokenBucketLimiter implements RateLimiter {\n    public TokenBucketLimiter(int capacity, double refillPerSecond) {\n        // TODO\n    }\n\n    @Override\n    public boolean allow(String userId, long nowMs) {\n        // TODO\n        return false;\n    }\n}\n",
      python: "class RateLimiter:\n    def allow(self, user_id: str, now_ms: int) -> bool:\n        raise NotImplementedError\n\n\nclass TokenBucketLimiter(RateLimiter):\n    def __init__(self, capacity: int, refill_per_second: float):\n        # TODO\n        pass\n\n    def allow(self, user_id: str, now_ms: int) -> bool:\n        # TODO\n        return False\n",
    },
    sampleTests: [
      { input: "capacity=2, refill=1/s; allow(u1,0), allow(u1,0), allow(u1,0)", expected: "true, true, false" },
      { input: "capacity=1, refill=1/s; allow(u1,0), allow(u1,1000)", expected: "true, true" },
      { input: "capacity=1; allow(u1,0), allow(u2,0)", expected: "true, true" },
    ],
  },
  {
    id: "q8",
    sectionTitle: "HLD short answer",
    kind: "design",
    points: 35,
    wordLimit: 250,
    prompt:
      "A URL shortener handles 10,000 new links per second and 200,000 redirects per second. Describe the storage layer: data model, how you generate short codes without collisions, how you scale reads, and what happens when a database node fails.",
  },
];

export const generalQuestions: ExamQuestion[] = [
  {
    id: "g1",
    sectionTitle: "Concepts",
    kind: "single",
    points: 5,
    prompt: "What is the time complexity of building a hash map from n keys, on average?",
    options: [
      { id: "a", label: "O(log n)" },
      { id: "b", label: "O(n)" },
      { id: "c", label: "O(n log n)" },
      { id: "d", label: "O(n²)" },
    ],
  },
  {
    id: "g2",
    sectionTitle: "Concepts",
    kind: "multi",
    points: 5,
    prompt: "Which problems are usually solved with a monotonic stack? Select all that apply.",
    options: [
      { id: "a", label: "Next greater element" },
      { id: "b", label: "Largest rectangle in a histogram" },
      { id: "c", label: "Shortest path in a weighted graph" },
      { id: "d", label: "Daily temperatures" },
    ],
  },
  {
    id: "g3",
    sectionTitle: "Concepts",
    kind: "single",
    points: 5,
    prompt: "BFS on an unweighted graph finds the shortest path because…",
    options: [
      { id: "a", label: "It explores nodes in order of their distance from the source" },
      { id: "b", label: "It always visits fewer nodes than DFS" },
      { id: "c", label: "It uses a priority queue" },
      { id: "d", label: "It never revisits a node" },
    ],
  },
  {
    id: "g4",
    sectionTitle: "Coding",
    kind: "code",
    points: 50,
    prompt: "Return the index of the first non-repeating character in a string `s`, or -1 if every character repeats.",
    starterCode: {
      python: "class Solution:\n    def firstUniqChar(self, s: str) -> int:\n        # Write your solution here\n        pass\n",
      java: "class Solution {\n    public int firstUniqChar(String s) {\n        // Write your solution here\n        return -1;\n    }\n}\n",
    },
    sampleTests: [
      { input: '"leetcode"', expected: "0" },
      { input: '"loveleetcode"', expected: "2" },
      { input: '"aabb"', expected: "-1" },
    ],
  },
  {
    id: "g5",
    sectionTitle: "Short answer",
    kind: "design",
    points: 35,
    wordLimit: 150,
    prompt: "Explain when you would choose DFS over BFS for exploring a large graph, and what risk DFS carries for very deep graphs.",
  },
];

export const placementQuestions: ExamQuestion[] = [
  {
    id: "p1",
    sectionTitle: "Programming foundations",
    kind: "single",
    points: 5,
    prompt: "What does this loop print? `for i in range(1, 10, 3): print(i)`",
    options: [
      { id: "a", label: "1 4 7" },
      { id: "b", label: "1 3 6 9" },
      { id: "c", label: "1 4 7 10" },
      { id: "d", label: "3 6 9" },
    ],
  },
  {
    id: "p2",
    sectionTitle: "Programming foundations",
    kind: "single",
    points: 5,
    prompt: "A function calls itself twice with n − 1 until n = 0. How many calls does it make for n = 10?",
    options: [
      { id: "a", label: "20" },
      { id: "b", label: "1,023" },
      { id: "c", label: "2,047" },
      { id: "d", label: "100" },
    ],
  },
  { ...generalQuestions[1]!, id: "p3", sectionTitle: "Data structures & algorithms" },
  { ...generalQuestions[3]!, id: "p4", sectionTitle: "Data structures & algorithms" },
  {
    id: "p5",
    sectionTitle: "Databases & SQL",
    kind: "single",
    points: 5,
    prompt: "Which query returns customers who have never placed an order?",
    options: [
      { id: "a", label: "SELECT c.* FROM customers c JOIN orders o ON o.customer_id = c.id" },
      { id: "b", label: "SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL" },
      { id: "c", label: "SELECT * FROM orders WHERE customer_id IS NULL" },
      { id: "d", label: "SELECT c.* FROM customers c WHERE c.id IN (SELECT customer_id FROM orders)" },
    ],
  },
  {
    id: "p6",
    sectionTitle: "Databases & SQL",
    kind: "multi",
    points: 5,
    prompt: "Which statements about a B-tree index on `orders(created_at)` are true? Select all that apply.",
    options: [
      { id: "a", label: "It speeds up range queries on created_at" },
      { id: "b", label: "It makes inserts slightly slower" },
      { id: "c", label: "It speeds up queries filtering only on customer_id" },
      { id: "d", label: "It can satisfy ORDER BY created_at without a sort" },
    ],
  },
  { ...systemDesignQuestions[1]!, id: "p7", sectionTitle: "System design" },
  {
    id: "p8",
    sectionTitle: "System design",
    kind: "design",
    points: 30,
    wordLimit: 150,
    prompt: "Sketch, in words, how you would serve a profile page that gets 50,000 reads per second from a single Postgres database.",
  },
];
