import type { ItemKind, ItemStatus, LearningItem, Module, Track } from "@/types/curriculum";

// Learner state in this mock: Module 1 tested out via the placement test,
// Modules 2–3 passed, Module 4 has every required item done and the checkpoint
// is ready for a retake, Modules 5–6 locked. Two electives are in progress.

function item(
  id: string,
  kind: ItemKind,
  title: string,
  status: ItemStatus,
  durationMin: number,
  refId: string,
  extra: Partial<LearningItem> = {},
): LearningItem {
  return { id, kind, title, status, durationMin, refId, required: true, ...extra };
}

export const tracks: Track[] = [
  {
    id: "core",
    title: "Core track",
    description: "Six modules taken in order, from programming foundations to ML engineering. 42 weeks at 8–10 hours a week.",
    moduleIds: [
      "programming-foundations",
      "data-structures-algorithms",
      "databases-sql",
      "system-design",
      "production-engineering",
      "ai-ml-engineering",
    ],
  },
  {
    id: "electives",
    title: "Electives",
    description: "Optional deep dives. Each unlocks after its prerequisite module.",
    moduleIds: [
      "behavioral-interviews",
      "concurrency",
      "distributed-systems",
      "frontend-system-design",
      "cloud-devops",
      "llm-applications",
    ],
  },
];

