"use client";

import * as React from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { studioSound } from "../sound";
import { GradientButton } from "../ui";

// Same behaviour as the real verify step (src/features/auth/components/otp-form.tsx):
// any six digits work; 000000 shows the "incorrect code" state.
const LENGTH = 6;
const RESEND_SECONDS = 30;
const DEMO_WRONG_CODE = "000000";

type Status = "idle" | "verifying" | "error";

/** Email code step shown inside the sign-up card. */
export function CodeStep({ email, onVerified, onBack }: { email: string; onVerified: () => void; onBack: () => void }) {
  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [status, setStatus] = React.useState<Status>("idle");
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join("");

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  function fillFrom(index: number, value: string) {
    const next = [...digits];
    for (let i = 0; i < value.length && index + i < LENGTH; i++) next[index + i] = value[i]!;
    setDigits(next);
    if (status === "error") setStatus("idle");
    inputs.current[Math.min(index + value.length, LENGTH - 1)]?.focus();
  }

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      fillFrom(index, clean);
      return;
    }
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (status === "error") setStatus("idle");
    if (clean) {
      studioSound.play("select");
      if (index < LENGTH - 1) inputs.current[index + 1]?.focus();
    }
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
        studioSound.play("error");
        setStatus("error");
        setDigits(Array(LENGTH).fill(""));
        inputs.current[0]?.focus();
        return;
      }
      onVerified();
    }, 900);
  }

  function resend() {
    studioSound.play("toggle");
    setSecondsLeft(RESEND_SECONDS);
    setStatus("idle");
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight">Check your email</h1>
        <p className="mt-1.5 text-sm text-(--v4-muted)">
          We sent a six-digit code to <span className="font-semibold text-(--v4-ink)">{email}</span>.
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">Six-digit code</legend>
        <div className="grid grid-cols-6 gap-2">
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
                "h-14 w-full min-w-0 rounded-2xl border bg-[oklch(0.985_0.006_290)] text-center text-xl font-bold text-(--v4-ink) outline-none transition-[border-color,box-shadow,background-color] duration-200",
                status === "error"
                  ? "border-destructive/70"
                  : digit
                    ? "border-(--v4-indigo)/60 bg-white"
                    : "border-(--v4-line) focus:border-(--v4-indigo) focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--v4-indigo)_15%,transparent)]",
              )}
            />
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-destructive">
          That code is incorrect or has expired. Check the latest email or request a new code.
        </p>
      )}

      <GradientButton type="submit" disabled={code.length < LENGTH || status === "verifying"} className="w-full">
        {status === "verifying" && <LoaderCircle className="animate-spin" />}
        {status === "verifying" ? "Verifying…" : "Verify and continue"}
      </GradientButton>

      <div className="flex items-center justify-between text-sm">
        {secondsLeft > 0 ? (
          <span className="text-(--v4-muted)">Resend code in 0:{String(secondsLeft).padStart(2, "0")}</span>
        ) : (
          <button type="button" onClick={resend} className="font-semibold text-(--v4-indigo) hover:underline">
            Resend code
          </button>
        )}
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 font-medium text-(--v4-muted) hover:text-(--v4-ink)">
          <ArrowLeft className="size-3.5" /> Use a different email
        </button>
      </div>
      <p className="text-xs text-(--v4-muted)">
        Demo: any six digits work. Enter <span className="font-mono">{DEMO_WRONG_CODE}</span> to see the error state.
      </p>
    </form>
  );
}
