import { ClipboardPaste, Eye, Fingerprint, Shuffle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const POLICIES = [
  { icon: Shuffle, title: "Randomized question pools", detail: "Every attempt draws a fresh set, so retakes never repeat the same paper." },
  { icon: ClipboardPaste, title: "Paste logging", detail: "Pasting into an answer is recorded with the time and the answer it went into." },
  { icon: Eye, title: "Tab-switch logging", detail: "Leaving the exam tab or window is recorded. It is never auto-failed; a reviewer looks at the context." },
  { icon: Fingerprint, title: "Code similarity checks", detail: "Code answers are compared with other submissions and known sources after you submit." },
];

export function IntegrityPolicyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam integrity</CardTitle>
        <CardDescription>How checkpoint exams stay fair for everyone.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3.5">
          {POLICIES.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-[13px] text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
