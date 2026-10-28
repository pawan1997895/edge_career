"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { DesignSections } from "@/types/system-design";

const SECTIONS: { key: keyof DesignSections; title: string; hint: string; mono?: boolean }[] = [
  { key: "requirements", title: "Requirements", hint: "Functional and non-functional requirements, and what's out of scope." },
  { key: "estimates", title: "Size estimates", hint: "Traffic, storage and bandwidth, with the maths." },
  { key: "apis", title: "APIs", hint: "Endpoints with request and response shapes.", mono: true },
  { key: "dataModel", title: "Data model", hint: "Tables or documents, keys and indexes.", mono: true },
  { key: "tradeoffs", title: "Trade-offs", hint: "Decisions you made, the alternatives and why." },
];

/** The written half of an HLD answer. Reviewed together with the diagram. */
export function HldWriteup({ sections, onChange }: { sections: DesignSections; onChange: (key: keyof DesignSections, value: string) => void }) {
  return (
    <div className="space-y-5">
      {SECTIONS.map(({ key, title, hint, mono }) => {
        const empty = sections[key].trim().length === 0;
        return (
          <div key={key}>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`section-${key}`}>{title}</Label>
              {empty ? <Badge variant="muted">Empty</Badge> : <span className="text-xs text-muted-foreground tabular-nums">{sections[key].trim().split(/\s+/).length} words</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            <Textarea
              id={`section-${key}`}
              value={sections[key]}
              onChange={(e) => onChange(key, e.target.value)}
              rows={key === "requirements" || key === "apis" ? 9 : 6}
              placeholder={hint}
              className={cn("mt-2 resize-y leading-relaxed", mono && "font-mono text-[12.5px]")}
            />
          </div>
        );
      })}
    </div>
  );
}
