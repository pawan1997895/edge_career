"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { routes } from "@/lib/routes";

const NAV_LINKS = [
  { label: "Features", href: `${routes.home}#features` },
  { label: "Curriculum", href: `${routes.home}#curriculum` },
  { label: "Pricing", href: routes.pricing },
  { label: "FAQ", href: `${routes.home}#faq` },
];

export function MarketingHeader() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href={routes.signIn}>Sign in</Link>
          </Button>
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href={routes.signUp}>Get started</Link>
          </Button>
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetTitle className="border-b px-4 py-4">Menu</SheetTitle>
          <nav className="flex flex-col px-2" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-2 border-t p-4">
            <Button variant="outline" asChild>
              <Link href={routes.signIn}>Sign in</Link>
            </Button>
            <Button asChild>
              <Link href={routes.signUp}>Get started</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
