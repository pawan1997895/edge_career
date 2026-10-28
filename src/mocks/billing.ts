import type { ComparisonRow, Invoice, PaymentMethod, Plan, Subscription, UsageMonth } from "@/types/billing";

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Try the platform and see where you stand.",
    priceInr: { monthly: 0, yearly: 0 },
    priceUsd: { monthly: 0, yearly: 0 },
    interviewMinutes: 15,
    interviewMinutesNote: "15-minute mock interview trial (one time)",
    features: [
      "Placement test and Module 1 lessons",
      "50 judge submissions a month",
      "10 doubt-hub hints a month",
      "Skill heatmap",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "The full curriculum with steady interview practice.",
    priceInr: { monthly: 1499, yearly: 14990 },
    priceUsd: { monthly: 19, yearly: 190 },
    interviewMinutes: 120,
    interviewMinutesNote: "120 mock interview minutes a month",
    highlighted: true,
    features: [
      "All six core modules and electives",
      "Unlimited judge submissions with AI feedback",
      "System design canvas and LLD workspace",
      "Voice and text mock interviews with scorecards",
      "Company and salary readiness",
    ],
  },
  {
    id: "pro_plus",
    name: "Pro Plus",
    tagline: "For an intensive final stretch before interviews.",
    priceInr: { monthly: 2999, yearly: 29990 },
    priceUsd: { monthly: 39, yearly: 390 },
    interviewMinutes: 400,
    interviewMinutesNote: "400 mock interview minutes a month",
    features: [
      "Everything in Pro",
      "More than three times the interview minutes",
      "Avatar video interviewer when it launches",
      "Priority human review (within 12 hours)",
    ],
  },
];

export const comparisonRows: ComparisonRow[] = [
  { group: "Learning", label: "Avatar video lessons with transcripts", values: { free: "Module 1", pro: true, pro_plus: true } },
  { group: "Learning", label: "Code judge (Python, Java, C++, JavaScript, Go, SQL)", values: { free: "50 / month", pro: "Unlimited", pro_plus: "Unlimited" } },
  { group: "Learning", label: "AI code feedback (areas of improvement)", values: { free: "5 / month", pro: true, pro_plus: true } },
  { group: "Learning", label: "Doubt hub with escalating hints", values: { free: "10 / month", pro: "Unlimited", pro_plus: "Unlimited" } },
  { group: "Learning", label: "Placement test", values: { free: true, pro: true, pro_plus: true } },
  { group: "Learning", label: "Checkpoint exams and module unlocking", values: { free: "Module 1", pro: true, pro_plus: true } },
  { group: "Design and interviews", label: "HLD canvas with automatic checks and AI review", values: { free: false, pro: true, pro_plus: true } },
  { group: "Design and interviews", label: "LLD workspace with hidden unit tests", values: { free: false, pro: true, pro_plus: true } },
  { group: "Design and interviews", label: "Mock interview minutes", values: { free: "15 (trial)", pro: "120 / month", pro_plus: "400 / month" } },
  { group: "Design and interviews", label: "Interview types", values: { free: "DSA (text)", pro: "DSA, LLD, HLD, behavioral", pro_plus: "DSA, LLD, HLD, behavioral" } },
  { group: "Design and interviews", label: "Avatar video interviewer (coming later)", values: { free: false, pro: false, pro_plus: true } },
  { group: "Career", label: "Skill mastery heatmap", values: { free: true, pro: true, pro_plus: true } },
  { group: "Career", label: "Company and salary readiness estimates", values: { free: false, pro: true, pro_plus: true } },
  { group: "Career", label: "Projects and ML notebooks (Modules 5–6)", values: { free: false, pro: true, pro_plus: true } },
  { group: "Career", label: "Human review and grade appeals", values: { free: true, pro: true, pro_plus: true } },
  { group: "Career", label: "Priority human review", values: { free: false, pro: false, pro_plus: "Within 12 hours" } },
];

export const subscription: Subscription = {
  plan: "pro",
  cycle: "monthly",
  status: "active",
  startedAt: "2026-07-20T10:00:00+05:30",
  renewsAt: "2026-11-20T10:00:00+05:30",
  minutesUsed: 46,
  minutesCap: 120,
};

export const usageHistory: UsageMonth[] = [
  { month: "Jul", minutesUsed: 82, cap: 120 },
  { month: "Aug", minutesUsed: 110, cap: 120 },
  { month: "Sep", minutesUsed: 120, cap: 120 },
  { month: "Oct", minutesUsed: 46, cap: 120 },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm_upi", kind: "upi", label: "UPI", detail: "aarav@okhdfcbank", provider: "Razorpay", isDefault: true },
  { id: "pm_card", kind: "card", label: "Visa", detail: "•••• 4821 · expires 08/29", provider: "Razorpay", isDefault: false },
];

export const invoices: Invoice[] = [
  { id: "INV-2026-1020", date: "2026-10-20T09:00:00+05:30", description: "Pro · monthly", amountInr: 1769, status: "paid", method: "UPI · aarav@okhdfcbank" },
  { id: "INV-2026-0921", date: "2026-09-21T11:42:00+05:30", description: "Pro · monthly (retry)", amountInr: 1769, status: "paid", method: "UPI · aarav@okhdfcbank" },
  { id: "INV-2026-0920", date: "2026-09-20T09:00:00+05:30", description: "Pro · monthly", amountInr: 1769, status: "failed", method: "Visa •••• 4821" },
  { id: "INV-2026-0820", date: "2026-08-20T09:00:00+05:30", description: "Pro · monthly", amountInr: 1769, status: "paid", method: "Visa •••• 4821" },
  { id: "INV-2026-0720", date: "2026-07-20T10:00:00+05:30", description: "Pro · monthly (first payment)", amountInr: 1769, status: "paid", method: "Visa •••• 4821" },
];
