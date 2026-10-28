"use client";

import { CodeXml, Download, ExternalLink, FileText, Presentation, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { Lesson } from "@/types/curriculum";

const KIND_ICON: Record<Lesson["resources"][number]["kind"], LucideIcon> = {
  notes: FileText,
  slides: Presentation,
  code: CodeXml,
  link: ExternalLink,
};

export function LessonResources({ resources }: { resources: Lesson["resources"] }) {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y">
          {resources.map((r) => {
            const Icon = KIND_ICON[r.kind];
            return (
              <li key={r.title} className="flex items-center gap-3 py-2.5">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm">{r.title}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={r.kind === "link" ? `Open ${r.title}` : `Download ${r.title}`}
                  onClick={() =>
                    toast({ title: "Not connected yet", description: "Files are served from the CDN once the content pipeline is live." })
                  }
                >
                  {r.kind === "link" ? <ExternalLink /> : <Download />}
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
