import { LoaderCircle, Lock } from "lucide-react";

/** Shown while the (simulated) sandbox compiles and runs the code. */
export function JudgeProgress({ mode, testCount }: { mode: "run" | "submit"; testCount: number }) {
  const steps =
    mode === "run"
      ? ["Compiling in an isolated sandbox", `Running ${testCount} sample ${testCount === 1 ? "test" : "tests"}`]
      : ["Compiling in an isolated sandbox", `Running ${testCount} tests (2 s / 256 MB each)`, "Timing on growing inputs", "AI review of your code"];
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <LoaderCircle className="size-6 animate-spin text-primary" />
      <div>
        <p className="text-sm font-medium">{mode === "run" ? "Running your code…" : "Running in sandbox…"}</p>
        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lock className="size-3" /> No network access, read-only file system
        </p>
      </div>
      <ol className="space-y-1 text-left text-[13px] text-muted-foreground">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="flex size-4 items-center justify-center rounded-full border text-[10px]">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
