import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/shared/rich-text";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { InjectionAttempt } from "@/types/admin-ops";

/** Learner code is untrusted input: instructions inside it must never change a score. */
export function InjectionAttempts({ attempts, monthCount }: { attempts: InjectionAttempt[]; monthCount: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manipulation defence</CardTitle>
        <CardDescription>
          Instructions hidden in learner code or write-ups. Tests carry most of the weight and every AI score is validated, so none of these
          changed a grade.
        </CardDescription>
        <CardAction>
          <Badge variant="success">
            <ShieldCheck /> {monthCount} blocked this month
          </Badge>
        </CardAction>
      </CardHeader>
      <ul className="divide-y">
        {attempts.map((a) => (
          <li key={a.id} className="grid grid-cols-[minmax(0,1fr)] gap-2 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <Link href={routes.admin.user(a.learner.id)} className="font-medium hover:underline">
                  {a.learner.name}
                </Link>
                <span className="text-muted-foreground">· {a.problem}</span>
                <span className="text-xs text-muted-foreground">{formatRelative(a.detectedAt)}</span>
              </div>
              <CodeBlock code={a.snippet} className="mt-2 text-xs whitespace-pre-wrap" />
            </div>
            <div className="text-[13px]">
              <p>
                <span className="text-muted-foreground">Action: </span>
                {a.action}
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">Score impact: </span>
                <span className="font-medium">{a.scoreImpact}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
