import type { User } from "@/types/user";

export const currentUser: User = {
  id: "u_1042",
  name: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  role: "admin",
  persona: "working_engineer",
  level: "sde1",
  targetCompanies: ["Atlassian", "Google", "Uber"],
  targetSalary: "35-50",
  plan: "pro",
  githubUsername: "aarav-codes",
  location: "Bengaluru, India",
  joinedAt: "2026-06-02T10:00:00+05:30",
  streakDays: 12,
  interviewMinutesLeft: 74,
  interviewMinutesTotal: 120,
};

export const TARGET_COMPANY_OPTIONS = [
  "Google",
  "Amazon",
  "Microsoft",
  "Atlassian",
  "Uber",
  "Flipkart",
  "Razorpay",
  "Swiggy",
  "Zomato",
  "PhonePe",
  "Adobe",
  "Salesforce",
];
