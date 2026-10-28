"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { AccountStatusBadge, RoleBadge, UserFlags } from "@/features/admin/users/components/user-badges";
import { formatRelative } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { AdminUserRow } from "@/types/admin-ops";
import { PLAN_LABELS } from "@/types/user";

const PAGE_SIZE = 8;

interface Filters {
  query: string;
  plan: string;
  role: string;
  status: string;
  moduleId: string;
}

const EMPTY_FILTERS: Filters = { query: "", plan: "all", role: "all", status: "all", moduleId: "all" };

export function UsersTable({ users, modules }: { users: AdminUserRow[]; modules: { id: string; label: string }[] }) {
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = React.useState(0);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(0);
  }

  const filtered = users.filter((u) => {
    const q = filters.query.trim().toLowerCase();
    if (q && !`${u.name} ${u.email} ${u.city}`.toLowerCase().includes(q)) return false;
    if (filters.plan !== "all" && u.plan !== filters.plan) return false;
    if (filters.role !== "all" && u.role !== filters.role) return false;
    if (filters.status !== "all" && u.status !== filters.status) return false;
    if (filters.moduleId === "staff" && u.currentModuleId !== "") return false;
    if (filters.moduleId !== "all" && filters.moduleId !== "staff" && u.currentModuleId !== filters.moduleId) return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  return (
    <Card>
      <div className="flex flex-col gap-2 border-b p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder="Search name, email or city"
            className="pl-8"
            aria-label="Search users"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <FilterSelect
            label="Plan"
            value={filters.plan}
            onChange={(v) => update("plan", v)}
            options={[
              { value: "all", label: "All plans" },
              { value: "free", label: PLAN_LABELS.free },
              { value: "pro", label: PLAN_LABELS.pro },
              { value: "pro_plus", label: PLAN_LABELS.pro_plus },
            ]}
          />
          <FilterSelect
            label="Role"
            value={filters.role}
            onChange={(v) => update("role", v)}
            options={[
              { value: "all", label: "All roles" },
              { value: "learner", label: "Learners" },
              { value: "reviewer", label: "Reviewers" },
              { value: "admin", label: "Admins" },
            ]}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => update("status", v)}
            options={[
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "invited", label: "Invited" },
              { value: "suspended", label: "Suspended" },
            ]}
          />
          <FilterSelect
            label="Current module"
            value={filters.moduleId}
            onChange={(v) => update("moduleId", v)}
            options={[{ value: "all", label: "All modules" }, ...modules.map((m) => ({ value: m.id, label: m.label })), { value: "staff", label: "Staff" }]}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Users}
            title="No users match these filters"
            description="Try a different plan, role or module, or clear the search."
            action={
              <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Current module</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Interview minutes</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id} className="relative">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} />
                      <div className="min-w-0">
                        <Link href={routes.admin.user(u.id)} className="font-medium after:absolute after:inset-0 hover:underline">
                          {u.name}
                        </Link>
                        <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge variant={u.plan === "free" ? "muted" : "default"}>{PLAN_LABELS[u.plan]}</Badge>
                      {u.role !== "learner" && <RoleBadge role={u.role} />}
                      {u.status !== "active" && <AccountStatusBadge status={u.status} />}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{u.currentModule}</TableCell>
                  <TableCell>
                    {u.currentModuleId ? (
                      <div className="flex items-center gap-2">
                        <Progress value={u.progress} className="w-16" aria-label={`${u.name} module progress`} />
                        <span className="tabular-nums text-muted-foreground">{u.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {u.minutesCap > 0 ? (
                      <span className={u.minutesUsed >= u.minutesCap ? "font-medium text-destructive" : ""}>
                        {u.minutesUsed} <span className="text-muted-foreground">/ {u.minutesCap}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatRelative(u.lastActive)}</TableCell>
                  <TableCell className="relative z-10">
                    <UserFlags flags={u.flags} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between gap-3 border-t px-5 py-3 text-[13px] text-muted-foreground">
            <span>
              Showing {current * PAGE_SIZE + 1}–{Math.min(filtered.length, (current + 1) * PAGE_SIZE)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" disabled={current === 0} onClick={() => setPage(current - 1)} aria-label="Previous page">
                <ChevronLeft />
              </Button>
              {Array.from({ length: pageCount }, (_, i) => (
                <Button
                  key={i}
                  variant={i === current ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setPage(i)}
                  aria-current={i === current ? "page" : undefined}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon-sm"
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
                aria-label="Next page"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-36" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