export const modules: Module[] = [
  {
    id: "programming-foundations",
    trackId: "core",
    number: 1,
    title: "Programming Foundations",
    summary: "Language essentials, complexity analysis and recursion: the base every later module builds on.",
    weeks: 4,
    status: "tested_out",
    progress: 100,
    prerequisiteIds: [],
    skills: ["Control flow", "Big-O analysis", "Recursion", "Debugging"],
    releasePhase: 1,
    checkpoint: { examId: "exam-programming-foundations", passScore: 85, bestScore: 91, attempts: 1, status: "passed" },
    topics: [
      {
        id: "pf-essentials",
        title: "Language essentials",
        items: [
          item("pf-1", "lesson", "Variables, control flow and functions", "passed", 18, "lesson-control-flow"),
          item("pf-2", "practice", "Running sum of an array", "passed", 15, "running-sum", { score: 100 }),
          item("pf-3", "practice", "Reverse words in a string", "passed", 20, "reverse-words", { score: 96 }),
        ],
      },
      {
        id: "pf-complexity",
        title: "Complexity analysis",
        items: [
          item("pf-4", "lesson", "Big-O, best case and worst case", "passed", 22, "lesson-big-o"),
          item("pf-5", "practice", "Count primes below n", "passed", 25, "count-primes", { score: 92 }),
        ],
      },
      {
        id: "pf-recursion",
        title: "Recursion",
        items: [
          item("pf-6", "lesson", "Thinking recursively", "passed", 20, "lesson-recursion"),
          item("pf-7", "assignment", "Recursion problem set", "passed", 60, "reverse-words", { score: 94 }),
        ],
      },
    ],
  },
  {
    id: "data-structures-algorithms",
    trackId: "core",
    number: 2,
    title: "Data Structures & Algorithms",
    summary: "Arrays to graphs and dynamic programming, with patterns interviewers actually ask.",
    weeks: 15,
    status: "passed",
    progress: 100,
    prerequisiteIds: ["programming-foundations"],
    skills: ["Arrays & hashing", "Two pointers", "Sliding window", "Stacks", "Trees", "Graphs", "Dynamic programming", "Heaps"],
    releasePhase: 1,
    checkpoint: { examId: "exam-data-structures-algorithms", passScore: 85, bestScore: 89, attempts: 2, status: "passed" },
    topics: [
      {
        id: "dsa-arrays",
        title: "Arrays and hashing",
        items: [
          item("dsa-1", "lesson", "Hash maps and frequency counting", "passed", 24, "lesson-hashing"),
          item("dsa-2", "practice", "Two sum", "passed", 15, "two-sum", { score: 100 }),
          item("dsa-3", "practice", "Top K frequent elements", "passed", 30, "top-k-frequent-elements", { score: 91 }),
        ],
      },
      {
        id: "dsa-window",
        title: "Two pointers and sliding window",
        items: [
          item("dsa-4", "lesson", "The sliding window pattern", "passed", 26, "lesson-sliding-window"),
          item("dsa-5", "practice", "Longest substring without repeating characters", "passed", 35, "longest-substring-without-repeating", { score: 88 }),
          item("dsa-6", "practice", "Trapping rain water", "passed", 45, "trapping-rain-water", { score: 84 }),
          item("dsa-7", "practice", "Sliding window maximum", "passed", 40, "sliding-window-maximum", { score: 90, required: false }),
        ],
      },
      {
        id: "dsa-stacks",
        title: "Stacks, queues and intervals",
        items: [
          item("dsa-8", "lesson", "Monotonic stacks", "passed", 21, "lesson-monotonic-stack"),
          item("dsa-9", "practice", "Valid parentheses", "passed", 15, "valid-parentheses", { score: 100 }),
          item("dsa-10", "practice", "Merge intervals", "passed", 30, "merge-intervals", { score: 93 }),
        ],
      },
      {
        id: "dsa-graphs",
        title: "Trees and graphs",
        items: [
          item("dsa-11", "lesson", "BFS, DFS and topological sort", "passed", 32, "lesson-graph-traversal"),
          item("dsa-12", "practice", "Binary tree level order traversal", "passed", 25, "binary-tree-level-order", { score: 95 }),
          item("dsa-13", "practice", "Number of islands", "passed", 30, "number-of-islands", { score: 97 }),
          item("dsa-14", "assignment", "Course schedule", "passed", 45, "course-schedule", { score: 87 }),
        ],
      },
      {
        id: "dsa-dp",
        title: "Dynamic programming",
        items: [
          item("dsa-15", "lesson", "From recursion to memoisation", "passed", 35, "lesson-dp-intro"),
          item("dsa-16", "practice", "Coin change", "passed", 35, "coin-change", { score: 86 }),
          item("dsa-17", "practice", "Word ladder", "passed", 50, "word-ladder", { score: 81, required: false }),
        ],
      },
      {
        id: "dsa-advanced",
        title: "Heaps and design-style problems",
        items: [
          item("dsa-18", "lesson", "Heaps and priority queues", "passed", 22, "lesson-heaps"),
          item("dsa-19", "practice", "Kth largest element", "passed", 20, "kth-largest-element", { score: 100 }),
          item("dsa-20", "assignment", "LRU cache", "passed", 45, "lru-cache", { score: 90 }),
          item("dsa-21", "practice", "Median of two sorted arrays", "passed", 60, "median-of-two-sorted-arrays", { score: 78, required: false }),
        ],
      },
    ],
  },
  {
    id: "databases-sql",
    trackId: "core",
    number: 3,
    title: "Databases & SQL",
    summary: "Relational modelling, joins, window functions, indexing and transactions, graded on a real Postgres.",
    weeks: 4,
    status: "passed",
    progress: 100,
    prerequisiteIds: ["data-structures-algorithms"],
    skills: ["SQL joins", "Aggregation", "Window functions", "Indexing", "Transactions"],
    releasePhase: 1,
    checkpoint: { examId: "exam-databases-sql", passScore: 85, bestScore: 86, attempts: 1, status: "passed" },
    topics: [
      {
        id: "sql-basics",
        title: "SQL fundamentals",
        items: [
          item("sql-1", "lesson", "Relational thinking and SELECT", "passed", 20, "lesson-sql-select"),
          item("sql-2", "practice", "Customers without orders", "passed", 15, "customers-without-orders", { score: 100 }),
        ],
      },
      {
        id: "sql-joins",
        title: "Joins and aggregation",
        items: [
          item("sql-3", "lesson", "Joins, GROUP BY and HAVING", "passed", 28, "lesson-sql-joins"),
          item("sql-4", "practice", "Second highest salary", "passed", 20, "second-highest-salary", { score: 94 }),
          item("sql-5", "practice", "Monthly active users", "passed", 25, "monthly-active-users", { score: 90 }),
        ],
      },
      {
        id: "sql-windows",
        title: "Window functions",
        items: [
          item("sql-6", "lesson", "Ranking and running totals", "passed", 30, "lesson-window-functions"),
          item("sql-7", "assignment", "Department top three salaries", "passed", 35, "department-top-three-salaries", { score: 88 }),
          item("sql-8", "practice", "Consecutive login streaks", "passed", 40, "consecutive-login-streaks", { score: 85, required: false }),
        ],
      },
      {
        id: "sql-internals",
        title: "Indexes and transactions",
        items: [item("sql-9", "lesson", "B-tree indexes and isolation levels", "passed", 34, "lesson-indexes")],
      },
    ],
  },
  {
    id: "system-design",
    trackId: "core",
    number: 4,
    title: "System Design (LLD + HLD)",
    summary: "Object-oriented design with SOLID and patterns, then large-scale architecture on the design canvas.",
    weeks: 8,
    status: "in_progress",
    progress: 89,
    prerequisiteIds: ["databases-sql"],
    skills: ["SOLID", "Design patterns", "Load balancing", "Caching", "Sharding", "Message queues", "API design"],
    releasePhase: 2,
    checkpoint: { examId: "exam-system-design", passScore: 85, bestScore: 78, attempts: 1, status: "available" },
    topics: [
      {
        id: "sd-lld",
        title: "LLD foundations",
        items: [
          item("sd-1", "lesson", "SOLID principles with examples", "passed", 28, "lesson-solid"),
          item("sd-2", "assignment", "Design a parking lot (LLD)", "passed", 60, "lld-parking-lot", { score: 90 }),
        ],
      },
      {
        id: "sd-patterns",
        title: "Design patterns",
        items: [
          item("sd-3", "lesson", "Strategy, Observer and Factory", "passed", 31, "lesson-design-patterns"),
          item("sd-4", "practice", "Design a rate limiter (LLD)", "passed", 50, "lld-rate-limiter", { score: 86 }),
          item("sd-5", "practice", "Design an elevator system (LLD)", "unlocked", 55, "lld-elevator", { required: false }),
        ],
      },
      {
        id: "sd-blocks",
        title: "HLD building blocks",
        items: [
          item("sd-6", "lesson", "Load balancing and horizontal scaling", "passed", 24, "lesson-load-balancing"),
          item("sd-7", "lesson", "Caching strategies", "passed", 27, "lesson-caching"),
          item("sd-8", "lesson", "Consistent hashing", "in_progress", 22, "lesson-consistent-hashing", { required: false }),
          item("sd-9", "lesson", "Message queues and async processing", "unlocked", 25, "lesson-message-queues", { required: false }),
        ],
      },
      {
        id: "sd-case-studies",
        title: "HLD case studies",
        items: [
          item("sd-10", "assignment", "Design a URL shortener", "passed", 75, "hld-url-shortener", { score: 88 }),
          item("sd-11", "practice", "Design a news feed", "submitted", 75, "hld-news-feed", { required: false }),
          item("sd-12", "practice", "Design a chat system", "unlocked", 75, "hld-chat-system", { required: false }),
        ],
      },
    ],
  },
  {
    id: "production-engineering",
    trackId: "core",
    number: 5,
    title: "Production Engineering",
    summary: "Ship real services: GitHub workflow, tested REST APIs, CI and deployments checked against a live URL.",
    weeks: 6,
    status: "locked",
    progress: 0,
    prerequisiteIds: ["system-design"],
    skills: ["Git workflow", "REST APIs", "Automated testing", "CI/CD", "Observability"],
    releasePhase: 3,
    checkpoint: { examId: "exam-production-engineering", passScore: 85, attempts: 0, status: "locked" },
    topics: [
      {
        id: "pe-git",
        title: "Git and code review",
        items: [
          item("pe-1", "lesson", "Branching, pull requests and reviews", "locked", 20, "lesson-git-workflow"),
          item("pe-2", "assignment", "Connect your GitHub account", "locked", 10, "project-github-setup"),
        ],
      },
      {
        id: "pe-api",
        title: "Building a REST service",
        items: [
          item("pe-3", "lesson", "Designing resource APIs", "locked", 26, "lesson-rest-apis"),
          item("pe-4", "assignment", "Project: URL shortener service", "locked", 240, "project-url-shortener"),
        ],
      },
      {
        id: "pe-deploy",
        title: "Testing, CI and deployment",
        items: [
          item("pe-5", "lesson", "Test pyramids and CI pipelines", "locked", 24, "lesson-ci"),
          item("pe-6", "assignment", "Project: deploy with health checks", "locked", 180, "project-deploy-health"),
        ],
      },
    ],
  },
  {
    id: "ai-ml-engineering",
    trackId: "core",
    number: 6,
    title: "AI & ML Engineering",
    summary: "Python for data, classical ML and neural networks in a sandboxed notebook, ending with LLM apps.",
    weeks: 5,
    status: "locked",
    progress: 0,
    prerequisiteIds: ["production-engineering"],
    skills: ["NumPy & pandas", "Model evaluation", "Neural networks", "Embeddings", "LLM apps"],
    releasePhase: 3,
    checkpoint: { examId: "exam-ai-ml-engineering", passScore: 85, attempts: 0, status: "locked" },
    topics: [
      {
        id: "ml-python",
        title: "Python for data",
        items: [
          item("ml-1", "lesson", "NumPy and pandas essentials", "locked", 30, "lesson-numpy-pandas"),
          item("ml-2", "practice", "Notebook: exploring a dataset", "locked", 60, "nb-eda-housing"),
        ],
      },
      {
        id: "ml-classical",
        title: "Classical machine learning",
        items: [
          item("ml-3", "lesson", "Regression, classification and evaluation", "locked", 35, "lesson-classical-ml"),
          item("ml-4", "assignment", "Notebook: churn prediction", "locked", 120, "nb-churn-model"),
        ],
      },
      {
        id: "ml-llm",
        title: "Building with LLMs",
        items: [
          item("ml-5", "lesson", "Embeddings and retrieval", "locked", 28, "lesson-embeddings"),
          item("ml-6", "assignment", "Notebook: semantic search", "locked", 120, "nb-semantic-search"),
        ],
      },
    ],
  },

  // Electives
  {
    id: "behavioral-interviews",
    trackId: "electives",
    title: "Behavioral Interviews",
    summary: "Structure stories with STAR, handle conflict and leadership questions, and practise with the AI interviewer.",
    weeks: 2,
    status: "in_progress",
    progress: 40,
    prerequisiteIds: ["programming-foundations"],
    skills: ["STAR stories", "Leadership signals", "Conflict resolution"],
    releasePhase: 2,
    checkpoint: { examId: "exam-behavioral-interviews", passScore: 85, attempts: 0, status: "locked" },
    topics: [
      {
        id: "bh-star",
        title: "Story structure",
        items: [
          item("bh-1", "lesson", "The STAR method", "passed", 15, "lesson-star-method"),
          item("bh-2", "assignment", "Write your story bank", "in_progress", 45, "lesson-star-method"),
          item("bh-3", "practice", "Mock behavioral interview", "unlocked", 30, "interview-behavioral"),
        ],
      },
    ],
  },
  {
    id: "concurrency",
    trackId: "electives",
    title: "Concurrency & Multithreading",
    summary: "Threads, locks, async I/O and classic concurrency problems in Java and Go.",
    weeks: 3,
    status: "in_progress",
    progress: 100,
    prerequisiteIds: ["data-structures-algorithms"],
    skills: ["Threads & locks", "Deadlocks", "Producer–consumer", "Async I/O"],
    releasePhase: 3,
    checkpoint: { examId: "exam-concurrency", passScore: 85, attempts: 0, status: "available" },
    topics: [
      {
        id: "cc-basics",
        title: "Threads and synchronisation",
        items: [
          item("cc-1", "lesson", "Threads, mutexes and condition variables", "passed", 30, "lesson-threads"),
          item("cc-2", "practice", "Bounded blocking queue", "passed", 40, "lru-cache", { score: 89 }),
        ],
      },
    ],
  },
  {
    id: "distributed-systems",
    trackId: "electives",
    title: "Distributed Systems Deep Dive",
    summary: "Replication, consensus, partitioning and the trade-offs behind real databases.",
    weeks: 4,
    status: "locked",
    progress: 0,
    prerequisiteIds: ["system-design"],
    skills: ["Replication", "Consensus", "Partitioning"],
    releasePhase: 3,
    checkpoint: { examId: "exam-distributed-systems", passScore: 85, attempts: 0, status: "locked" },
    topics: [],
  },
  {
    id: "frontend-system-design",
    trackId: "electives",
    title: "Frontend System Design",
    summary: "Rendering strategies, state management and performance budgets for large web apps.",
    weeks: 3,
    status: "locked",
    progress: 0,
    prerequisiteIds: ["system-design"],
    skills: ["Rendering strategies", "State management", "Web performance"],
    releasePhase: 3,
    checkpoint: { examId: "exam-frontend-system-design", passScore: 85, attempts: 0, status: "locked" },
    topics: [],
  },
  {
    id: "cloud-devops",
    trackId: "electives",
    title: "Cloud & DevOps",
    summary: "Containers, infrastructure as code and running services on AWS.",
    weeks: 3,
    status: "locked",
    progress: 0,
    prerequisiteIds: ["production-engineering"],
    skills: ["Docker", "Terraform", "AWS"],
    releasePhase: 3,
    checkpoint: { examId: "exam-cloud-devops", passScore: 85, attempts: 0, status: "locked" },
    topics: [],
  },
  {
    id: "llm-applications",
    trackId: "electives",
    title: "LLM Applications",
    summary: "Prompting, retrieval, tool use and evaluation for production AI features.",
    weeks: 3,
    status: "locked",
    progress: 0,
    prerequisiteIds: ["ai-ml-engineering"],
    skills: ["Prompt design", "RAG", "Evals"],
    releasePhase: 3,
    checkpoint: { examId: "exam-llm-applications", passScore: 85, attempts: 0, status: "locked" },
    topics: [],
  },
];
