# UI coverage checklist

Maps every feature in the Edge Career implementation plan to the screens that show it.
All screens use mock data; the **Phase** column is when the plan ships the real functionality.

To review: run `npm run dev` and open **http://localhost:3000/screens**, which links to every screen below.

Status key: ✅ built · ◐ built as a preview of a later-phase feature (clearly labelled in the UI)

## 1. Platform: sign-in, onboarding, account, payments

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Public landing page | Landing | `/` | 1 | ✅ |
| Pricing, interview minutes capped per plan | Pricing | `/pricing` | 1 | ✅ |
| Email one-time code, Google and GitHub sign-in | Sign in, Create account | `/sign-in`, `/sign-up` | 0 | ✅ |
| Email code verification (error, resend) | Verify | `/verify` | 0 | ✅ |
| Onboarding: persona, level, target company, target salary | Onboarding (6 steps, offers the placement test) | `/onboarding` | 0 | ✅ |
| Profile and connected accounts (GitHub needed for Module 5) | Profile | `/profile` | 1 | ✅ |
| Settings | Account, learning preferences, notifications, connected accounts, privacy and data | `/settings` | 1 | ✅ |
| Subscription, usage, invoices | Billing | `/billing` | 1 | ✅ |
| Razorpay first, Stripe for international | Checkout (success and failure states) | `/billing/checkout?plan=pro_plus` | 1 | ✅ |

## 2. Module locking and lessons

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Track → Module → Topic → Lesson / practice / assignment → Checkpoint | Curriculum, Module detail | `/learn`, `/learn/modules/[id]` | 1 | ✅ |
| Item states: locked → unlocked → in progress → submitted → passed / failed | Module detail (status badge on every item) | `/learn/modules/system-design` | 1 | ✅ |
| Strict order in the core track; unlock at all required items + checkpoint ≥ 85% | Curriculum stepper, module unlock-rule panel, locked module | `/learn`, `/learn/modules/production-engineering` | 1 | ✅ |
| Placement test lets experienced users test out | Tested-out module, placement test | `/learn/modules/programming-foundations`, `/assessments/placement` | 1 | ✅ |
| Electives unlock after their prerequisite module | Curriculum electives grid, elective detail | `/learn`, `/learn/modules/concurrency` | 3 | ✅ |
| Pre-recorded avatar video lessons, synced transcript | Lesson player (chapters, speed, captions, transcript search, click-to-seek) | `/learn/lessons/lesson-consistent-hashing` | 1 | ✅ |
| "Ask about this moment" sends the timestamp to the doubt hub | Lesson player → doubt hub | `/doubts?lesson=lesson-consistent-hashing&t=372` | 1 | ✅ |
| Learner dashboard | Dashboard: continue learning, next unlock, core-track progress, recommendations, reviews pending, interview, readiness | `/dashboard` | 1 | ✅ |

## 3. Code judge, AI feedback, SQL judge

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| LeetCode-style problems with generated boilerplate per language | Coding workspace (Python, Java, C++, JavaScript, Go) | `/practice/longest-substring-without-repeating` | 1 | ✅ |
| Problem bank, adaptive problem selection | Problem bank with "Recommended for you" and reasons | `/practice` | 1 / 3 | ✅ |
| Run / submit with 2 s / 256 MB limits and hidden tests | Workspace console: test cases, results, verdicts (demo switcher for Accepted, Wrong answer, TLE, Runtime error, Compile error) | `/practice/[id]` | 1 | ✅ |
| Scoring: 70% hidden tests + 30% AI rubric | Workspace results, submission result | `/submissions/sub-1007` | 1 | ✅ |
| Time complexity: runtime on growing inputs + AI reading, shown as an estimate | Complexity card with chart | `/submissions/sub-1007` | 1 | ✅ |
| AOIs (edge cases, readability, complexity) after each submission | AOI list with severity and line references, rubric table | `/submissions/sub-1007` | 1 | ✅ |
| SQL judge: compare rows with the reference query | SQL workspace: schema viewer, query editor, your rows vs expected rows | `/practice/department-top-three-salaries` | 1 | ✅ |
| Submission history | Submissions (filters, review status) | `/submissions` | 1 | ✅ |
| Near-threshold or low-confidence scores go to human review; appeals | Review status on submission, appeal dialog | `/submissions/sub-1003` | 1 | ✅ |

