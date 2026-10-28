import type { ComplexityEstimate, ScoreBreakdown, Submission, TestResult, Verdict } from "@/types/practice";

// Submission history for Aarav. Hidden tests carry only a verdict and runtime;
// sample tests also show input, expected and actual output.

function score(tests: number, rubric: number): ScoreBreakdown {
  return { tests, rubric, total: Math.round(tests * 0.7 + rubric * 0.3), testsWeight: 70, rubricWeight: 30 };
}

function hiddenTests(
  count: number,
  startNumber: number,
  options: { baseMs: number; memoryMb: number; failures?: Record<number, Verdict>; failRuntimeMs?: number },
): TestResult[] {
  return Array.from({ length: count }, (_, i) => {
    const number = startNumber + i;
    const verdict = options.failures?.[number] ?? "accepted";
    return {
      id: `h${number}`,
      name: `Hidden test ${number}`,
      verdict,
      runtimeMs: verdict === "time_limit_exceeded" ? 2000 : verdict === "accepted" ? options.baseMs + ((i * 7) % 23) : (options.failRuntimeMs ?? options.baseMs),
      memoryMb: options.memoryMb,
      hidden: true,
    };
  });
}

/** Marks every hidden test from `from` to `to` (inclusive) with a verdict. */
function range(from: number, to: number, verdict: Verdict): Record<number, Verdict> {
  const out: Record<number, Verdict> = {};
  for (let n = from; n <= to; n++) out[n] = verdict;
  return out;
}

const linear = (factor: number): ComplexityEstimate["samples"] =>
  [1_000, 10_000, 100_000, 500_000, 1_000_000].map((n) => ({ n, ms: Math.max(1, Math.round((n / 1000) * factor)) }));

