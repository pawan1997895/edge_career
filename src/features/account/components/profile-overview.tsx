import Link from "next/link";
import { ArrowRight, Building, Calendar, Flame, MapPin, Mic } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConnectedAccounts } from "@/features/account/components/connected-accounts";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ConnectedAccount, ProfileStats } from "@/types/account";
import type { Module } from "@/types/curriculum";
import { LEVEL_LABELS, PERSONA_LABELS, PLAN_LABELS, SALARY_LABELS, type User } from "@/types/user";

export function ProfileOverview({
  user,
  stats,
  accounts,
  activeModule,
  renewsAt,
}: {
  user: User;
  stats: ProfileStats;
  accounts: ConnectedAccount[];
  activeModule: Module;
  renewsAt: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar name={user.name} src={user.avatarUrl} className="size-16 text-lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <Badge variant="secondary">{LEVEL_LABELS[user.level]}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{PERSONA_LABELS[user.persona]}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {user.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Joined {formatDate(user.joinedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="size-3.5 text-warning" /> {user.streakDays}-day streak
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Core modules done" value={`${stats.modulesCompleted} / ${stats.modulesTotal}`} hint="1 by placement test" />
          <StatCard label="Problems solved" value={stats.problemsSolved} hint="across 6 languages" />
          <StatCard label="Mock interviews" value={stats.mockInterviews} hint="last on 26 Oct" />
          <StatCard label="Hours this month" value={stats.hoursThisMonth} trend={{ value: "+6h", positive: true }} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Targets</CardTitle>
            <CardDescription>Used for readiness estimates and problem recommendations.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href={routes.readiness}>
                  View readiness <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Companies</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {user.targetCompanies.map((c) => (
                  <Badge key={c} variant="outline">
                    <Building /> {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Salary band</p>
              <p className="mt-2 text-sm font-medium">{SALARY_LABELS[user.targetSalary]}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current focus</CardTitle>
            <CardDescription>
              Module {activeModule.number} · {activeModule.title}
            </CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href={routes.module(activeModule.id)}>
                  Open module <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Required items</span>
              <span className="font-medium tabular-nums">{activeModule.progress}%</span>
            </div>
            <Progress value={activeModule.progress} className="mt-2" />
            <div className="mt-4 flex flex-wrap gap-1.5">
              {activeModule.skills.map((s) => (
                <Badge key={s} variant="muted">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected accounts</CardTitle>
            <CardDescription>Ways to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectedAccounts accounts={accounts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{PLAN_LABELS[user.plan]} plan</CardTitle>
            <CardDescription>Renews {formatDate(renewsAt)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Mic className="size-4" /> Interview minutes
              </span>
              <span className="font-medium tabular-nums">
                {user.interviewMinutesLeft} / {user.interviewMinutesTotal} left
              </span>
            </div>
            <Progress value={(user.interviewMinutesLeft / user.interviewMinutesTotal) * 100} />
            <Button variant="outline" className="w-full" asChild>
              <Link href={routes.billing}>Manage billing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
