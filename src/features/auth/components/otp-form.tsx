"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const LENGTH = 6;
const RESEND_SECONDS = 30;
/** Entering this code shows the "incorrect code" state in the mock. */
const DEMO_WRONG_CODE = "000000";

type Status = "idle" | "verifying" | "error" | "success";

export function OtpForm({ email, intent }: { email: string; intent: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [status, setStatus] = React.useState<Status>("idle");
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const code = digits.join("");
  const next = intent === "sign-in" ? routes.dashboard : routes.onboarding;

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      fillFrom(index, clean);
      return;
    }
    const nextDigits = [...digits];
    nextDigits[index] = clean;
    setDigits(nextDigits);
    if (status === "error") setStatus("idle");
    if (clean && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function fillFrom(index: number, value: string) {
    const nextDigits = [...digits];
    for (let i = 0; i < value.length && index + i < LENGTH; i++) nextDigits[index + i] = value[i]!;
    setDigits(nextDigits);
    if (status === "error") setStatus("idle");
    inputs.current[Math.min(index + value.length, LENGTH - 1)]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < LENGTH) return;
    setStatus("verifying");
    setTimeout(() => {
      if (code === DEMO_WRONG_CODE) {
        setStatus("error");
        setDigits(Array(LENGTH).fill(""));
        inputs.current[0]?.focus();
        return;
      }
      setStatus("success");
      setTimeout(() => router.push(next), 900);
    }, 900);
  }

  function resend() {
    setSecondsLeft(RESEND_SECONDS);
    setStatus("idle");
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <CircleCheck className="size-10 text-success" />
        <p className="mt-3 font-medium">Email verified</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {intent === "sign-in" ? "Taking you to your dashboard…" : "Let’s set up your learning path…"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      <fieldset>
        <legend className="sr-only">Six-digit code</legend>
        <div className="flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={(e) => {
                e.preventDefault();
                fillFrom(i, e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH));
              }}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1}`}
              aria-invalid={status === "error" ? true : undefined}
              autoFocus={i === 0}
              className={cn(
                "h-12 w-full min-w-0 rounded-md border border-input bg-card text-center font-mono text-lg shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
                status === "error" && "border-destructive",
              )}
            />
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          That code is incorrect or has expired. Check the latest email or request a new code.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={code.length < LENGTH || status === "verifying"}>
        {status === "verifying" && <LoaderCircle className="animate-spin" />}
        {status === "verifying" ? "Verifying…" : "Verify and continue"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        {secondsLeft > 0 ? (
          <span className="text-muted-foreground">Resend code in 0:{String(secondsLeft).padStart(2, "0")}</span>
        ) : (
          <button type="button" onClick={resend} className="font-medium text-primary hover:underline">
            Resend code
          </button>
        )}
        <Link href={intent === "sign-in" ? routes.signIn : routes.signUp} className="text-muted-foreground hover:text-foreground">
          Use a different email
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">
        Demo: any six digits work. Enter <span className="font-mono">{DEMO_WRONG_CODE}</span> to see the error state.
      </p>
      <span className="sr-only" aria-live="polite">
        {email}
      </span>
    </form>
  );
}
