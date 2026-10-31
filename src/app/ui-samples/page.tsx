import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { v2Paths } from "@/features/ui-samples/variant-2/paths";

export const metadata: Metadata = { title: "Design options", robots: { index: false, follow: false } };

const OPTIONS = [
  {
    name: "Option 1",
    title: "Neural AI",
    tag: "Current design",
    description:
      "Blue and violet glass cards over a live neural network, with drifting code, a typing terminal, a code-styled onboarding and optional ambient sound.",
    swatches: ["oklch(0.7 0.17 256)", "oklch(0.82 0.13 205)", "oklch(0.7 0.19 295)"],
    links: [
      { label: "Signup", href: routes.signUp },
      { label: "Onboarding", href: routes.onboarding },
    ],
  },
  {
    name: "Option 2",
    title: "AI developer command center",
    tag: "New sample",
    description:
      "A full-screen HUD with cut-corner panels, a 3D data grid, a terminal sign-up, a different layout for every onboarding step, interface click sounds and an optional ambient bed.",
    swatches: ["oklch(0.87 0.19 158)", "oklch(0.83 0.16 75)", "oklch(0.86 0.09 215)"],
    links: [
      { label: "Signup", href: v2Paths.signup },
      { label: "Onboarding", href: v2Paths.onboarding },
    ],
  },
] as const;

// Client demo hub: opens each sign-up and onboarding design. The real pages are unchanged.
export default function DesignOptionsPage() {
  return (
    <div className="dark min-h-dvh bg-[oklch(0.14_0.012_260)] text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
        <Logo href={routes.home} />
        <h1 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">Sign-up and onboarding design options</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Open each design to compare them. Both work end to end with the same questions and demo sign-up; the client can pick one later.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {OPTIONS.map((option) => (
            <section key={option.name} className="flex flex-col rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{option.name}</p>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{option.tag}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{option.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{option.description}</p>
              <div aria-hidden className="mt-5 flex gap-2">
                {option.swatches.map((color) => (
                  <span key={color} className="h-2 flex-1 rounded-full" style={{ background: color }} />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {option.links.map((link) => (
                  <Button key={link.href} asChild variant="outline">
                    <Link href={link.href}>
                      {link.label} <ArrowUpRight />
                    </Link>
                  </Button>
                ))}
              </div>
              <ul className="mt-3 space-y-0.5 font-mono text-xs text-muted-foreground">
                {option.links.map((link) => (
                  <li key={link.href}>{link.href}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
