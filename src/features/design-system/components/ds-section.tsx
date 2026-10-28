import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** One section of the style guide. */
export function DsSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

/** A labelled specimen panel inside a section. */
export function Specimen({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className="gap-3 p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>
    </Card>
  );
}
