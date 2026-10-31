"use client";

import * as React from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { commandSound } from "../sound";
import { CommandButton, Kicker } from "../ui";
import styles from "../command.module.css";

// Same behaviour as the real verify step (src/features/auth/components/otp-form.tsx):
// any six digits work; 000000 shows the "incorrect code" state.
const LENGTH = 6;
const RESEND_SECONDS = 30;
const DEMO_WRONG_CODE = "000000";

type Status = "idle" | "verifying" | "error";

/** Email code step shown inside the sign-up terminal. */
export function OtpStage({ email, onVerified, onBack }: { email: string; onVerified: () => void; onBack: () => void }) {
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
      commandSound.play("select");
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
        commandSound.play("error");
        setStatus("error");
        setDigits(Array(LENGTH).fill(""));
        inputs.current[0]?.focus();
        return;
      }
      onVerified();
    }, 900);
  }

  function resend() {
    commandSound.play("toggle");
    setSecondsLeft(RESEND_SECONDS);
    setStatus("idle");
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      <div>
        <Kicker>&gt; auth.verify --otp</Kicker>
        <h1 className={cn(styles.display, "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl")}>Check your email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We sent a six-digit code to <span className="font-mono text-foreground">{email}</span>.
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">Six-digit code</legend>
        <div className="grid grid-cols-6 gap-2">
          {digits.map((digit, i) => (
            <div
              key={i}
              className={cn(
                styles.chamfer,
                "p-px transition-colors duration-200 [--v2-cut:8px]",
                status === "error" ? "bg-destructive/70" : digit ? "bg-(--v2-mint)/70" : "bg-(--v2-line) focus-within:bg-(--v2-mint)/70",
              )}
            >
              <input
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
                  styles.chamfer,
                  styles.display,
                  "h-14 w-full min-w-0 bg-(--v2-bg) text-center text-2xl font-semibold text-(--v2-mint) caret-(--v2-mint) outline-none [--v2-cut:8px]",
                )}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <p role="alert" className="font-mono text-xs text-destructive">
          <span className="font-semibold">✗ ERR</span> That code is incorrect or has expired. Check the latest email or request a new code.
        </p>
      )}

      <CommandButton type="submit" disabled={code.length < LENGTH || status === "verifying"} className="w-full">
        {status === "verifying" && <LoaderCircle className="animate-spin" />}
        {status === "verifying" ? "Verifying…" : "Verify and continue"}
      </CommandButton>

      <div className="flex items-center justify-between font-mono text-xs">
        {secondsLeft > 0 ? (
          <span className="text-muted-foreground">Resend code in 0:{String(secondsLeft).padStart(2, "0")}</span>
        ) : (
          <button type="button" onClick={resend} className="text-(--v2-mint) hover:underline">
            Resend code
          </button>
        )}
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Use a different email
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Demo: any six digits work. Enter <span className="font-mono">{DEMO_WRONG_CODE}</span> to see the error state.
      </p>
    </form>
  );
}
