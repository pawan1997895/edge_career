import { DsSection, Specimen } from "@/features/design-system/components/ds-section";

const COLOR_GROUPS = [
  {
    label: "Surfaces and text",
    tokens: ["background", "foreground", "card", "muted", "muted-foreground", "accent", "border", "input"],
  },
  { label: "Brand and actions", tokens: ["primary", "primary-foreground", "secondary", "ring"] },
  { label: "Status", tokens: ["success", "warning", "destructive", "info"] },
  { label: "Charts", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
];

const TYPE_SCALE = [
  { name: "Page title", className: "text-2xl font-semibold tracking-tight", sample: "System Design (LLD + HLD)" },
  { name: "Section heading", className: "text-base font-semibold", sample: "Recommended for you" },
  { name: "Card title", className: "text-[15px] font-semibold", sample: "Module 4 checkpoint" },
  { name: "Body", className: "text-sm", sample: "Score 85% or more on the checkpoint to unlock the next module." },
  { name: "Muted body", className: "text-sm text-muted-foreground", sample: "Retakes draw a fresh, randomised question set." },
  { name: "Caption", className: "text-xs text-muted-foreground", sample: "Updated 3h ago" },
  { name: "Code", className: "font-mono text-[13px]", sample: "def lengthOfLongestSubstring(self, s: str) -> int:" },
];

export function Foundations() {
  return (
    <>
      <DsSection
        id="colors"
        title="Colour tokens"
        description="Every colour is a CSS variable in globals.css with light and dark values. Use the Tailwind names (bg-card, text-success, bg-primary/10)."
      >
        {COLOR_GROUPS.map((group) => (
          <Specimen key={group.label} label={group.label} className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {group.tokens.map((token) => (
              <div key={token} className="min-w-0">
                <div className="h-12 rounded-md border" style={{ background: `var(--${token})` }} />
                <p className="mt-1.5 truncate font-mono text-[11px] text-muted-foreground">{token}</p>
              </div>
            ))}
          </Specimen>
        ))}
      </DsSection>

      <DsSection id="typography" title="Typography" description="Inter for UI text, JetBrains Mono for code. App body text is 14px.">
        <div className="divide-y rounded-lg border bg-card">
          {TYPE_SCALE.map((t) => (
            <div key={t.name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-36 shrink-0 text-xs text-muted-foreground">{t.name}</span>
              <span className={`min-w-0 break-words ${t.className}`}>{t.sample}</span>
            </div>
          ))}
        </div>
      </DsSection>
    </>
  );
}
