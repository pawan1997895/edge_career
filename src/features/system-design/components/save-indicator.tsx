import { Check, LoaderCircle } from "lucide-react";

/** "Saving…" / "Saved" status for workspaces that autosave their contents. */
export function SaveIndicator({ saving }: { saving: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
      {saving ? (
        <>
          <LoaderCircle className="size-3.5 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="size-3.5 text-success" /> All changes saved
        </>
      )}
    </span>
  );
}
