// Automatic structural checks for HLD diagrams, run before the AI review.
// They run live in the browser here; the real service runs the same rules server-side.

import { DEMO_NOW } from "@/lib/format";
import type { BlockType, CheckSeverity, DesignCheck, DesignReview, DesignSections, HldProblem } from "@/types/system-design";

interface CheckNode {
  id: string;
  type: BlockType;
  label: string;
}

interface CheckEdge {
  source: string;
  target: string;
}

const SEVERITY_ORDER: Record<CheckSeverity, number> = { error: 0, warning: 1, suggestion: 2, pass: 3 };

export function runDesignChecks(nodes: CheckNode[], edges: CheckEdge[], readHeavy: boolean): DesignCheck[] {
  if (nodes.length === 0) return [];

  const neighbours = new Map<string, Set<string>>(nodes.map((n) => [n.id, new Set<string>()]));
  for (const e of edges) {
    neighbours.get(e.source)?.add(e.target);
    neighbours.get(e.target)?.add(e.source);
  }
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const ofType = (...types: BlockType[]) => nodes.filter((n) => types.includes(n.type));
  const connectedOfType = (node: CheckNode, type: BlockType) =>
    [...(neighbours.get(node.id) ?? [])].map((id) => byId.get(id)).filter((n): n is CheckNode => n?.type === type);

  const checks: DesignCheck[] = [];
  const databases = ofType("database");

  // 1. Every database needs a replica or standby.
  if (databases.length === 0) {
    checks.push({
      id: "no-database",
      severity: "warning",
      title: "No persistent data store",
      detail: "Nothing in the diagram stores data durably. Add a Database block for state that must survive restarts.",
    });
  }
  for (const db of databases) {
    const replicas = connectedOfType(db, "replica");
    checks.push(
      replicas.length === 0
        ? {
            id: `spof-${db.id}`,
            severity: "error",
            title: "Single point of failure",
            detail: `${db.label} has no read replica or standby. If it fails, every request that reaches it fails too.`,
          }
        : {
            id: `replicated-${db.id}`,
            severity: "pass",
            title: "Database is replicated",
            detail: `${db.label} replicates to ${replicas.map((r) => r.label).join(", ")}.`,
          },
    );
  }
  for (const replica of ofType("replica")) {
    if (connectedOfType(replica, "database").length === 0) {
      checks.push({
        id: `orphan-replica-${replica.id}`,
        severity: "warning",
        title: "Replica without a primary",
        detail: `${replica.label} isn't connected to a database, so it's unclear what it replicates.`,
      });
    }
  }

  // 2. Read-heavy systems should cache reads.
  if (readHeavy && databases.length > 0) {
    checks.push(
      ofType("cache").length === 0
        ? {
            id: "no-cache",
            severity: "suggestion",
            title: "Add a cache in front of the database",
            detail: "This system is read-heavy. A cache such as Redis would absorb most reads and cut latency.",
          }
        : { id: "cached", severity: "pass", title: "Reads are cached", detail: "Hot reads are served from a cache before the database." },
    );
  }

  // 3. Several services need something spreading traffic across them.
  const services = ofType("service");
  const balancers = ofType("load_balancer", "api_gateway");
  if (services.length > 1) {
    checks.push(
      balancers.length === 0
        ? {
            id: "no-lb",
            severity: "warning",
            title: "Traffic isn't load balanced",
            detail: `${services.length} services take traffic directly from clients. Put a load balancer or API gateway in front of them.`,
          }
        : { id: "balanced", severity: "pass", title: "Traffic is load balanced", detail: `${balancers[0]!.label} routes requests to the services.` },
    );
  }

  // 4. Queues need a consumer.
  const queues = ofType("queue");
  const unconsumed = queues.filter((q) => !edges.some((e) => e.source === q.id && ["worker", "service"].includes(byId.get(e.target)?.type ?? "")));
  if (unconsumed.length > 0) {
    checks.push({
      id: "no-consumer",
      severity: "warning",
      title: "Queue has no consumer",
      detail: `${unconsumed.map((q) => q.label).join(", ")} ${unconsumed.length === 1 ? "has" : "have"} no outgoing connection to a worker or service.`,
    });
  } else if (queues.length > 0) {
    checks.push({ id: "consumed", severity: "pass", title: "Queues have consumers", detail: "Every queue feeds a worker or service." });
  }

  // 5. Everything should be wired into the flow.
  const isolated = nodes.filter((n) => (neighbours.get(n.id)?.size ?? 0) === 0);
  if (nodes.length > 1) {
    checks.push(
      isolated.length > 0
        ? {
            id: "unconnected",
            severity: "warning",
            title: `${isolated.length} unconnected ${isolated.length === 1 ? "block" : "blocks"}`,
            detail: `${isolated.map((n) => n.label).join(", ")} ${isolated.length === 1 ? "isn't" : "aren't"} connected to anything.`,
          }
        : { id: "connected", severity: "pass", title: "Every block is connected", detail: "Reviewers can follow each request path." },
    );
  }

  // 6. Show where requests come from.
  if (ofType("client").length === 0) {
    checks.push({
      id: "no-client",
      severity: "suggestion",
      title: "Show where requests come from",
      detail: "Add a Client block so reviewers can follow the request path from the start.",
    });
  }

  return checks.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

const SECTION_FOR_CRITERION: Record<string, keyof DesignSections> = {
  "Requirements & scope": "requirements",
  "Capacity estimates": "estimates",
  "API design": "apis",
  "Trade-offs": "tradeoffs",
};

/**
 * Stand-in for the AI design review. Scores start from the last review and move with the
 * automatic checks and how complete the written sections are, so edits visibly change the result.
 */
export function simulateDesignReview(problem: HldProblem, checks: DesignCheck[], sections: DesignSections): DesignReview {
  const errors = checks.filter((c) => c.severity === "error");
  const warnings = checks.filter((c) => c.severity === "warning");
  const suggestions = checks.filter((c) => c.severity === "suggestion");

  const criteria = problem.rubric.map(({ criterion, weight }) => {
    const prior = problem.lastReview?.criteria.find((c) => c.criterion === criterion);
    let ratio = prior ? prior.score / prior.max : 0.75;
    let comment = prior?.comment ?? "Meets the bar for an SDE 2 design.";

    const sectionKey = SECTION_FOR_CRITERION[criterion];
    if (sectionKey && sections[sectionKey].trim().length < 20) {
      ratio = 0.3;
      comment = "This section is empty or too short to assess.";
    } else if (criterion === "Reliability & availability") {
      if (errors.length > 0) {
        ratio = Math.min(ratio, 0.6);
        comment = `${errors[0]!.detail} Add a replica or standby and describe failover.`;
      } else {
        ratio = Math.max(ratio, 0.9);
        comment = "No single points of failure found; data stores are replicated.";
      }
    } else if (criterion === "Architecture & data flow" && warnings.length > 0) {
      ratio -= warnings.length * 0.08;
      comment = `${warnings.length} structural ${warnings.length === 1 ? "warning" : "warnings"} from the automatic checks: ${warnings.map((w) => w.title.toLowerCase()).join("; ")}.`;
    } else if (criterion === "Scalability" && suggestions.some((s) => s.id === "no-cache")) {
      ratio -= 0.15;
      comment = "Read-heavy traffic goes straight to the database. A cache would change the scaling story.";
    }

    const clamped = Math.min(1, Math.max(0.2, ratio));
    return { criterion, score: Math.round(clamped * weight), max: weight, comment };
  });

  const overall = criteria.reduce((sum, c) => sum + c.score, 0);
  const lowConfidence = problem.id === "hld-news-feed";

  return {
    overall,
    confidence: lowConfidence ? "low" : "high",
    criteria,
    reviewedAt: DEMO_NOW,
    strengths: problem.lastReview?.strengths ?? ["The request path is easy to follow.", "Components have clear responsibilities."],
    improvements: [
      ...errors.map((e) => `${e.title}: ${e.detail}`),
      ...warnings.map((w) => `${w.title}: ${w.detail}`),
      ...(problem.lastReview?.improvements.slice(1) ?? ["Explain how the system degrades when a dependency is slow."]),
    ].slice(0, 5),
    humanReview: lowConfidence
      ? {
          reason: "The AI grader's confidence was low on parts of this design, so a human reviewer will confirm the score before it counts.",
          submittedAt: DEMO_NOW,
          expectedBy: "2026-10-28T18:30:00+05:30",
        }
      : undefined,
  };
}