export const submissions: Submission[] = [
  {
    id: "sub-1007",
    problemId: "longest-substring-without-repeating",
    problemTitle: "Longest substring without repeating characters",
    kind: "code",
    language: "python",
    submittedAt: "2026-10-27T15:42:00+05:30",
    verdict: "accepted",
    testsPassed: 45,
    testsTotal: 45,
    runtimeMs: 48,
    memoryMb: 17.2,
    score: score(100, 60),
    complexity: {
      time: "O(n)",
      space: "O(min(n, σ))",
      confidence: "high",
      samples: linear(1.3),
      note: "Runtime grows linearly with input size. The inner while loop moves `l` at most n times in total, so the work is amortised O(n). σ is the size of the character set.",
    },
    feedback: {
      summary:
        "Correct sliding-window solution that passes every hidden test. The main gaps are naming and making the window jump explicit, which matter when an interviewer reads your code.",
      confidence: "high",
      aois: [
        {
          id: "a1",
          category: "complexity",
          severity: "suggestion",
          title: "Jump the left pointer instead of stepping it",
          detail: "The `while` loop advances `l` one character at a time. Set `l = m[c] + 1` when `m[c] >= l` to make the O(n) bound obvious to a reader.",
          line: 7,
        },
        {
          id: "a2",
          category: "readability",
          severity: "suggestion",
          title: "Use descriptive names",
          detail: "`m`, `l` and `r` force the reader to infer meaning. `last_seen`, `left` and `right` read as the algorithm itself.",
          line: 3,
        },
        {
          id: "a3",
          category: "edge_cases",
          severity: "info",
          title: "Empty string is handled implicitly",
          detail: "An empty `s` returns 0 because the loop never runs. Say this out loud in an interview or add an early return so it's clearly intentional.",
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 8, max: 10, comment: "Sliding window with a hash map is the expected optimal approach." },
        { criterion: "Edge-case handling", score: 5, max: 10, comment: "Works for empty and single-character input, but only implicitly." },
        { criterion: "Readability and naming", score: 5, max: 10, comment: "Single-letter names make the window logic hard to follow." },
        { criterion: "Complexity awareness", score: 6, max: 10, comment: "Optimal in practice; the stepping loop hides the amortised bound." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 31, memoryMb: 16.9, hidden: false, input: '"abcabcbb"', expected: "3", actual: "3" },
      { id: "t2", name: "Sample 2", verdict: "accepted", runtimeMs: 29, memoryMb: 16.9, hidden: false, input: '"bbbbb"', expected: "1", actual: "1" },
      { id: "t3", name: "Sample 3", verdict: "accepted", runtimeMs: 30, memoryMb: 16.9, hidden: false, input: '"pwwkew"', expected: "3", actual: "3" },
      ...hiddenTests(42, 4, { baseMs: 30, memoryMb: 17.2 }),
    ],
    code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        m = {}
        l = 0
        best = 0
        for r, c in enumerate(s):
            while c in m and m[c] >= l:
                l += 1
            m[c] = r
            best = max(best, r - l + 1)
        return best
`,
  },
  {
    id: "sub-1006",
    problemId: "longest-substring-without-repeating",
    problemTitle: "Longest substring without repeating characters",
    kind: "code",
    language: "python",
    submittedAt: "2026-10-27T15:18:00+05:30",
    verdict: "wrong_answer",
    testsPassed: 31,
    testsTotal: 45,
    runtimeMs: 41,
    memoryMb: 17.0,
    score: score(69, 55),
    complexity: {
      time: "O(n)",
      space: "O(min(n, σ))",
      confidence: "medium",
      samples: linear(1.1),
      note: "Linear runtime, but the answer is wrong on inputs where a repeated character sits before the window.",
    },
    feedback: {
      summary:
        "Fast and close, but the left pointer can move backwards. Inputs like \"abba\" return 3 instead of 2 because the old index of 'a' is reused after the window has already passed it.",
      confidence: "high",
      aois: [
        {
          id: "a1",
          category: "correctness",
          severity: "important",
          title: "Left pointer moves backwards",
          detail: "Only move `left` when the last index of `ch` is inside the window: `left = max(left, last[ch] + 1)`. Try `\"abba\"` by hand to see the bug.",
          line: 8,
        },
        {
          id: "a2",
          category: "edge_cases",
          severity: "suggestion",
          title: "Test repeated characters outside the window",
          detail: "Add cases such as `\"abba\"` and `\"tmmzuxt\"` to your custom input before submitting.",
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 8, max: 10, comment: "Right pattern and data structure." },
        { criterion: "Edge-case handling", score: 3, max: 10, comment: "Misses characters that were seen before the current window." },
        { criterion: "Readability and naming", score: 7, max: 10, comment: "Clear names; `enumerate` reads well." },
        { criterion: "Complexity awareness", score: 4, max: 10, comment: "Optimal complexity, but correctness comes first." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 28, memoryMb: 16.8, hidden: false, input: '"abcabcbb"', expected: "3", actual: "3" },
      { id: "t2", name: "Sample 2", verdict: "accepted", runtimeMs: 27, memoryMb: 16.8, hidden: false, input: '"bbbbb"', expected: "1", actual: "1" },
      { id: "t3", name: "Sample 3", verdict: "accepted", runtimeMs: 27, memoryMb: 16.8, hidden: false, input: '"pwwkew"', expected: "3", actual: "3" },
      ...hiddenTests(42, 4, {
        baseMs: 27,
        memoryMb: 17.0,
        failures: { 9: "wrong_answer", 12: "wrong_answer", 15: "wrong_answer", ...range(21, 26, "wrong_answer"), ...range(38, 42, "wrong_answer") },
      }),
    ],
    code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            if ch in last:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left + 1)
        return best
