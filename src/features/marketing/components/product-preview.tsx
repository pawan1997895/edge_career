import { CircleCheck, Lightbulb, Play, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SOLUTION = `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_seen = {}
        left = best = 0
        for right, ch in enumerate(s):
            if last_seen.get(ch, -1) >= left:
                left = last_seen[ch] + 1
            last_seen[ch] = right
            best = max(best, right - left + 1)
        return best`;

/** Static mock of the coding workspace, built from real components for the landing hero. */
export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm" aria-label="Preview of the coding workspace">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="truncate text-[13px] font-medium">Longest substring without repeating characters</span>
        <span className="text-xs font-medium text-warning-foreground dark:text-warning">Medium</span>
        <div className="ml-auto hidden items-center gap-1.5 sm:flex">
          <span className="inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs">
            <Play className="size-3" /> Run
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-xs text-primary-foreground">
            <Send className="size-3" /> Submit
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3 border-b p-4 text-[13px] md:border-r md:border-b-0">
          <p>
            Given a string <code className="rounded bg-muted px-1 font-mono text-xs">s</code>, return the length of the longest
            substring with no repeated characters.
          </p>
          <div className="rounded-md bg-muted/60 p-3 font-mono text-xs leading-relaxed">
            <p>Input: s = &quot;abcabcbb&quot;</p>
            <p>Output: 3</p>
          </div>
          <div className="rounded-md border border-info/30 bg-info/8 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-info">
              <Lightbulb className="size-3.5" /> Hint 1 of 4 · Nudge
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              When you meet a repeated character, does the window need to restart from scratch?
            </p>
          </div>
        </div>

        <pre className="overflow-x-auto bg-muted/30 p-4 font-mono text-[11.5px] leading-relaxed">
          <code>{SOLUTION}</code>
        </pre>
      </div>

      <div className="grid gap-3 border-t p-4 text-xs sm:grid-cols-3">
        <div className="space-y-1.5">
          <Badge variant="success">
            <CircleCheck /> Accepted
          </Badge>
          <p className="text-muted-foreground">42 / 42 hidden tests · 38 ms · 14 MB</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium">Score 88 / 100</p>
          <p className="text-muted-foreground">70% hidden tests + 30% AI rubric</p>
          <p className="text-muted-foreground">Estimated O(n) time, O(k) space</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium">Areas of improvement</p>
          <p className="text-muted-foreground">Edge case: empty string handled</p>
          <p className="text-muted-foreground">Readability: comment the window invariant</p>
        </div>
      </div>
    </div>
  );
}
