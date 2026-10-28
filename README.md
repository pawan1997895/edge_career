# Edge Career — frontend UI

Clickable UI for the whole Edge Career platform: learner app, full-screen workspaces and the admin console.
Every screen runs on **mock data and local state**. There is no backend, real login, payment, AI call, code execution or media yet.

## Run it

```bash
npm install        # only needed on a fresh clone
npm run dev        # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | ESLint |

Start at **http://localhost:3000/screens**. It lists every screen grouped by feature, with the roadmap phase that ships its real functionality.

Requires Node.js 20.9+ (tested on Node 22). The code editor (Monaco) loads from the jsDelivr CDN, so it needs an internet connection; the rest works offline once fonts are cached.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** with design tokens in `src/app/globals.css` (light and dark themes)
- **Radix UI** primitives wrapped as shadcn-style components in `src/components/ui`
- **lucide-react** icons, **Recharts** charts, **React Flow** (`@xyflow/react`) for the HLD canvas, **Monaco** for code editors, **next-themes** for theming

## Project structure

```
src/
  app/                      Routes only. Each page fetches data and renders a feature component.
    (marketing)/            Public site: landing, pricing
    (auth)/                 Sign in, sign up, verify code, onboarding
    (learner)/              Learner app with sidebar (dashboard, curriculum, practice, …)
    (workspace)/            Full-screen workspaces: coding, SQL, HLD/LLD, exam attempt, interview room, notebooks
    admin/                  Admin console with its own sidebar
  features/<area>/          UI for one feature: components/, plus any feature-only helpers
  components/
    ui/                     Design-system primitives (button, card, tabs, dialog, table, …)
    layout/                 App shell, sidebar, top bar, page header, workspace header
    shared/                 Cross-feature pieces: status badges, empty/error/locked states, score ring, code editor, panes
  data/                     Async data-access functions. Replace these with API calls.
  mocks/                    Mock data used by src/data
  types/                    Domain types shared by mocks, data and UI
  lib/                      routes.ts (every URL), navigation.ts (sidebars), screens.ts (screen index), formatting
  hooks/                    use-simulated-action (fake async for Run/Submit/Save buttons)
```

### Conventions

- **Routes are thin.** `src/app/**/page.tsx` awaits functions from `src/data/*` and passes the result to components in `src/features/*`.
- **All links come from `src/lib/routes.ts`.** Rename a URL in one place.
- **Server components by default.** Only interactive pieces are marked `"use client"`.
- **Colours come from tokens** (`bg-card`, `text-muted-foreground`, `bg-success/10`, …). Never use raw hex or palette classes, so both themes stay consistent.
- **States:** use `EmptyState`, `ErrorState`, `LockedState`/`LockedBanner`, skeletons (`loading.tsx`) and success alerts from `src/components/shared`.

## Connecting the real backend later

1. Keep the types in `src/types` as the API contract (or generate them from the API schema).
2. Replace each function body in `src/data/*.ts` with a real request. Pages and components don't change.
3. Replace `useSimulatedAction` calls (Run, Submit, Save, Pay, …) with real mutations.
4. Delete `src/mocks` once nothing imports it.

The demo learner is **Aarav Mehta** (SDE 1, Bengaluru). Module 1 was tested out via the placement test, Modules 2–3 are passed, Module 4 is in progress with its checkpoint ready for a retake, and Modules 5–6 are locked. The demo user is also an admin, so the admin console is reachable from the account menu.

See [`docs/UI_COVERAGE.md`](docs/UI_COVERAGE.md) for the checklist that maps the implementation plan to screens.
