// Sidebar navigation for the learner app and the admin console.

import {
  Activity,
  Bot,
  BookOpen,
  ChartColumn,
  ClipboardCheck,
  CodeXml,
  FolderGit2,
  Gauge,
  Inbox,
  Layers,
  LayoutDashboard,
  ListChecks,
  MessageCircleQuestionMark,
  Mic,
  Network,
  NotebookPen,
  Scale,
  ShieldCheck,
  Target,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/lib/routes";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Small count or label shown on the right, e.g. pending reviews. */
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const learnerNav: NavSection[] = [
  { items: [{ title: "Dashboard", href: routes.dashboard, icon: LayoutDashboard }] },
  {
    title: "Learn",
    items: [
      { title: "Curriculum", href: routes.learn, icon: BookOpen },
      { title: "Practice", href: routes.practice, icon: CodeXml },
      { title: "Assessments", href: routes.assessments, icon: ClipboardCheck },
      { title: "Doubt hub", href: routes.doubts, icon: MessageCircleQuestionMark },
    ],
  },
  {
    title: "Build",
    items: [
      { title: "System design", href: routes.systemDesign, icon: Network },
      { title: "Projects", href: routes.projects, icon: FolderGit2 },
      { title: "ML notebooks", href: routes.notebooks, icon: NotebookPen },
    ],
  },
  {
    title: "Interview",
    items: [{ title: "Mock interviews", href: routes.interviews, icon: Mic }],
  },
  {
    title: "Insights",
    items: [
      { title: "Skill progress", href: routes.progress, icon: ChartColumn },
      { title: "Readiness", href: routes.readiness, icon: Target },
      { title: "Submissions", href: routes.submissions, icon: ListChecks },
    ],
  },
];

export const adminNav: NavSection[] = [
  { items: [{ title: "Overview", href: routes.admin.overview, icon: Gauge }] },
  {
    title: "Content",
    items: [
      { title: "Curriculum & problems", href: routes.admin.content, icon: Layers },
      { title: "Lesson production", href: routes.admin.lessons, icon: Video },
    ],
  },
  {
    title: "Grading",
    items: [
      { title: "Review queue", href: routes.admin.reviews, icon: Inbox, badge: "14" },
      { title: "Grader accuracy", href: routes.admin.grading, icon: Scale },
      { title: "Integrity", href: routes.admin.integrity, icon: ShieldCheck },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "AI usage & cost", href: routes.admin.aiUsage, icon: Bot },
      { title: "Interview ops", href: routes.admin.interviews, icon: Mic },
      { title: "Readiness calibration", href: routes.admin.readiness, icon: Target },
      { title: "System health", href: routes.admin.system, icon: Activity },
    ],
  },
  { title: "People", items: [{ title: "Users", href: routes.admin.users, icon: Users }] },
];

/** The href of the nav item to highlight: the longest one that the current path starts with. */
export function activeNavHref(sections: NavSection[], pathname: string): string | undefined {
  return sections
    .flatMap((s) => s.items)
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
