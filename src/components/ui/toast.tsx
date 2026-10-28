"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { CircleCheck, CircleX, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const ToastContext = React.createContext<((toast: Omit<ToastItem, "id" | "variant"> & { variant?: ToastVariant }) => void) | null>(null);

/** Show a short confirmation message, e.g. toast({ title: "Draft saved", variant: "success" }). */
export function useToast() {
  const toast = React.useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>");
  return { toast };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const nextId = React.useRef(0);

  const toast = React.useCallback((item: Omit<ToastItem, "id" | "variant"> & { variant?: ToastVariant }) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, variant: "default", ...item }]);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      <ToastPrimitive.Provider swipeDirection="right" duration={3500}>
        {children}
        {toasts.map((t) => {
          const Icon = t.variant === "success" ? CircleCheck : t.variant === "error" ? CircleX : Info;
          return (
            <ToastPrimitive.Root
              key={t.id}
              onOpenChange={(open) => !open && setToasts((current) => current.filter((x) => x.id !== t.id))}
              className="flex items-start gap-3 rounded-lg border bg-popover p-3 pr-8 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
            >
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  t.variant === "success" && "text-success",
                  t.variant === "error" && "text-destructive",
                  t.variant === "default" && "text-info",
                )}
              />
              <div className="grid gap-0.5">
                <ToastPrimitive.Title className="text-sm font-medium">{t.title}</ToastPrimitive.Title>
                {t.description && (
                  <ToastPrimitive.Description className="text-sm text-muted-foreground">{t.description}</ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close className="absolute top-3 right-3 opacity-60 hover:opacity-100">
                <X className="size-3.5" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
