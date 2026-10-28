import { routes } from "@/lib/routes";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  at: string;
  href: string;
  unread: boolean;
  kind: "grade" | "review" | "unlock" | "interview" | "billing";
}

export const notifications: AppNotification[] = [
  {
    id: "n1",
    title: "Design review ready",
    body: "Your news feed design was sent to a human reviewer because the AI grader was unsure.",
    at: "2026-10-27T16:05:00+05:30",
    href: routes.hld("hld-news-feed"),
    unread: true,
    kind: "review",
  },
  {
    id: "n2",
    title: "Module 4 checkpoint is ready",
    body: "All required items are passed. Score 85% or more to unlock Production Engineering.",
    at: "2026-10-27T11:20:00+05:30",
    href: routes.exam("exam-system-design"),
    unread: true,
    kind: "unlock",
  },
  {
    id: "n3",
    title: "Interview scorecard published",
    body: "DSA mock interview · Overall 3.6 / 5. Communication improved since your last session.",
    at: "2026-10-26T21:40:00+05:30",
    href: routes.interviewScorecard("iv-2041"),
    unread: false,
    kind: "interview",
  },
  {
    id: "n4",
    title: "Payment received",
    body: "₹1,499 for Pro (monthly) via Razorpay UPI.",
    at: "2026-10-20T09:00:00+05:30",
    href: routes.billing,
    unread: false,
    kind: "billing",
  },
];
