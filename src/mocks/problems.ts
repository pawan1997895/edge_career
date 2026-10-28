import type { ProblemDetail, ProblemSummary } from "@/types/practice";
import type { ProblemHint, ProblemRecommendation, SqlJudgeData } from "@/types/submissions";

export const problemSummaries: ProblemSummary[] = [
  // Module 1 — Programming foundations
  { id: "running-sum", title: "Running sum of an array", kind: "code", difficulty: "easy", moduleId: "programming-foundations", topics: ["Arrays", "Prefix sums"], progress: "solved", acceptanceRate: 89, companies: ["Amazon"] },
  { id: "reverse-words", title: "Reverse words in a string", kind: "code", difficulty: "easy", moduleId: "programming-foundations", topics: ["Strings", "Two pointers"], progress: "solved", acceptanceRate: 71, companies: ["Microsoft", "Adobe"] },
  { id: "count-primes", title: "Count primes below n", kind: "code", difficulty: "medium", moduleId: "programming-foundations", topics: ["Math", "Sieve"], progress: "solved", acceptanceRate: 48, companies: ["Amazon"] },

  // Module 2 — DSA
  { id: "two-sum", title: "Two sum", kind: "code", difficulty: "easy", moduleId: "data-structures-algorithms", topics: ["Arrays", "Hash map"], progress: "solved", acceptanceRate: 82, companies: ["Google", "Amazon", "Flipkart"] },
  { id: "valid-parentheses", title: "Valid parentheses", kind: "code", difficulty: "easy", moduleId: "data-structures-algorithms", topics: ["Stack", "Strings"], progress: "solved", acceptanceRate: 76, companies: ["Atlassian", "Swiggy"] },
  { id: "longest-substring-without-repeating", title: "Longest substring without repeating characters", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Sliding window", "Hash map", "Strings"], progress: "solved", acceptanceRate: 54, companies: ["Google", "Uber", "Razorpay"] },
  { id: "merge-intervals", title: "Merge intervals", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Sorting", "Intervals"], progress: "solved", acceptanceRate: 61, companies: ["Google", "Atlassian"] },
  { id: "top-k-frequent-elements", title: "Top K frequent elements", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Hash map", "Heap", "Bucket sort"], progress: "solved", acceptanceRate: 64, companies: ["Amazon", "Uber"] },
  { id: "lru-cache", title: "LRU cache", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Design", "Hash map", "Linked list"], progress: "solved", acceptanceRate: 43, companies: ["Microsoft", "Swiggy", "PhonePe"] },
  { id: "binary-tree-level-order", title: "Binary tree level order traversal", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Trees", "BFS"], progress: "solved", acceptanceRate: 68, companies: ["Amazon"] },
  { id: "number-of-islands", title: "Number of islands", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Graphs", "DFS", "BFS"], progress: "solved", acceptanceRate: 59, companies: ["Google", "Zomato"] },
  { id: "course-schedule", title: "Course schedule", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Graphs", "Topological sort"], progress: "solved", acceptanceRate: 47, companies: ["Uber", "Flipkart"] },
  { id: "coin-change", title: "Coin change", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Dynamic programming"], progress: "solved", acceptanceRate: 44, companies: ["Razorpay", "Amazon"] },
  { id: "kth-largest-element", title: "Kth largest element in an array", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Heap", "Quickselect"], progress: "solved", acceptanceRate: 66, companies: ["Microsoft"] },
  { id: "trapping-rain-water", title: "Trapping rain water", kind: "code", difficulty: "hard", moduleId: "data-structures-algorithms", topics: ["Two pointers", "Monotonic stack"], progress: "solved", acceptanceRate: 38, companies: ["Google", "Atlassian", "Uber"], recommended: true },
  { id: "sliding-window-maximum", title: "Sliding window maximum", kind: "code", difficulty: "hard", moduleId: "data-structures-algorithms", topics: ["Sliding window", "Deque"], progress: "attempted", acceptanceRate: 35, companies: ["Amazon", "Uber"], recommended: true },
  { id: "word-ladder", title: "Word ladder", kind: "code", difficulty: "hard", moduleId: "data-structures-algorithms", topics: ["Graphs", "BFS"], progress: "attempted", acceptanceRate: 31, companies: ["Google"] },
  { id: "median-of-two-sorted-arrays", title: "Median of two sorted arrays", kind: "code", difficulty: "hard", moduleId: "data-structures-algorithms", topics: ["Binary search"], progress: "attempted", acceptanceRate: 29, companies: ["Google", "Adobe"], recommended: true },
  { id: "alien-dictionary", title: "Alien dictionary", kind: "code", difficulty: "hard", moduleId: "data-structures-algorithms", topics: ["Graphs", "Topological sort"], progress: "not_started", acceptanceRate: 27, companies: ["Atlassian", "Uber"], recommended: true },
  { id: "meeting-rooms-ii", title: "Meeting rooms II", kind: "code", difficulty: "medium", moduleId: "data-structures-algorithms", topics: ["Intervals", "Heap"], progress: "not_started", acceptanceRate: 52, companies: ["Google", "Flipkart"] },

  // Module 3 — Databases & SQL
  { id: "customers-without-orders", title: "Customers without orders", kind: "sql", difficulty: "easy", moduleId: "databases-sql", topics: ["Joins"], progress: "solved", acceptanceRate: 79, companies: ["Swiggy"] },
  { id: "second-highest-salary", title: "Second highest salary", kind: "sql", difficulty: "medium", moduleId: "databases-sql", topics: ["Subqueries", "Ranking"], progress: "solved", acceptanceRate: 46, companies: ["Amazon", "PhonePe"] },
  { id: "monthly-active-users", title: "Monthly active users", kind: "sql", difficulty: "medium", moduleId: "databases-sql", topics: ["Aggregation", "Dates"], progress: "solved", acceptanceRate: 57, companies: ["Zomato", "Razorpay"] },
  { id: "department-top-three-salaries", title: "Department top three salaries", kind: "sql", difficulty: "hard", moduleId: "databases-sql", topics: ["Window functions", "Ranking"], progress: "solved", acceptanceRate: 37, companies: ["Amazon", "Flipkart"] },
  { id: "consecutive-login-streaks", title: "Consecutive login streaks", kind: "sql", difficulty: "hard", moduleId: "databases-sql", topics: ["Window functions", "Gaps and islands"], progress: "attempted", acceptanceRate: 28, companies: ["Uber"], recommended: true },

  // Locked: their modules are not unlocked yet for this learner
  { id: "token-bucket-rate-limiter", title: "Token bucket rate limiter", kind: "code", difficulty: "medium", moduleId: "production-engineering", topics: ["Design", "Concurrency"], progress: "not_started", acceptanceRate: 46, companies: ["Razorpay", "Atlassian"], locked: true },
  { id: "kmeans-clustering", title: "Implement k-means clustering", kind: "code", difficulty: "medium", moduleId: "ai-ml-engineering", topics: ["Machine learning", "NumPy"], progress: "not_started", acceptanceRate: 41, companies: ["Microsoft", "Flipkart"], locked: true },
];

/** Full problem content. Problems not listed here get a generated placeholder (see src/data/problems.ts). */
export const problemDetails: Record<string, Omit<ProblemDetail, keyof ProblemSummary>> = {
  "longest-substring-without-repeating": {
    statement: [
      "Given a string `s`, return the length of the longest substring that contains no repeated characters.",
      "A substring is a contiguous block of characters inside the string. `\"abc\"` is a substring of `\"zabcd\"`, while `\"acd\"` is not.",
    ],
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with length 1.' },
      { input: 's = "pwwkew"', output: "3", explanation: '"wke" has length 3. "pwke" is a subsequence, not a substring.' },
    ],
    constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s contains English letters, digits, symbols and spaces"],
    starterCode: {
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass\n",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};\n",
      javascript: "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  // Write your solution here\n}\n",
      go: "func lengthOfLongestSubstring(s string) int {\n\t// Write your solution here\n\treturn 0\n}\n",
    },
    sampleTests: [
      { id: "t1", input: '"abcabcbb"', expected: "3" },
      { id: "t2", input: '"bbbbb"', expected: "1" },
      { id: "t3", input: '"pwwkew"', expected: "3" },
    ],
    hiddenTestCount: 42,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
  },
  "department-top-three-salaries": {
    statement: [
      "A company wants to see the top earners in each department. A top earner is an employee whose salary is among the three highest unique salaries in their department.",
      "Write a query that returns each top earner with their department name and salary. Return the rows in any order.",
    ],
    examples: [
      {
        input: "Employee and Department tables shown in the schema panel",
        output: "IT | Max | 90000\nIT | Joe | 85000\nIT | Randy | 85000\nIT | Will | 70000\nSales | Henry | 80000\nSales | Sam | 60000",
        explanation: "In IT, Max has the highest salary, Joe and Randy share the second, and Will has the third.",
      },
    ],
    constraints: ["Ties share a rank: use unique salary values, not row counts", "A department may have fewer than three employees"],
    starterCode: {
      sql: "-- Write a PostgreSQL query\nSELECT\n  d.name AS department,\n  e.name AS employee,\n  e.salary\nFROM employee e\nJOIN department d ON d.id = e.department_id;\n",
    },
    sampleTests: [{ id: "t1", input: "Sample dataset", expected: "6 rows" }],
    hiddenTestCount: 8,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    schema: [
      {
        name: "employee",
        columns: [
          { name: "id", type: "int" },
          { name: "name", type: "varchar" },
          { name: "salary", type: "int" },
          { name: "department_id", type: "int" },
        ],
        rows: [
          [1, "Joe", 85000, 1],
          [2, "Henry", 80000, 2],
          [3, "Sam", 60000, 2],
          [4, "Max", 90000, 1],
          [5, "Janet", 69000, 1],
          [6, "Randy", 85000, 1],
          [7, "Will", 70000, 1],
        ],
      },
      {
        name: "department",
        columns: [
          { name: "id", type: "int" },
          { name: "name", type: "varchar" },
        ],
        rows: [
          [1, "IT"],
          [2, "Sales"],
        ],
      },
    ],
  },
  "two-sum": {
    statement: [
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.",
      "Each input has exactly one solution, and you may not use the same element twice. Return the two indices in any order.",
    ],
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
      { input: "nums = [3, 3], target = 6", output: "[0, 1]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "−10⁹ ≤ nums[i], target ≤ 10⁹", "Exactly one valid answer exists"],
    starterCode: {
      python: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass\n",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[0];\n    }\n}\n",
      cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your solution here\n}\n",
      go: "func twoSum(nums []int, target int) []int {\n\t// Write your solution here\n\treturn nil\n}\n",
    },
    sampleTests: [
      { id: "t1", input: "[2,7,11,15]\n9", expected: "[0,1]" },
      { id: "t2", input: "[3,2,4]\n6", expected: "[1,2]" },
      { id: "t3", input: "[3,3]\n6", expected: "[0,1]" },
    ],
    hiddenTestCount: 36,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
  },
  "trapping-rain-water": {
    statement: [
      "Given `n` non-negative integers representing an elevation map where every bar has width 1, compute how much rain water the map can trap.",
      "Water above a bar is limited by the shorter of the tallest bars to its left and right.",
    ],
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Six units of water collect between the bars." },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["n == height.length", "1 ≤ n ≤ 2 × 10⁴", "0 ≤ height[i] ≤ 10⁵"],
    starterCode: {
      python: "class Solution:\n    def trap(self, height: list[int]) -> int:\n        # Write your solution here\n        pass\n",
      java: "class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      cpp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your solution here\n        return 0;\n    }\n};\n",
      javascript: "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  // Write your solution here\n}\n",
      go: "func trap(height []int) int {\n\t// Write your solution here\n\treturn 0\n}\n",
    },
    sampleTests: [
      { id: "t1", input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
      { id: "t2", input: "[4,2,0,3,2,5]", expected: "9" },
    ],
    hiddenTestCount: 40,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
  },
  "sliding-window-maximum": {
    statement: [
      "You are given an array of integers `nums` and a window of size `k` that slides from the left end of the array to the right, one position at a time.",
      "Return an array with the maximum value inside each window position.",
    ],
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]", explanation: "The first window [1,3,-1] has maximum 3, and so on." },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−10⁴ ≤ nums[i] ≤ 10⁴", "1 ≤ k ≤ nums.length"],
    starterCode: {
      python: "class Solution:\n    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:\n        # Write your solution here\n        pass\n",
      java: "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your solution here\n        return new int[0];\n    }\n}\n",
      cpp: "class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        // Write your solution here\n        return {};\n    }\n};\n",
      javascript: "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction maxSlidingWindow(nums, k) {\n  // Write your solution here\n}\n",
      go: "func maxSlidingWindow(nums []int, k int) []int {\n\t// Write your solution here\n\treturn nil\n}\n",
    },
    sampleTests: [
      { id: "t1", input: "[1,3,-1,-3,5,3,6,7]\n3", expected: "[3,3,5,5,6,7]" },
      { id: "t2", input: "[1]\n1", expected: "[1]" },
    ],
    hiddenTestCount: 47,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
  },
  "consecutive-login-streaks": {
    statement: [
      "The `logins` table has one row for every day a user signed in. A streak is a run of consecutive calendar days with a login.",
      "Return every streak of **three or more** days with `user_id`, `streak_start`, `streak_end` and `streak_days`, ordered by `user_id` and `streak_start`.",
    ],
    examples: [
      {
        input: "logins table shown in the schema panel",
        output: "1 | 2026-10-01 | 2026-10-03 | 3\n2 | 2026-10-03 | 2026-10-06 | 4",
        explanation: "User 1's login on 5 Oct is a one-day streak, so it is left out.",
      },
    ],
    constraints: ["A user logs in at most once per day", "Streaks shorter than three days are excluded"],
    starterCode: { sql: "-- Write a PostgreSQL query\nSELECT user_id, login_date\nFROM logins\nORDER BY user_id, login_date;\n" },
    sampleTests: [{ id: "t1", input: "Sample dataset", expected: "2 rows" }],
    hiddenTestCount: 7,
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    schema: [
      {
        name: "logins",
        columns: [
          { name: "user_id", type: "int" },
          { name: "login_date", type: "date" },
        ],
        rows: [
          [1, "2026-10-01"],
          [1, "2026-10-02"],
          [1, "2026-10-03"],
          [1, "2026-10-05"],
          [2, "2026-10-01"],
          [2, "2026-10-03"],
          [2, "2026-10-04"],
          [2, "2026-10-05"],
          [2, "2026-10-06"],
          [3, "2026-10-02"],
        ],
      },
    ],
  },
};

/** Escalating hints per problem (nudge → concept → approach → pseudocode). Others get generic hints. */
export const problemHints: Record<string, ProblemHint[]> = {
  "longest-substring-without-repeating": [
    { level: "nudge", text: "As you scan left to right, what do you need to remember about the characters already in your current window?" },
    {
      level: "concept",
      text: "This is the **sliding window** pattern. Keep a window `[left, right]` that never contains a repeated character, and grow it one character at a time.",
    },
    {
      level: "approach",
      text: "Store the last index where each character appeared. When `s[right]` was last seen inside the window, move `left` to one past that index instead of stepping it forward one by one. Track the longest window you see.",
    },
    {
      level: "pseudocode",
      text: "left = 0, best = 0, last = empty map\nfor each index right:\n    if s[right] was seen at index ≥ left:\n        left = that index + 1\n    record right as the last index of s[right]\n    best = max(best, window length)\nreturn best",
    },
  ],
  "trapping-rain-water": [
    { level: "nudge", text: "How much water sits above a single bar? What two values decide it?" },
    { level: "concept", text: "Water above bar `i` is `min(maxLeft, maxRight) − height[i]`. **Two pointers** let you know which side is the limiting one without precomputing both arrays." },
    { level: "approach", text: "Move pointers inward from both ends. Always move the side with the smaller height: its running max is the true limit for that bar." },
    {
      level: "pseudocode",
      text: "left, right = ends of the array\nleftMax = rightMax = 0\nwhile left < right:\n    if height[left] < height[right]:\n        update leftMax or add leftMax − height[left]\n        move left inward\n    else: mirror the same on the right side",
    },
  ],
  "sliding-window-maximum": [
    { level: "nudge", text: "Recomputing the max of every window costs O(n·k). Which elements can never be a future maximum?" },
    { level: "concept", text: "A **monotonic deque** keeps candidate indices in decreasing order of value, so the front is always the current window's maximum." },
    { level: "approach", text: "For each index: drop the front if it left the window, pop smaller values from the back, push the index, and record the front once the first window is full." },
    {
      level: "pseudocode",
      text: "deque = empty\nfor i in 0..n−1:\n    remove front if it is outside the window\n    pop back while its value ≤ nums[i]\n    push i\n    if i ≥ k − 1: append value at front",
    },
  ],
  "department-top-three-salaries": [
    { level: "nudge", text: "Joe and Randy both earn 85000. Should that count as one salary or two when you pick the top three?" },
    { level: "concept", text: "**Window functions** rank rows inside each department without collapsing them. `DENSE_RANK()` gives ties the same rank and doesn't skip numbers." },
    { level: "approach", text: "Rank salaries within each department in a CTE, keep ranks 1–3, then join the department table for its name." },
    {
      level: "pseudocode",
      text: "WITH ranked AS (\n    employees + dense rank of salary within their department\n)\nSELECT department name, employee name, salary\nFROM ranked JOIN department\nWHERE rank ≤ 3",
    },
  ],
};

/** Reference query output for SQL problems, plus a wrong result for the demo. */
export const sqlJudgeData: Record<string, SqlJudgeData> = {
  "department-top-three-salaries": {
    expected: {
      columns: ["department", "employee", "salary"],
      rows: [
        ["IT", "Max", 90000],
        ["IT", "Joe", 85000],
        ["IT", "Randy", 85000],
        ["IT", "Will", 70000],
        ["Sales", "Henry", 80000],
        ["Sales", "Sam", 60000],
      ],
    },
    // ROW_NUMBER() instead of DENSE_RANK(): the tie pushes Will out of the top three.
    wrongAnswer: {
      columns: ["department", "employee", "salary"],
      rows: [
        ["IT", "Max", 90000],
        ["IT", "Joe", 85000],
        ["IT", "Randy", 85000],
        ["Sales", "Henry", 80000],
        ["Sales", "Sam", 60000],
      ],
    },
  },
  "consecutive-login-streaks": {
    expected: {
      columns: ["user_id", "streak_start", "streak_end", "streak_days"],
      rows: [
        [1, "2026-10-01", "2026-10-03", 3],
        [2, "2026-10-03", "2026-10-06", 4],
      ],
    },
    // Forgot the HAVING filter: short streaks are included.
    wrongAnswer: {
      columns: ["user_id", "streak_start", "streak_end", "streak_days"],
      rows: [
        [1, "2026-10-01", "2026-10-03", 3],
        [1, "2026-10-05", "2026-10-05", 1],
        [2, "2026-10-01", "2026-10-01", 1],
        [2, "2026-10-03", "2026-10-06", 4],
        [3, "2026-10-02", "2026-10-02", 1],
      ],
    },
  },
};

/** Why adaptive selection picked each recommended problem for this learner. */
export const recommendationReasons: ProblemRecommendation[] = [
  { problemId: "sliding-window-maximum", skill: "Sliding window", reason: "Your last submission timed out on large inputs. Practise the monotonic deque." },
  { problemId: "median-of-two-sorted-arrays", skill: "Binary search", reason: "Binary search is your weakest DSA skill at 48% mastery." },
  { problemId: "alien-dictionary", skill: "Topological sort", reason: "Asked often at Atlassian and Uber, two of your target companies." },
  { problemId: "trapping-rain-water", skill: "Two pointers", reason: "You scored 84, close to the line. A clean retry lifts Two pointers mastery." },
  { problemId: "consecutive-login-streaks", skill: "Window functions", reason: "Gaps-and-islands queries come up in data-heavy interviews." },
];