## 4. Assessments and exam integrity

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Checkpoint exams, attempts and history | Assessments overview | `/assessments` | 1 | ✅ |
| Checkpoint intro: eligibility, rules, past attempts | Exam intro (available and locked) | `/assessments/exam-system-design`, `/assessments/exam-production-engineering` | 1 | ✅ |
| Exam attempt: timer, randomized questions, MCQ / coding / design answers | Exam attempt (full screen) | `/assessments/exam-system-design/attempt` | 1 | ✅ |
| Integrity: paste and tab-switch logging | Integrity counter + toast in the attempt | same | 1 | ✅ |
| Pass at 85%; 80–88% to human review; retakes draw a fresh set | Exam result with outcome preview (passed / under review / not passed), appeal | `/assessments/exam-system-design/result` | 1 | ✅ |
| Placement test | Placement intro and results; attempt uses the exam screen | `/assessments/placement`, `/assessments/exam-placement/attempt` | 1 | ✅ |

## 5. Doubt hub

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Context: problem, current code, latest error/output, matching lesson section | Doubt hub context panel | `/doubts?thread=dt-coin-change` | 1 | ✅ |
| Escalating hints: nudge → concept → approach → pseudocode, never the full solution | Hint ladder in the doubt hub and in the coding workspace | `/doubts`, `/practice/[id]` (Hints tab) | 1 | ✅ |
| Call-stack diagrams as generated flowcharts | Flowchart in the context panel | `/doubts?thread=dt-coin-change` | 1 | ✅ |
| Step-by-step execution traces | Trace preview with step controls | same | 2 | ◐ |
| Open a doubt from a problem | "Continue in doubt hub" | `/doubts?problem=two-sum` | 1 | ✅ |

## 6. System design workbench

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Design problem list (HLD and LLD) | System design | `/system-design` | 2 | ✅ |
| HLD drag-and-drop canvas with typed blocks, saved as data | HLD workbench (palette, React Flow canvas, minimap) | `/system-design/hld/hld-url-shortener` | 2 | ✅ |
| Written sections: requirements, estimates, APIs, data model, trade-offs | HLD write-up tab | same | 2 | ✅ |
| Automatic checks first (e.g. single DB with no replica = single point of failure) | Live checks tab | same | 2 | ✅ |
| Claude review against the rubric; human review when unsure | Review tab; low-confidence state | `/system-design/hld/hld-news-feed` | 2 | ✅ |
| LLD multi-file workspace, hidden unit tests, SOLID / patterns rubric | LLD workbench | `/system-design/lld/lld-parking-lot` | 2 | ✅ |

## 7. Mock interview studio

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| DSA, LLD, HLD, behavioral interviews; minutes capped per plan | Interview studio (history, trend, minutes) | `/interviews` | 1 / 2 | ✅ |
| Setup: device check, company focus, duration vs minutes left | Interview setup | `/interviews/new?type=dsa` | 1 | ✅ |
| Text interview | Live room, text mode | `/interviews/iv-live-text/live` | 1 | ✅ |
| Voice interview (target < 1.5 s per reply, user can interrupt) | Live room, voice mode (captions, interrupt, latency readout) | `/interviews/iv-live-voice/live` | 1 | ✅ |
| Fixed stages: intro → problem → clarifying → approach → code → complexity → follow-ups → wrap-up | Stage tracker in the live room | same | 1 | ✅ |
| Shared screen: interviewer sees code and diagrams | Shared editor and notes pane with indicator | same | 1 | ✅ |
| Avatar video interviewer | Avatar preview | `/interviews/iv-live-avatar/live` | 2 | ◐ |
| Scorecard: 4 metrics, transcript evidence, improvement tips | Scorecard + transcript | `/interviews/iv-2041` | 1 | ✅ |

## 8. Progress and readiness

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Skill tags, recency-weighted mastery, heatmap | Skill progress | `/progress` | 1 | ✅ |
| Company and salary readiness, expert-set, labelled as estimates | Readiness | `/readiness` | 2 | ✅ |
| Collect real interview outcomes from launch | "Report an interview outcome" on Readiness | `/readiness` | 2 | ✅ |

## 9. Specialisations (Modules 5–6)

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| GitHub app connection | Projects (shown in locked preview mode) | `/projects` | 3 | ✅ |
| Repo test runner and live-URL checks | Project detail | `/projects/project-url-shortener` | 3 | ✅ |
| Python ML sandbox with notebooks | Notebook list, notebook workbench (kernel, cells, outputs, graded checks) | `/notebooks`, `/notebooks/nb-churn-model` | 3 | ✅ |

## 10. Admin console and monitoring

