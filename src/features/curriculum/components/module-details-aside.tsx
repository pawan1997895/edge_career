import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleStatusBadge } from "@/components/shared/status-badges";
import { routes } from "@/lib/routes";
import type { Module } from "@/types/curriculum";

/** Skills covered and prerequisite modules, shown beside the topic list. */
export function ModuleDetailsAside({ mod, prerequisites }: { mod: Module; prerequisites: Module[] }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Skills you&apos;ll build</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {mod.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          {prerequisites.length === 0 ? (
            <p className="text-sm text-muted-foreground">None. This is where the core track starts.</p>
          ) : (
            <ul className="space-y-2">
              {prerequisites.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <Link href={routes.module(p.id)} className="truncate hover:text-primary hover:underline">
                    {p.number ? `Module ${p.number} · ` : ""}
                    {p.title}
                  </Link>
                  <ModuleStatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