`,
  },
  {
    id: "sub-1005",
    problemId: "sliding-window-maximum",
    problemTitle: "Sliding window maximum",
    kind: "code",
    language: "java",
    submittedAt: "2026-10-26T22:10:00+05:30",
    verdict: "time_limit_exceeded",
    testsPassed: 38,
    testsTotal: 49,
    runtimeMs: 2000,
    memoryMb: 61.3,
    score: score(78, 50),
    complexity: {
      time: "O(n · k)",
      space: "O(n)",
      confidence: "high",
      samples: [
        { n: 1_000, ms: 6 },
        { n: 10_000, ms: 92 },
        { n: 50_000, ms: 1_180 },
        { n: 100_000, ms: 2_000 },
      ],
      note: "Runtime grows with both n and k. With n = 10⁵ and k near n/2 the hidden tests hit the 2-second limit.",
    },
    feedback: {
      summary: "Correct on small inputs, but the nested loop rescans each window. Large hidden tests time out. A monotonic deque gives O(n).",
      confidence: "high",
      aois: [
        {
          id: "a1",
          category: "complexity",
          severity: "important",
          title: "Rescanning every window is O(n · k)",
          detail: "Keep a deque of indices with decreasing values. Each index is pushed and popped once, so the whole pass is O(n).",
          line: 7,
        },
        {
          id: "a2",
          category: "edge_cases",
          severity: "info",
          title: "k equal to n",
          detail: "Your loop handles `k == nums.length` correctly. Mention it when you walk through test cases.",
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 3, max: 10, comment: "Brute force where an O(n) pattern is expected." },
        { criterion: "Edge-case handling", score: 7, max: 10, comment: "Boundaries of the result array are correct." },
        { criterion: "Readability and naming", score: 7, max: 10, comment: "Straightforward and easy to read." },
        { criterion: "Complexity awareness", score: 3, max: 10, comment: "No sign of considering the 10⁵ input limit." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 4, memoryMb: 41.2, hidden: false, input: "[1,3,-1,-3,5,3,6,7]\n3", expected: "[3,3,5,5,6,7]", actual: "[3,3,5,5,6,7]" },
      { id: "t2", name: "Sample 2", verdict: "accepted", runtimeMs: 3, memoryMb: 41.0, hidden: false, input: "[1]\n1", expected: "[1]", actual: "[1]" },
      ...hiddenTests(47, 3, { baseMs: 6, memoryMb: 61.3, failures: range(39, 49, "time_limit_exceeded") }),
    ],
    code: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        for (int i = 0; i + k <= n; i++) {
            int max = Integer.MIN_VALUE;
            for (int j = i; j < i + k; j++) {
                max = Math.max(max, nums[j]);
            }
            result[i] = max;
        }
        return result;
    }
}
`,
  },
  {
    id: "sub-1004",
    problemId: "department-top-three-salaries",
    problemTitle: "Department top three salaries",
    kind: "sql",
    language: "sql",
    submittedAt: "2026-10-25T20:05:00+05:30",
    verdict: "accepted",
    testsPassed: 9,
    testsTotal: 9,
    runtimeMs: 36,
    memoryMb: 9.1,
    score: score(100, 60),
    feedback: {
      summary: "Correct use of DENSE_RANK to handle salary ties. Naming and an index hint would make this production-ready.",
      confidence: "high",
      aois: [
        {
          id: "a1",
          category: "readability",
          severity: "suggestion",
          title: "Name the CTE and rank column",
          detail: "`t` and `r` say nothing. `ranked_salaries` and `salary_rank` explain the query at a glance.",
          line: 1,
        },
        {
          id: "a2",
          category: "complexity",
          severity: "info",
          title: "Index for large tables",
          detail: "On a large `employee` table, an index on `(department_id, salary DESC)` lets Postgres avoid a full sort per partition.",
        },
      ],
      rubric: [
        { criterion: "Correct ranking function", score: 8, max: 10, comment: "DENSE_RANK handles ties exactly as required." },
        { criterion: "Readability", score: 4, max: 10, comment: "Short aliases hide intent." },
        { criterion: "Query efficiency", score: 6, max: 10, comment: "Fine for the dataset; no thought given to indexing." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample dataset", verdict: "accepted", runtimeMs: 21, memoryMb: 8.8, hidden: false, input: "Sample dataset", expected: "6 rows", actual: "6 rows" },
      ...hiddenTests(8, 2, { baseMs: 18, memoryMb: 9.1 }),
    ],
    code: `WITH t AS (
  SELECT
    e.name,
    e.salary,
    e.department_id,
    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS r
  FROM employee e
)
SELECT d.name AS department, t.name AS employee, t.salary
FROM t
JOIN department d ON d.id = t.department_id
WHERE t.r <= 3;
`,
  },
  {
    id: "sub-1003",
    problemId: "trapping-rain-water",
    problemTitle: "Trapping rain water",
    kind: "code",
    language: "cpp",
    submittedAt: "2026-10-24T21:30:00+05:30",
    verdict: "accepted",
    testsPassed: 42,
    testsTotal: 42,
    runtimeMs: 4,
    memoryMb: 9.8,
    score: score(100, 47),
    complexity: {
      time: "O(n)",
      space: "O(1)",
      confidence: "high",
      samples: linear(0.08),
      note: "Single pass with two pointers and constant extra memory.",
    },
    feedback: {
      summary:
        "Optimal two-pointer solution. The rubric score is held back by terse names and dense one-line branches, which make it hard to explain under interview pressure.",
      confidence: "medium",
      aois: [
        {
          id: "a1",
          category: "readability",
          severity: "important",
          title: "Names hide the two running maxima",
          detail: "`h`, `lm` and `rm` should be `height`, `leftMax` and `rightMax`. Interviewers read for intent.",
          line: 4,
        },
        {
          id: "a2",
          category: "style",
          severity: "suggestion",
          title: "Split the one-line if/else",
          detail: "`if (h[l] >= lm) lm = h[l]; else ans += lm - h[l];` packs two ideas into one line. Use braces and separate lines.",
          line: 8,
        },
        {
          id: "a3",
          category: "edge_cases",
          severity: "suggestion",
          title: "Unsigned arithmetic on size()",
          detail: "`h.size() - 1` is unsigned. It's safe here because n ≥ 1, but cast or guard empty input explicitly.",
          line: 4,
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 9, max: 10, comment: "Two pointers with running maxima, the optimal approach." },
        { criterion: "Edge-case handling", score: 4, max: 10, comment: "Relies on the constraint n ≥ 1 without saying so." },
        { criterion: "Readability and naming", score: 2, max: 10, comment: "Terse names and compressed branches." },
        { criterion: "Complexity awareness", score: 4, max: 10, comment: "Optimal, but no comments explaining why the smaller side moves." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 1, memoryMb: 9.6, hidden: false, input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6", actual: "6" },
      { id: "t2", name: "Sample 2", verdict: "accepted", runtimeMs: 1, memoryMb: 9.6, hidden: false, input: "[4,2,0,3,2,5]", expected: "9", actual: "9" },
      ...hiddenTests(40, 3, { baseMs: 1, memoryMb: 9.8 }),
    ],
    code: `class Solution {
public:
    int trap(vector<int>& h) {
        int l = 0, r = h.size() - 1;
        int lm = 0, rm = 0, ans = 0;
        while (l < r) {
            if (h[l] < h[r]) {
                if (h[l] >= lm) lm = h[l]; else ans += lm - h[l];
                l++;
            } else {
                if (h[r] >= rm) rm = h[r]; else ans += rm - h[r];
                r--;
            }
        }
        return ans;
    }
};
`,
    review: {
      status: "queued",
      reason: "Score 84 is in the 80–88% band next to the 85% pass line, so a human reviewer confirms it before it counts.",
    },
  },
  {
    id: "sub-1002",
    problemId: "two-sum",
    problemTitle: "Two sum",
    kind: "code",
    language: "java",
    submittedAt: "2026-10-22T19:12:00+05:30",
    verdict: "accepted",
    testsPassed: 39,
    testsTotal: 39,
    runtimeMs: 3,
    memoryMb: 44.6,
    score: score(100, 90),
    complexity: { time: "O(n)", space: "O(n)", confidence: "high", samples: linear(0.05), note: "One pass with a hash map of seen values." },
    feedback: {
      summary: "Clean single-pass hash map solution with clear names.",
      confidence: "high",
      aois: [
        {
          id: "a1",
          category: "edge_cases",
          severity: "info",
          title: "Duplicate values",
          detail: "Checking the map before inserting correctly handles `[3, 3]`. Call this out when you explain your approach.",
          line: 5,
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 10, max: 10, comment: "Optimal." },
        { criterion: "Edge-case handling", score: 9, max: 10, comment: "Duplicates handled by checking before inserting." },
        { criterion: "Readability and naming", score: 9, max: 10, comment: "Clear and idiomatic." },
        { criterion: "Complexity awareness", score: 8, max: 10, comment: "Could note the O(n) memory trade-off." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 1, memoryMb: 44.1, hidden: false, input: "[2,7,11,15]\n9", expected: "[0,1]", actual: "[0,1]" },
      { id: "t2", name: "Sample 2", verdict: "accepted", runtimeMs: 1, memoryMb: 44.1, hidden: false, input: "[3,2,4]\n6", expected: "[1,2]", actual: "[1,2]" },
      { id: "t3", name: "Sample 3", verdict: "accepted", runtimeMs: 1, memoryMb: 44.1, hidden: false, input: "[3,3]\n6", expected: "[0,1]", actual: "[0,1]" },
      ...hiddenTests(36, 4, { baseMs: 1, memoryMb: 44.6 }),
    ],
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[] { j, i };
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}
`,
  },
  {
    id: "sub-1001",
    problemId: "coin-change",
    problemTitle: "Coin change",
    kind: "code",
    language: "python",
    submittedAt: "2026-10-20T08:45:00+05:30",
    verdict: "accepted",
    testsPassed: 31,
    testsTotal: 31,
    runtimeMs: 412,
    memoryMb: 18.9,
    score: score(100, 53),
    complexity: { time: "O(amount · c)", space: "O(amount)", confidence: "low", samples: linear(0.4), note: "c is the number of coin denominations. The grader was unsure how to read the nested loop, so this went to a human." },
    feedback: {
      summary: "Correct bottom-up DP. The AI grader had low confidence in its rubric reading, so a human reviewed the score.",
      confidence: "low",
      aois: [
        {
          id: "a1",
          category: "readability",
          severity: "suggestion",
          title: "Name the sentinel",
          detail: "`amount + 1` works as infinity, but `INF = amount + 1` makes the intent explicit.",
          line: 3,
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 7, max: 10, comment: "Bottom-up DP is a good fit." },
        { criterion: "Edge-case handling", score: 5, max: 10, comment: "amount = 0 handled; unreachable amounts return −1." },
        { criterion: "Readability and naming", score: 5, max: 10, comment: "Sentinel value is unexplained." },
        { criterion: "Complexity awareness", score: 4, max: 10, comment: "No mention of time or space trade-offs." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 22, memoryMb: 16.4, hidden: false, input: "[1, 2, 3]", expected: "6", actual: "6" },
      ...hiddenTests(30, 2, { baseMs: 180, memoryMb: 18.9 }),
    ],
    code: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for total in range(1, amount + 1):
            for coin in coins:
                if coin <= total:
                    dp[total] = min(dp[total], dp[total - coin] + 1)
        return dp[amount] if dp[amount] <= amount else -1
`,
    review: {
      status: "reviewed",
      reason: "Low grader confidence",
      reviewerNote: "Confirmed at 86. The AI read the bottom-up loop as recursion; the solution is iterative and correct. — Neha R., reviewer",
    },
  },
  {
    id: "sub-0998",
    problemId: "lru-cache",
    problemTitle: "LRU cache",
    kind: "code",
    language: "cpp",
    submittedAt: "2026-10-18T22:40:00+05:30",
    verdict: "compile_error",
    testsPassed: 0,
    testsTotal: 31,
    runtimeMs: 0,
    memoryMb: 0,
    score: score(0, 0),
    tests: [],
    code: `class LRUCache {
    int capacity;
    list<pair<int, int>> items;
    unordered_map<int, list<pair<int, int>>::iterator> index;
public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        auto it = index.find(key);
        if (it == index.end()) return -1
        items.splice(items.begin(), items, it->second);
        return it->second->second;
    }
};
`,
  },
  {
    id: "sub-0995",
    problemId: "consecutive-login-streaks",
    problemTitle: "Consecutive login streaks",
    kind: "sql",
    language: "sql",
    submittedAt: "2026-10-16T18:20:00+05:30",
    verdict: "wrong_answer",
    testsPassed: 5,
    testsTotal: 8,
    runtimeMs: 41,
    memoryMb: 9.4,
    score: score(63, 50),
    feedback: {
      summary: "The gaps-and-islands grouping is right, but streaks shorter than three days are not filtered out.",
      confidence: "high",
      aois: [
        {
          id: "a1",
          category: "correctness",
          severity: "important",
          title: "Missing HAVING filter",
          detail: "Add `HAVING COUNT(*) >= 3` after grouping by the island key so one- and two-day streaks are excluded.",
          line: 11,
        },
      ],
      rubric: [
        { criterion: "Correct grouping", score: 8, max: 10, comment: "`login_date - ROW_NUMBER()` is the right island key." },
        { criterion: "Readability", score: 4, max: 10, comment: "Unnamed expressions in GROUP BY." },
        { criterion: "Query efficiency", score: 3, max: 10, comment: "Fine on the dataset; no ordering index discussed." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample dataset", verdict: "wrong_answer", runtimeMs: 24, memoryMb: 9.2, hidden: false, input: "Sample dataset", expected: "2 rows", actual: "5 rows" },
      ...hiddenTests(7, 2, { baseMs: 20, memoryMb: 9.4, failures: { 3: "wrong_answer", 6: "wrong_answer" } }),
    ],
    code: `SELECT
  user_id,
  MIN(login_date) AS streak_start,
  MAX(login_date) AS streak_end,
  COUNT(*) AS streak_days
FROM (
  SELECT user_id, login_date,
         login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp
  FROM logins
) s
GROUP BY user_id, grp
ORDER BY user_id, streak_start;
`,
  },
  {
    id: "sub-0990",
    problemId: "median-of-two-sorted-arrays",
    problemTitle: "Median of two sorted arrays",
    kind: "code",
    language: "go",
    submittedAt: "2026-10-14T23:05:00+05:30",
    verdict: "runtime_error",
    testsPassed: 12,
    testsTotal: 31,
    runtimeMs: 3,
    memoryMb: 6.2,
    score: score(39, 33),
    complexity: { time: "O(log(min(m, n)))", space: "O(1)", confidence: "medium", samples: linear(0.01), note: "The binary-search approach is right; runtime is negligible until it crashes." },
    feedback: {
      summary: "Correct idea (binary search on the shorter array), but the partition index runs past the end when one array is empty.",
      confidence: "medium",
      aois: [
        {
          id: "a1",
          category: "correctness",
          severity: "important",
          title: "Index out of range on empty input",
          detail: "When `i` equals `len(nums1)` (always true if `nums1` is empty), `nums1[i]` panics. Guard it with `math.MaxInt` like you did for `right2`.",
          line: 15,
        },
        {
          id: "a2",
          category: "edge_cases",
          severity: "suggestion",
          title: "Always search the shorter array",
          detail: "Swap the arguments when `len(nums1) > len(nums2)` so the partition of the other array is always valid.",
          line: 2,
        },
      ],
      rubric: [
        { criterion: "Algorithm choice", score: 8, max: 10, comment: "Binary search partition is the optimal approach." },
        { criterion: "Edge-case handling", score: 1, max: 10, comment: "Empty arrays crash the solution." },
        { criterion: "Readability and naming", score: 2, max: 10, comment: "Hard to follow without comments." },
        { criterion: "Complexity awareness", score: 2, max: 10, comment: "Not discussed." },
      ],
    },
    tests: [
      { id: "t1", name: "Sample 1", verdict: "accepted", runtimeMs: 1, memoryMb: 6.0, hidden: false, input: "[1, 2, 3]", expected: "6", actual: "6" },
      ...hiddenTests(30, 2, { baseMs: 1, memoryMb: 6.2, failures: range(13, 31, "runtime_error") }),
    ],
    code: `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	m, n := len(nums1), len(nums2)
	lo, hi := 0, m
	for lo <= hi {
		i := (lo + hi) / 2
		j := (m+n+1)/2 - i
		left1 := math.MinInt
		if i > 0 {
			left1 = nums1[i-1]
		}
		left2 := math.MinInt
		if j > 0 {
			left2 = nums2[j-1]
		}
		right1 := nums1[i]
		right2 := math.MaxInt
		if j < n {
			right2 = nums2[j]
		}
		if left1 <= right2 && left2 <= right1 {
			if (m+n)%2 == 1 {
				return float64(max(left1, left2))
			}
			return float64(max(left1, left2)+min(right1, right2)) / 2
		} else if left1 > right2 {
			hi = i - 1
		} else {
			lo = i + 1
		}
	}
	return 0
}
`,
  },
];

/** Compiler output and runtime traces, shown on the result page. */
export const submissionLogs: Record<string, string> = {
  "sub-0998": `solution.cpp: In member function 'int LRUCache::get(int)':
solution.cpp:10:47: error: expected ';' before 'items'
   10 |         if (it == index.end()) return -1
      |                                         ^
      |                                         ;
   11 |         items.splice(items.begin(), items, it->second);
      |         ~~~~~
1 error generated. Compilation failed.`,
  "sub-0990": `panic: runtime error: index out of range [0] with length 0

goroutine 1 [running]:
main.findMedianSortedArrays({0x0, 0x0, 0x0}, {0xc000012080, 0x1, 0x1})
	/sandbox/solution.go:15 +0x1d4
exit status 2  (failed on hidden test 13)`,
};
