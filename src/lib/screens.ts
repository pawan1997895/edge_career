// Registry of every screen in the UI, grouped by feature. It powers the /screens
// review page and doubles as the coverage checklist against the implementation plan.
// `phase` is the roadmap phase that ships the real functionality (0 = foundation).

import { routes } from "@/lib/routes";

export interface ScreenEntry {
  title: string;
  href: string;
  description: string;
  phase: 0 | 1 | 2 | 3;
}

export interface ScreenGroup {
  title: string;
  planSection: string;
  screens: ScreenEntry[];
}

export const screenGroups: ScreenGroup[] = [
  {
    title: "Public site, sign-in and onboarding",
    planSection: "Platform · Login · Onboarding",
    screens: [
      { title: "Landing page", href: routes.home, description: "Product overview, curriculum, features, pricing teaser, FAQ", phase: 1 },
      { title: "Pricing", href: routes.pricing, description: "Plans with interview-minute caps, INR and USD pricing", phase: 1 },
      { title: "Sign in", href: routes.signIn, description: "Email one-time code, Google and GitHub sign-in", phase: 0 },
      { title: "Create account", href: routes.signUp, description: "Registration with the same three methods", phase: 0 },
      { title: "Verify email code", href: routes.verify, description: "Six-digit code entry with resend and error states", phase: 0 },
      { title: "Onboarding", href: routes.onboarding, description: "Persona, level, target companies, target salary, placement test offer", phase: 0 },
    ],
  },
  {
    title: "Learning and module locking",
    planSection: "Module locking · Lessons",
    screens: [
      { title: "Learner dashboard", href: routes.dashboard, description: "Continue learning, next unlock, mastery snapshot, recent activity", phase: 1 },
      { title: "Curriculum (tracks)", href: routes.learn, description: "Core track in strict order plus electives with prerequisites", phase: 1 },
      { title: "Module in progress", href: routes.module("system-design"), description: "Topics, item states, unlock rule and checkpoint", phase: 1 },
      { title: "Locked module", href: routes.module("production-engineering"), description: "Locked state with what is needed to unlock", phase: 1 },
      { title: "Tested-out module", href: routes.module("programming-foundations"), description: "Module skipped via the placement test", phase: 1 },
      { title: "Elective", href: routes.module("concurrency"), description: "Elective unlocked by its prerequisite module", phase: 3 },
      { title: "Lesson player", href: routes.lesson("lesson-consistent-hashing"), description: "Avatar video, synced transcript, chapters, “Ask about this moment”", phase: 1 },
    ],
  },
  {
    title: "Coding practice and the judge",
    planSection: "Code judge · AOIs · SQL judge",
    screens: [
      { title: "Problem bank", href: routes.practice, description: "Filters, recommended problems, locked problems", phase: 1 },
      { title: "Coding workspace", href: routes.problem("longest-substring-without-repeating"), description: "Editor, language selector, tests, run/submit, results, AI feedback, hints", phase: 1 },
      { title: "SQL workspace", href: routes.problem("department-top-three-salaries"), description: "Schema viewer, query editor, row comparison with the reference query", phase: 1 },
      { title: "Submission history", href: routes.submissions, description: "All submissions with verdicts and scores", phase: 1 },
      { title: "Submission result", href: routes.submission("sub-1007"), description: "Hidden tests, 70/30 score split, complexity estimate, AOIs, rubric", phase: 1 },
    ],
  },
  {
    title: "Assessments",
    planSection: "Module locking · Exam integrity",
    screens: [
      { title: "Assessments overview", href: routes.assessments, description: "Checkpoints, placement test, attempts, appeals", phase: 1 },
      { title: "Placement test", href: routes.placementTest, description: "Test out of modules: intro, sections, results", phase: 1 },
      { title: "Checkpoint intro", href: routes.exam("exam-system-design"), description: "Eligibility, rules, integrity notice, past attempts", phase: 1 },
      { title: "Exam in progress", href: routes.examAttempt("exam-system-design"), description: "Timer, question navigator, code and MCQ questions, integrity logging", phase: 1 },
      { title: "Exam result", href: routes.examResult("exam-system-design"), description: "Score vs 85% bar, unlock, human-review band, retake, appeal", phase: 1 },
      { title: "Locked checkpoint", href: routes.exam("exam-production-engineering"), description: "Checkpoint not yet available", phase: 1 },
    ],
  },
  {
    title: "Doubt hub",
    planSection: "Doubt hub",
    screens: [
      { title: "Doubt hub", href: routes.doubts, description: "Threads, context panel, escalating hints, flowchart", phase: 1 },
      { title: "Doubt from a lesson moment", href: routes.doubtThread("dt-lesson-hashing"), description: "Thread started with “Ask about this moment”", phase: 1 },
    ],
  },
  {
    title: "System design workbench",
    planSection: "System design workbench",
    screens: [
      { title: "Design problems", href: routes.systemDesign, description: "HLD and LLD problem list with status", phase: 2 },
      { title: "HLD canvas", href: routes.hld("hld-url-shortener"), description: "Drag-and-drop typed blocks, written sections, automatic checks, AI review", phase: 2 },
      { title: "LLD workspace", href: routes.lld("lld-parking-lot"), description: "Multi-file editor, hidden unit tests, SOLID and patterns rubric", phase: 2 },
    ],
  },
  {
    title: "Mock interview studio",
    planSection: "Mock interview studio",
    screens: [
      { title: "Interview studio", href: routes.interviews, description: "Choose type and mode, minutes left, history", phase: 1 },
      { title: "Interview setup", href: routes.interviewSetup("dsa"), description: "Device check, company focus, rules", phase: 1 },
      { title: "Live voice interview", href: routes.interviewRoom("iv-live-voice"), description: "Stage tracker, live transcript, shared code, interrupt", phase: 1 },
      { title: "Text interview", href: routes.interviewRoom("iv-live-text"), description: "Chat-based interview with shared editor", phase: 1 },
      { title: "Avatar interview (preview)", href: routes.interviewRoom("iv-live-avatar"), description: "Video avatar interviewer, later phase", phase: 2 },
      { title: "Scorecard and transcript", href: routes.interviewScorecard("iv-2041"), description: "Four metrics with transcript evidence and tips", phase: 1 },
    ],
  },
  {
    title: "Progress and readiness",
    planSection: "Dashboard",
    screens: [
      { title: "Skill mastery", href: routes.progress, description: "Heatmap, recency-weighted mastery, trends", phase: 1 },
      { title: "Company and salary readiness", href: routes.readiness, description: "Expert-set bars labelled as estimates, report interview outcomes", phase: 2 },
    ],
  },
  {
    title: "Specialisations (Modules 5–6)",
    planSection: "Phase 3",
    screens: [
      { title: "Projects", href: routes.projects, description: "GitHub app connection and project list", phase: 3 },
      { title: "Project detail", href: routes.project("project-url-shortener"), description: "Repo test runner, live-URL checks, run history", phase: 3 },
      { title: "ML notebooks", href: routes.notebooks, description: "Notebook list for the Python ML sandbox", phase: 3 },
      { title: "Notebook", href: routes.notebook("nb-churn-model"), description: "Cells, outputs, kernel status, graded checks", phase: 3 },
    ],
  },
  {
    title: "Account and billing",
    planSection: "Platform · Payments",
    screens: [
      { title: "Profile", href: routes.profile, description: "Persona, level, targets, connected accounts", phase: 1 },
      { title: "Settings", href: routes.settings, description: "Account, preferences, notifications, privacy", phase: 1 },
      { title: "Billing", href: routes.billing, description: "Current plan, interview minutes used, invoices", phase: 1 },
      { title: "Checkout", href: routes.checkout("pro_plus"), description: "Razorpay (India) and Stripe (international), success and failure", phase: 1 },
    ],
  },
  {
    title: "Admin console",
    planSection: "Admin console · Monitoring · Grader accuracy",
    screens: [
      { title: "Admin overview", href: routes.admin.overview, description: "Learners, submissions, review backlog, AI cost", phase: 1 },
      { title: "Curriculum & problems", href: routes.admin.content, description: "Module tree, problem files, CI validation status", phase: 0 },
      { title: "Problem editor", href: routes.admin.problem("longest-substring-without-repeating"), description: "Statement, tests, rubric, versions and checks", phase: 0 },
      { title: "Lesson production", href: routes.admin.lessons, description: "Outline → AI script → expert review → avatar video → published", phase: 1 },
      { title: "Lesson script review", href: routes.admin.lessonScript("lesson-consistent-hashing"), description: "Script editor with review comments and video status", phase: 1 },
      { title: "Human review queue", href: routes.admin.reviews, description: "Near-threshold, low-confidence and appealed results", phase: 1 },
      { title: "Review and grade override", href: routes.admin.review("rv-311"), description: "Code, tests, AI rationale, manual override", phase: 1 },
      { title: "Grader accuracy", href: routes.admin.grading, description: "AI vs human agreement per module, gating status", phase: 1 },
      { title: "Integrity", href: routes.admin.integrity, description: "Similarity matches, paste and tab-switch logs", phase: 2 },
      { title: "AI usage & cost", href: routes.admin.aiUsage, description: "Cost, latency, effort and cache hits per feature", phase: 0 },
      { title: "Interview ops", href: routes.admin.interviews, description: "Minutes, cost per interview, latency, speech-to-text trials", phase: 1 },
      { title: "Readiness calibration", href: routes.admin.readiness, description: "Expert-set bars and collected interview outcomes", phase: 3 },
      { title: "System health", href: routes.admin.system, description: "Judge queue, workers, sandbox limits, errors", phase: 1 },
      { title: "Users", href: routes.admin.users, description: "Learner list with plan, progress and flags", phase: 1 },
      { title: "User detail", href: routes.admin.user("u_1042"), description: "Profile, progress, submissions, integrity events", phase: 1 },
    ],
  },
  {
    title: "Design system and states",
    planSection: "Design system",
    screens: [
      { title: "Design system", href: routes.designSystem, description: "Colours, typography, components, empty/loading/error/locked/success states", phase: 0 },
      { title: "Not found", href: "/this-page-does-not-exist", description: "404 page", phase: 0 },
    ],
  },
];
