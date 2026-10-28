import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { ProductPreview } from "@/features/marketing/components/product-preview";

const LANGUAGES = ["Python", "Java", "C++", "JavaScript", "Go", "SQL"];

export function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Badge variant="secondary">For software engineers preparing for product companies</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
            Prepare for engineering interviews with a plan, not a pile of problems
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Expert lessons, a code judge with AI feedback, a system design canvas and a voice mock interviewer, in one
            structured path. Skip what you already know and see how ready you are for your target company.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={routes.signUp}>
                Start free <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={routes.placementTest}>Take the placement test</Link>
            </Button>
          </div>
          <div className="mt-8">
            <p className="text-xs text-muted-foreground">Practise in</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {LANGUAGES.map((language) => (
                <Badge key={language} variant="outline" className="font-mono">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}
