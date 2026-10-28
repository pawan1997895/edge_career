"use client";

import * as React from "react";
import { CreditCard, Plus, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { PaymentMethod } from "@/types/billing";

export function PaymentMethodsCard({ methods }: { methods: PaymentMethod[] }) {
  const { toast } = useToast();
  const [list, setList] = React.useState(methods);

  function makeDefault(id: string) {
    setList((current) => current.map((m) => ({ ...m, isDefault: m.id === id })));
    toast({ title: "Default payment method updated", variant: "success" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment methods</CardTitle>
        <CardDescription>Stored securely by Razorpay. Edge Career never sees full card numbers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-md border p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {m.kind === "upi" ? <Smartphone className="size-4" /> : <CreditCard className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium">
                {m.label} {m.isDefault && <Badge variant="secondary">Default</Badge>}
              </p>
              <p className="truncate text-[13px] text-muted-foreground">{m.detail}</p>
            </div>
            {!m.isDefault && (
              <Button variant="ghost" size="sm" onClick={() => makeDefault(m.id)}>
                Make default
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast({ title: "Razorpay would open here", description: "Adding a method is simulated in this preview." })}
        >
          <Plus /> Add payment method
        </Button>
      </CardContent>
    </Card>
  );
}
