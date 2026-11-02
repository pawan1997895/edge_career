import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { v2Paths } from "@/features/ui-samples/variant-2/paths";
import { v3Paths } from "@/features/ui-samples/variant-3/paths";
import { v4Paths } from "@/features/ui-samples/variant-4/paths";

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
    tag: "Sample",
    description:
      "A full-screen HUD with cut-corner panels, a 3D data grid, a terminal sign-up, a different layout for every onboarding step, interface click sounds and an optional ambient bed.",
    swatches: ["oklch(0.87 0.19 158)", "oklch(0.83 0.16 75)", "oklch(0.86 0.09 215)"],
    links: [
      { label: "Signup", href: v2Paths.signup },
      { label: "Onboarding", href: v2Paths.onboarding },
    ],
  },
  {
    name: "Option 3",
    title: "Minimal AI tech experience",
    tag: "Sample",
    description:
      "A calm, centred design: one clean card, a small glowing AI orb, softly floating code symbols and thin light lines, simple onboarding cards and gentle optional sound.",
    swatches: ["oklch(0.68 0.16 258)", "oklch(0.66 0.2 295)", "oklch(0.82 0.11 210)"],
    links: [
      { label: "Signup", href: v3Paths.signup },
      { label: "Onboarding", href: v3Paths.onboarding },
    ],
  },
  {
    name: "Option 4",
    title: "Creative AI coding studio (light)",
    tag: "New sample",
    description:
      "A fresh light theme: white cards on soft lavender, an animated code editor, a friendly AI mentor, floating code words, icon onboarding cards and Option 2-style sound.",
    swatches: ["oklch(0.52 0.24 280)", "oklch(0.58 0.25 302)", "oklch(0.72 0.14 222)"],
    links: [
      { label: "Signup", href: v4Paths.signup },
      { label: "Onboarding", href: v4Paths.onboarding },
    ],
  },
] as const;

// Client demo hub: opens each sign-up and onboarding design. The real pages are unchanged.
export default function DesignOptionsPage() {
  return (
    <div className="dark min-h-dvh bg-[oklch(0.14_0.012_260)] text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16">
        <Logo href={routes.home} />
        <h1 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">Sign-up and onboarding design options</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Open each design to compare them. Each works end to end with the same questions and demo sign-up; the client can pick one later.
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
