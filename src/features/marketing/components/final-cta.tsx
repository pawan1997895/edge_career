import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-6 rounded-xl border bg-card p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Find out where you stand in 90 minutes</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Create a free account, take the placement test and get a personalised starting point in the curriculum.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button size="lg" asChild>
              <Link href={routes.signUp}>Create free account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={routes.pricing}>See plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
