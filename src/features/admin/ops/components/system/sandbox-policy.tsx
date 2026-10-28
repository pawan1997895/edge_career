import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SandboxPolicy } from "@/types/admin-ops";

/** The judge runs untrusted code, so its isolation rules are shown in full. */
export function SandboxPolicyCard({ policy }: { policy: SandboxPolicy[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sandbox policy</CardTitle>
        <CardDescription>Applied to every code and SQL run. Changes need a security review.</CardDescription>
      </CardHeader>
      <dl className="divide-y px-5 py-2">
        {policy.map((p) => (
          <div key={p.label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
            <dt className="text-muted-foreground">{p.label}</dt>
            <dd className="text-right font-medium">{p.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
