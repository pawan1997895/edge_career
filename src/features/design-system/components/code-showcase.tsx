import { CodeEditor } from "@/components/shared/code-editor";
import { CodeBlock, RichText } from "@/components/shared/rich-text";
import { Card } from "@/components/ui/card";
import { DsSection, Specimen } from "@/features/design-system/components/ds-section";

const SAMPLE = `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []
`;

export function CodeShowcase() {
  return (
    <DsSection id="code" title="Code and rich text" description="Monaco for editing, CodeBlock for read-only snippets, RichText for statements and hints.">
      <Card className="h-56 overflow-hidden p-0">
        <CodeEditor value={SAMPLE} language="python" readOnly />
      </Card>
      <Specimen label="CodeBlock" className="block">
        <CodeBlock code={"SELECT d.name, e.name, e.salary\nFROM employee e JOIN department d ON d.id = e.department_id;"} />
      </Specimen>
      <Specimen label="RichText" className="block text-sm">
        <RichText text={"Given a string `s`, return the length of the **longest** substring without repeating characters."} />
      </Specimen>
    </DsSection>
  );
}