| Plan feature | Screen(s) | Route | Phase | Status |
| --- | --- | --- | --- | --- |
| Admin overview | KPIs, review backlog, AI cost, alerts | `/admin` | 1 | ✅ |
| Content as files in git, checked on every change | Curriculum tree, problem table with CI status, rubrics | `/admin/content` | 0 | ✅ |
| Problem file: statement, tests, rubric, boilerplate, checks | Problem editor | `/admin/content/problems/[id]` | 0 | ✅ |
| Lesson production: expert outline → Claude script → expert review → avatar video | Lesson pipeline, script review | `/admin/content/lessons`, `/admin/content/lessons/lesson-consistent-hashing` | 1 | ✅ |
| Human review queue | Review queue (reason, type, status, SLA) | `/admin/reviews` | 1 | ✅ |
| Manual grade overrides | Review detail with confirm / override and audit trail | `/admin/reviews/rv-311` | 1 | ✅ |
| Grader accuracy (e.g. ±5 points on 90% of cases) gates AI locking | Grader accuracy | `/admin/grading` | 1 | ✅ |
| Exam integrity and code similarity checks | Integrity | `/admin/integrity` | 2 | ✅ |
| AI layer: cost and latency per feature, effort, caching, prompt versions, manipulation defence | AI usage & cost | `/admin/ai-usage` | 0 | ✅ |
| Voice cost and latency; speech-to-text trials on Indian English | Interview ops | `/admin/interviews` | 1 | ✅ |
| Readiness calibration against real outcomes | Readiness calibration | `/admin/readiness` | 3 | ✅ |
| Monitoring (Sentry), judge queue, sandbox policy | System health | `/admin/system` | 1 | ✅ |
| User management | Users, user detail | `/admin/users`, `/admin/users/u_1042` | 1 | ✅ |

## 11. Shared states and design system

| Item | Where |
| --- | --- |
| Design tokens, components, light and dark themes | `/design-system` |
| Empty states | Filtered tables with no matches (problem bank, submissions, review queue, users, interview history), reported outcomes, doubt threads |
| Loading states | Route skeletons (`loading.tsx` for learner, admin, workspaces); spinners on Run, Submit, Pay, Save, review generation |
| Error states | Route error boundaries with retry; failed payment; wrong verification code; wrong-answer and compile-error verdicts |
| Locked states | Locked modules, locked checkpoint, Projects and Notebooks preview banners, locked electives |
| Success states | Checkpoint passed, payment success, saved/approved toasts, accepted verdict |
| Not found | `/this-page-does-not-exist` and any unknown id |
| Responsive | Every page checked at 390 px (phone), 820 px (tablet) and 1440 px (desktop): no sideways scrolling; workspaces switch to tabs below 1024 px |

## Known limitations

These are deliberate for a mock-data UI, or small items to address when the real feature is built.

- **Everything is simulated.** Run/Submit, reviews, payments, interviews and notebook cells return canned results after a short delay.
- **Unknown ids return HTTP 200.** The 404 page renders (marked `noindex`), but because the route shows a loading skeleton first, the status is already sent. Validate ids before streaming when the real data layer is added.
- **Monaco loads from a CDN** (jsDelivr), so code editors need internet access. Bundle it locally before release if needed.
- **Live interview rooms all play the same DSA script** (Meeting rooms II), whatever type is chosen in setup. Ending any session opens the sample scorecard `iv-2041`.
- **Previews for later phases:** the avatar interviewer and step-by-step execution traces are static previews.
- **Ctrl K search** finds pages and screens only; content search comes with the backend.
- **The demo user is also an admin** so the admin console is reachable from the account menu. Real role-based access comes with authentication.

## Assumptions (where the plan did not specify)

- **Module names and lengths:** 1 Programming Foundations (4 wk), 2 Data Structures & Algorithms (15 wk), 3 Databases & SQL (4 wk), 4 System Design LLD + HLD (8 wk), 5 Production Engineering (6 wk), 6 AI & ML Engineering (5 wk) = 42 weeks. Electives: Behavioral Interviews, Concurrency, Distributed Systems, Frontend System Design, Cloud & DevOps, LLM Applications.
- **The four scorecard metrics:** Problem solving, Coding, Communication, Technical depth. Rename them in one place: `INTERVIEW_METRICS` in `src/types/interviews.ts`.
- **Plans and prices:** Free ₹0 (15-minute interview trial), Pro ₹1,499/month (120 min), Pro Plus ₹2,999/month (400 min); yearly ≈ 2 months free; $19 / $39 for international; 18% GST shown for India. Minutes are charged for live interview time only.
- **Personas, levels and salary bands:** student, career switcher, working engineer, senior engineer; Beginner, SDE 1, SDE 2, SDE 3; ₹10–20, 20–35, 35–50, 50+ LPA.
- **Human review turnaround:** 24 hours.
- **Judge language versions:** Python 3, Java 21, C++ 20, Node 22, Go 1.23, PostgreSQL 16.
- **ML sandbox limits:** 2 vCPU, 4 GB memory, 120 s per cell, no internet.
- **Sign-in vs sign-up:** after the email code, sign-up continues to onboarding and sign-in goes to the dashboard.
- **Indian market by default:** INR, Indian companies and names in sample data.
