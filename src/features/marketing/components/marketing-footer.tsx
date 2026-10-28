import Link from "next/link";
import { Logo } from "@/components/shared/brand";
import { routes } from "@/lib/routes";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: `${routes.home}#features` },
      { label: "Curriculum", href: `${routes.home}#curriculum` },
      { label: "Pricing", href: routes.pricing },
      { label: "FAQ", href: `${routes.home}#faq` },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Placement test", href: routes.placementTest },
      { label: "Problem bank", href: routes.practice },
      { label: "System design", href: routes.systemDesign },
      { label: "Mock interviews", href: routes.interviews },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: routes.signIn },
      { label: "Create account", href: routes.signUp },
      { label: "All screens (review)", href: routes.screens },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Structured interview preparation for software engineers, from first data structures to system design.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-medium">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 Edge Career. Made in Bengaluru.</p>
          <p>Terms · Privacy · Refund policy</p>
        </div>
      </div>
    </footer>
  );
}
