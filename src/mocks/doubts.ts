import type { DoubtThread, HintLevel } from "@/types/doubts";

/** Hints used for new threads that have no authored hint set yet. */
export const genericHints: Record<HintLevel, string> = {
  nudge: "What is the smallest input where your code does something different from what you expect? Try it by hand first.",
  concept: "Name the pattern this problem belongs to (two pointers, hashing, BFS, DP…). Which invariant does that pattern keep true at every step?",
  approach: "Write the steps in plain words before coding: what you store, how it changes per element, and when you read the answer.",
  pseudocode: "Outline the loop and the state it updates, in pseudocode only. I won't write the final code for you, but I can check your outline.",
};

export const doubtThreads: DoubtThread[] = [
  {
    id: "dt-lesson-hashing",
    title: "Why do virtual nodes balance the load?",
    source: "lesson",
    status: "open",
    updatedAt: "2026-10-27T17:52:00+05:30",
    hintsGiven: ["nudge"],
    messages: [
      {
        id: "m1",
        role: "learner",
        at: "2026-10-27T17:40:00+05:30",
        content:
          "At 6:12 the instructor says adding 100–200 virtual nodes per server evens out the load. Why would more points on the ring make it more even? Each server still owns the same total range on average.",
      },
      {
        id: "m2",
        role: "assistant",
        hintLevel: "nudge",
        at: "2026-10-27T17:41:00+05:30",
        content:
          "Good question. Picture only 3 points on the ring, one per server. How big is the gap behind each point, and how much can those gaps differ from one server to the next?",
      },
      {
        id: "m3",
        role: "learner",
        at: "2026-10-27T17:50:00+05:30",
        content: "The gaps could be really uneven, so one server might own 60% of the ring?",
      },
      {
        id: "m4",
        role: "assistant",
        at: "2026-10-27T17:52:00+05:30",
        content:
          "Exactly. With few points, arc sizes vary a lot. With many virtual nodes, each server owns **many small arcs**, and the total of many small random arcs stays close to the average. Ask for the next hint if you want to see why this also helps when a server leaves the ring.",
      },
    ],
    hints: {
      nudge:
        "Picture only 3 points on the ring, one per server. How big is the gap behind each point, and how much can those gaps differ from one server to the next?",
      concept:
        "Variance drops as the number of arcs per server grows. With k virtual nodes each server owns k independent arcs, so its share concentrates around 1/n. When a server leaves, its k arcs are picked up by many different neighbours instead of one.",
      approach:
        "Check it yourself: place 3 servers with 1 point each, hash 10,000 keys and count keys per server. Repeat with 150 points per server and compare the largest and smallest counts.",
      pseudocode:
        "for each server:\n  for i in 0..k-1:\n    ring.add(hash(server.id + '#' + i), server)\nsort ring by position\nlookup(key): first ring point ≥ hash(key), wrapping to the start",
    },
    context: {
      lessonMoment: {
        lessonId: "lesson-consistent-hashing",
        lessonTitle: "Consistent hashing",
        atSec: 372,
        excerpt:
          "…so instead of placing each server on the ring once, we place it 150 times using different hash seeds. These virtual nodes spread every server's share across many small arcs, which evens out the load…",
      },
      lessonMatch: {
        lessonId: "lesson-load-balancing",
        lessonTitle: "Load balancing and horizontal scaling",
        atSec: 684,
        excerpt: "…the goal of any partitioning scheme is that no single server carries much more than its fair share, even as servers join and leave…",
        similarity: 0.81,
      },
      callFlow: {
        title: "Routing a key with virtual nodes",
        root: {
          id: "r",
          label: 'get("user:4821")',
          children: [
            {
              id: "h",
              label: "hash(key) = 0x9F3A21",
              children: [
                {
                  id: "s",
                  label: "Binary search the ring (600 points)",
                  children: [
                    { id: "b", label: "vnode B#87 → server B", tone: "active", note: "first point clockwise" },
                    { id: "c", label: "If B is down: vnode C#12 → server C", tone: "base", note: "only B's keys move" },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: "dt-coin-change",
    title: "Coin change returns -1 when amount is 0",
    source: "problem",
    status: "open",
    updatedAt: "2026-10-26T22:10:00+05:30",
    hintsGiven: ["nudge", "concept"],
    messages: [
      {
        id: "m1",
        role: "learner",
        at: "2026-10-26T22:02:00+05:30",
        content: "My solution passes the samples but fails hidden test 4. I added a guard for invalid amounts at the top. Why is it wrong?",
      },
      {
        id: "m2",
        role: "assistant",
        hintLevel: "nudge",
        at: "2026-10-26T22:03:00+05:30",
        content: "Look at the guard on line 3. If there is nothing left to pay, how many coins do you still need?",
      },
      {
        id: "m3",
        role: "learner",
        at: "2026-10-26T22:09:00+05:30",
        content: "Zero coins. But then how do I tell “no way to make this amount” apart from that?",
      },
      {
        id: "m4",
        role: "assistant",
        hintLevel: "concept",
        at: "2026-10-26T22:10:00+05:30",
        content:
          "Those are two different base cases. `amount == 0` is a **success** that needs 0 coins. A negative remainder is a **dead end** that your helper already returns as infinity. Only convert infinity to -1 once, at the very top.",
      },
    ],
    hints: {
      nudge: "Look at the guard on line 3. If there is nothing left to pay, how many coins do you still need?",
      concept:
        "Those are two different base cases. `amount == 0` is a success that needs 0 coins. A negative remainder is a dead end that your helper already returns as infinity.",
      approach:
        "Remove the guard, or change it to `amount < 0`. Keep `best(0) = 0` as the success case and `best(negative) = ∞` as the dead end; your final ∞ → -1 conversion already handles impossible amounts.",
      pseudocode:
        "best(rem):\n  if rem == 0: return 0\n  if rem < 0: return INF\n  if rem in memo: return memo[rem]\n  memo[rem] = 1 + min(best(rem - c) for c in coins)\n  return memo[rem]\nanswer = best(amount)\nreturn -1 if answer is INF else answer",
    },
    context: {
      problem: { id: "coin-change", title: "Coin change", difficulty: "medium" },
      code: {
        language: "python",
        snippet:
          'class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        if amount <= 0:\n            return -1          # guard for invalid input\n        memo = {}\n\n        def best(rem: int) -> float:\n            if rem == 0:\n                return 0\n            if rem < 0:\n                return float("inf")\n            if rem in memo:\n                return memo[rem]\n            memo[rem] = min(best(rem - c) + 1 for c in coins)\n            return memo[rem]\n\n        ans = best(amount)\n        return -1 if ans == float("inf") else int(ans)',
      },
      lastResult: {
        tone: "error",
        title: "Wrong answer on hidden test 4 of 31",
        detail: "Input: coins = [1, 2, 5], amount = 0\nExpected: 0\nYour output: -1",
      },
      lessonMatch: {
        lessonId: "lesson-dp-intro",
        lessonTitle: "From recursion to memoisation",
        atSec: 845,
        excerpt:
          "…the base case is the smallest problem you can answer without recursion. For coin change, an amount of zero needs zero coins, and that's a valid answer, not a failure…",
        similarity: 0.92,
      },
      callFlow: {
        title: "Call flow for coins = [1, 2, 5]",
        root: {
          id: "root",
          label: "coinChange(coins, amount)",
          children: [
            { id: "zero", label: "amount = 0 → guard returns -1", tone: "error", note: "should return 0" },
            {
              id: "b3",
              label: "amount = 3 → best(3)",
              children: [
                {
                  id: "b2",
                  label: "best(2)",
                  note: "coin 1",
                  children: [
                    {
                      id: "b1",
                      label: "best(1)",
                      children: [
                        { id: "b0a", label: "best(0) = 0", tone: "base" },
                        { id: "bn1", label: "best(-1) = ∞", tone: "default", note: "dead end" },
                      ],
                    },
                    { id: "b0b", label: "best(0) = 0", tone: "base" },
                  ],
                },
                { id: "b1m", label: "best(1) = 1", tone: "memo", note: "memo hit" },
                { id: "bn2", label: "best(-2) = ∞", note: "dead end" },
              ],
            },
          ],
        },
      },
      trace: [
        {
          line: 2,
          description: "coinChange is called with amount = 0",
          variables: [
            { name: "coins", value: "[1, 2, 5]" },
            { name: "amount", value: "0" },
          ],
          stack: ["coinChange"],
        },
        {
          line: 3,
          description: "The guard checks amount <= 0, which is true",
          variables: [
            { name: "amount", value: "0" },
            { name: "amount <= 0", value: "True" },
          ],
          stack: ["coinChange"],
        },
        {
          line: 4,
          description: "Returns -1 before the DP helper ever runs",
          variables: [{ name: "return", value: "-1" }],
          stack: ["coinChange"],
        },
        {
          line: 4,
          description: "The judge expected 0, so the test fails",
          variables: [
            { name: "expected", value: "0" },
            { name: "actual", value: "-1" },
          ],
          stack: [],
        },
      ],
    },
  },
  {
    id: "dt-sliding-window",
    title: "When should the window shrink?",
    source: "problem",
    status: "resolved",
    updatedAt: "2026-10-12T21:30:00+05:30",
    hintsGiven: ["nudge", "concept", "approach"],
    messages: [
      {
        id: "m1",
        role: "learner",
        at: "2026-10-12T20:55:00+05:30",
        content: "My solution restarts the scan from the next index whenever I see a repeat. It's correct but times out on hidden test 38.",
      },
      {
        id: "m2",
        role: "assistant",
        hintLevel: "nudge",
        at: "2026-10-12T20:56:00+05:30",
        content: "When you hit a repeated character, which part of your current window is still valid?",
      },
      {
        id: "m3",
        role: "learner",
        at: "2026-10-12T21:04:00+05:30",
        content: "Everything after the earlier copy of that character.",
      },
      {
        id: "m4",
        role: "assistant",
        hintLevel: "concept",
        at: "2026-10-12T21:05:00+05:30",
        content:
          "Right, that's the sliding window idea: never restart, just move the left edge past the earlier copy. To do that in O(1), remember the last index where each character appeared.",
      },
      {
        id: "m5",
        role: "assistant",
        hintLevel: "approach",
        at: "2026-10-12T21:12:00+05:30",
        content:
          "Keep `left` and a map `last`. For each `right`: if `s[right]` was last seen at or after `left`, set `left = last[c] + 1`. Then update `last[c] = right` and the best length `right - left + 1`.",
      },
      {
        id: "m6",
        role: "learner",
        at: "2026-10-12T21:30:00+05:30",
        content: "Accepted, 42/42 hidden tests and it runs in O(n) now. Thanks!",
      },
    ],
    hints: {
      nudge: "When you hit a repeated character, which part of your current window is still valid?",
      concept: "Never restart: move the left edge past the earlier copy, and remember the last index of each character.",
      approach:
        "Keep `left` and a map `last`. For each `right`: if `s[right]` was last seen at or after `left`, set `left = last[c] + 1`. Update `last[c]` and the best length.",
      pseudocode:
        "left = 0; last = {}; best = 0\nfor right, c in enumerate(s):\n  if c in last and last[c] >= left:\n    left = last[c] + 1\n  last[c] = right\n  best = max(best, right - left + 1)",
    },
    context: {
      problem: { id: "longest-substring-without-repeating", title: "Longest substring without repeating characters", difficulty: "medium" },
      code: {
        language: "python",
        snippet:
          "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        best = 0\n        for i in range(len(s)):\n            seen = set()\n            for j in range(i, len(s)):\n                if s[j] in seen:\n                    break\n                seen.add(s[j])\n            best = max(best, len(seen))\n        return best",
      },
      lastResult: {
        tone: "warning",
        title: "Time limit exceeded on hidden test 38",
        detail: "n = 50,000 · stopped at 2,000 ms (limit 2,000 ms)\nRestarting the scan for every start index is O(n²).",
      },
      lessonMatch: {
        lessonId: "lesson-sliding-window",
        lessonTitle: "The sliding window pattern",
        atSec: 580,
        excerpt: "…when the window becomes invalid, don't start over. Move the left edge just far enough to make it valid again, and keep going…",
        similarity: 0.89,
      },
      callFlow: {
        title: 'Window for s = "abcabcbb"',
        root: {
          id: "scan",
          label: "scan right = 0 … 7",
          children: [
            { id: "w1", label: "[abc] best = 3", tone: "base" },
            { id: "w2", label: "a repeats → left 0 → 1", tone: "active", note: "shrink, don't restart" },
            { id: "w3", label: "[bca] best = 3" },
            { id: "w4", label: "b repeats → left 1 → 2", tone: "active" },
            { id: "w5", label: "… b repeats → left 5 → 7", tone: "active" },
            { id: "w6", label: "return 3", tone: "base" },
          ],
        },
      },
      trace: [
        {
          line: 4,
          description: "i = 0: start a fresh window at index 0",
          variables: [
            { name: "i", value: "0" },
            { name: "best", value: "0" },
          ],
          stack: ["lengthOfLongestSubstring"],
        },
        {
          line: 7,
          description: "j = 3: 'a' is already in seen, so the inner loop breaks",
          variables: [
            { name: "j", value: "3" },
            { name: "seen", value: "{'a', 'b', 'c'}" },
          ],
          stack: ["lengthOfLongestSubstring"],
        },
        {
          line: 10,
          description: "best becomes 3, and the scan restarts from i = 1",
          variables: [
            { name: "i", value: "0" },
            { name: "best", value: "3" },
          ],
          stack: ["lengthOfLongestSubstring"],
        },
        {
          line: 6,
          description: "i = 1: 'b', 'c', 'a' are scanned again. This repeated work makes it O(n²)",
          variables: [
            { name: "i", value: "1" },
            { name: "seen", value: "{}" },
          ],
          stack: ["lengthOfLongestSubstring"],
        },
      ],
    },
  },
  {
    id: "dt-lru",
    title: "Why does an LRU cache need a doubly linked list?",
    source: "problem",
    status: "resolved",
    updatedAt: "2026-09-02T19:20:00+05:30",
    hintsGiven: ["concept"],
    messages: [
      {
        id: "m1",
        role: "learner",
        at: "2026-09-02T19:05:00+05:30",
        content: "Could I use a singly linked list with the hash map instead? It feels simpler.",
      },
      {
        id: "m2",
        role: "assistant",
        hintLevel: "concept",
        at: "2026-09-02T19:06:00+05:30",
        content:
          "Think about removing a node you found through the hash map. To unlink it from a singly linked list you need its **previous** node, which means walking the list: O(n). A doubly linked list keeps `prev` on every node, so removal stays O(1).",
      },
      {
        id: "m3",
        role: "learner",
        at: "2026-09-02T19:20:00+05:30",
        content: "Got it, `get` has to move the node to the front, so removal happens on every access.",
      },
    ],
    hints: {
      nudge: "Which operation needs the previous node?",
      concept: "Unlinking from a singly linked list needs the previous node, which costs O(n) to find.",
      approach: "Store nodes in the map; keep head and tail sentinels; move a node to the front on every get and put.",
      pseudocode: "get(k): node = map[k]; unlink(node); push_front(node); return node.val",
    },
    context: {
      problem: { id: "lru-cache", title: "LRU cache", difficulty: "medium" },
      code: {
        language: "java",
        snippet:
          "class LRUCache {\n    private final Map<Integer, Node> map = new HashMap<>();\n    private final Node head = new Node(0, 0), tail = new Node(0, 0);\n    // ...\n}",
      },
    },
  },
  {
    id: "dt-sql-rank",
    title: "RANK vs DENSE_RANK for top three salaries",
    source: "problem",
    status: "resolved",
    updatedAt: "2026-09-15T20:40:00+05:30",
    hintsGiven: ["nudge", "concept"],
    messages: [
      {
        id: "m1",
        role: "learner",
        at: "2026-09-15T20:20:00+05:30",
        content: "My query returns only 5 rows for IT but the expected output has 6. I'm using RANK().",
      },
      {
        id: "m2",
        role: "assistant",
        hintLevel: "nudge",
        at: "2026-09-15T20:21:00+05:30",
        content: "Joe and Randy both earn 85,000. What rank does Will get after them with RANK()?",
      },
      {
        id: "m3",
        role: "assistant",
        hintLevel: "concept",
        at: "2026-09-15T20:30:00+05:30",
        content: "RANK() leaves gaps after ties (1, 2, 2, 4). The problem counts **unique** salaries, so you want a ranking with no gaps.",
      },
    ],
    hints: {
      nudge: "Joe and Randy both earn 85,000. What rank does Will get after them with RANK()?",
      concept: "RANK() leaves gaps after ties (1, 2, 2, 4). The problem counts unique salaries.",
      approach: "Rank salaries per department without gaps, then keep ranks 1 to 3.",
      pseudocode: "rank within department by salary desc, no gaps\nfilter rank <= 3",
    },
    context: {
      problem: { id: "department-top-three-salaries", title: "Department top three salaries", difficulty: "hard" },
      code: {
        language: "sql",
        snippet:
          "SELECT department, employee, salary\nFROM (\n  SELECT d.name AS department, e.name AS employee, e.salary,\n         RANK() OVER (PARTITION BY d.id ORDER BY e.salary DESC) AS r\n  FROM employee e JOIN department d ON d.id = e.department_id\n) t\nWHERE r <= 3;",
      },
      lastResult: { tone: "error", title: "Wrong answer", detail: "Expected 6 rows, got 5. Missing: IT | Will | 70000" },
      lessonMatch: {
        lessonId: "lesson-window-functions",
        lessonTitle: "Ranking and running totals",
        atSec: 760,
        excerpt: "…RANK skips numbers after a tie, DENSE_RANK doesn't. Pick based on whether the question counts rows or distinct values…",
        similarity: 0.94,
      },
    },
  },
];
