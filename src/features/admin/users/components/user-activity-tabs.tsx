import Link from "next/link";
import { CodeXml, Mic, ShieldCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { AdminUserDetail } from "@/types/admin-ops";

const KIND_LABEL = { code: "Code", sql: "SQL", design: "Design", exam: "Exam" } as const;
const INTEGRITY_VARIANT = { open: "warning", dismissed: "muted", escalated: "destructive" } as const;
const BILLING_VARIANT = { paid: "success", failed: "destructive", refunded: "muted" } as const;

export function UserActivityTabs({ user }: { user: AdminUserDetail }) {
  return (
    <Card className="pt-2">
      <Tabs defaultValue="submissions" className="gap-0">
        <div className="px-5">
          <TabsList variant="line">
            <TabsTrigger value="submissions">Submissions ({user.submissions.length})</TabsTrigger>
            <TabsTrigger value="interviews">Interviews ({user.interviews.length})</TabsTrigger>
            <TabsTrigger value="billing">Billing ({user.billing.length})</TabsTrigger>
            <TabsTrigger value="integrity">Integrity ({user.integrity.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="submissions" className="py-2">
          {user.submissions.length === 0 ? (
            <Empty icon={CodeXml} title="No submissions yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{KIND_LABEL[s.kind]}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{s.score}%</TableCell>
                    <TableCell className="text-muted-foreground">{s.result}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(s.at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="interviews" className="py-2">
          {user.interviews.length === 0 ? (
            <Empty icon={Mic} title="No mock interviews yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interview</TableHead>
                  <TableHead className="text-right">Minutes</TableHead>
                  <TableHead className="text-right">Overall</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.interviews.map((iv) => (
                  <TableRow key={iv.id}>
                    <TableCell className="font-medium">
                      {iv.type} · <span className="capitalize">{iv.mode}</span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{iv.minutes}</TableCell>
                    <TableCell className="text-right tabular-nums">{iv.score !== undefined ? `${iv.score.toFixed(1)} / 5` : "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(iv.at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="billing" className="py-2">
          {user.billing.length === 0 ? (
            <Empty icon={Wallet} title="No payments" description="This user is on the Free plan." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.billing.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium">{b.description}</div>
                      <code className="text-xs text-muted-foreground">{b.id}</code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{b.method}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatINR(b.amountInr)}</TableCell>
                    <TableCell>
                      <Badge variant={BILLING_VARIANT[b.status]} className="capitalize">
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(b.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="integrity" className="py-2">
          {user.integrity.length === 0 ? (
            <Empty icon={ShieldCheck} title="No integrity flags" description="No similarity matches or unusual exam activity." />
          ) : (
            <ul className="divide-y">
              {user.integrity.map((flag) => (
                <li key={`${flag.id}-${flag.kind}`} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{flag.kind}</p>
                    <p className="text-[13px] text-muted-foreground">{flag.detail}</p>
                  </div>
                  <span className="text-xs whitespace-nowrap text-muted-foreground">{formatDateTime(flag.at)}</span>
                  <Badge variant={INTEGRITY_VARIANT[flag.status]} className="capitalize">
                    {flag.status}
                  </Badge>
                </li>
              ))}
              <li className="px-5 py-3">
                <Link href={routes.admin.integrity} className="text-[13px] text-primary hover:underline">
                  Open the integrity page
                </Link>
              </li>
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function Empty({ icon, title, description }: { icon: typeof CodeXml; title: string; description?: string }) {
  return (
    <div className="px-5 pb-3">
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  );
}
