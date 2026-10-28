"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { CompaniesStep } from "@/features/onboarding/components/onboarding-steps";
import { LEVEL_LABELS, PERSONA_LABELS, SALARY_LABELS, type Level, type Persona, type SalaryBand, type User } from "@/types/user";

export function EditProfileDialog({ user, companyOptions }: { user: User; companyOptions: string[] }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: user.name,
    location: user.location,
    persona: user.persona,
    level: user.level,
    companies: user.targetCompanies,
    salary: user.targetSalary,
  });

  function save(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    toast({ title: "Profile updated", description: "Readiness targets will refresh shortly.", variant: "success" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil /> Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Your level and targets set the readiness bars and practice recommendations.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full name</Label>
              <Input id="profile-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-location">Location</Label>
              <Input id="profile-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>About you</Label>
              <Select value={form.persona} onValueChange={(v) => setForm({ ...form, persona: v as Persona })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PERSONA_LABELS) as Persona[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {PERSONA_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Current level</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as Level })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
                    <SelectItem key={l} value={l}>
                      {LEVEL_LABELS[l]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Target salary</Label>
              <Select value={form.salary} onValueChange={(v) => setForm({ ...form, salary: v as SalaryBand })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SALARY_LABELS) as SalaryBand[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {SALARY_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Target companies</Label>
            <CompaniesStep options={companyOptions} value={form.companies} onChange={(companies) => setForm({ ...form, companies })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim() || form.companies.length === 0}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
