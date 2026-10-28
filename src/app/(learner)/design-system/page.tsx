import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { CodeShowcase } from "@/features/design-system/components/code-showcase";
import { ButtonsAndBadges, CardsAndData, FormControls } from "@/features/design-system/components/component-showcase";
import { Foundations } from "@/features/design-system/components/foundations";
import { OverlayShowcase } from "@/features/design-system/components/overlay-showcase";
import { StatesGallery } from "@/features/design-system/components/states-gallery";

export const metadata: Metadata = { title: "Design system" };

const SECTIONS = [
  { id: "colors", label: "Colours" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "badges", label: "Badges" },
  { id: "forms", label: "Forms" },
  { id: "cards", label: "Cards" },
  { id: "tabs", label: "Tabs" },
  { id: "tables", label: "Tables" },
  { id: "scores", label: "Scores" },
  { id: "overlays", label: "Overlays" },
  { id: "states", label: "States" },
  { id: "code", label: "Code" },
];

// Living style guide: the tokens and shared components every screen is built from.
export default function DesignSystemPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Design system"
        description="Tokens, components and UI states shared by every screen. Toggle the theme in the top bar to check dark mode."
      />
      <nav aria-label="Sections" className="mb-8 flex flex-wrap gap-1.5">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-md border bg-card px-2.5 py-1 text-[13px] hover:bg-accent">
            {s.label}
          </a>
        ))}
      </nav>
      <div className="space-y-12">
        <Foundations />
        <ButtonsAndBadges />
        <FormControls />
        <CardsAndData />
        <OverlayShowcase />
        <StatesGallery />
        <CodeShowcase />
      </div>
    </PageContainer>
  );
}
