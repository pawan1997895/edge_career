"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

export function BillingDetailsCard() {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing details</CardTitle>
        <CardDescription>Shown on your GST invoices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="billing-name">Name on invoice</Label>
          <Input id="billing-name" defaultValue="Aarav Mehta" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="billing-state">State</Label>
          <Input id="billing-state" defaultValue="Karnataka" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="billing-gstin">GSTIN (optional)</Label>
          <Input id="billing-gstin" placeholder="29ABCDE1234F1Z5" />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={() => toast({ title: "Billing details saved", variant: "success" })}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
