import Link from "next/link";
import { cn } from "@/lib/utils";

/** Edge Career wordmark. The mark is a stylised upward step. */
export function Logo({ href = "/", className, compact = false }: { href?: string; className?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden>
          <path d="M4 18h5v-5h5V8h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && <span className="text-[15px]">Edge Career</span>}
    </Link>
  );
}
