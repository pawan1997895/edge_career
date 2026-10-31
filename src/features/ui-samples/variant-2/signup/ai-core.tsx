"use client";

import { cn } from "@/lib/utils";
import { HudPanel } from "../ui";
import styles from "../command.module.css";

const ORBIT = ["{}", "</>", "AI", "JS", "TS", "01"] as const;
const BLIPS = [
  { left: "68%", top: "30%", delay: 0.6 },
  { left: "30%", top: "64%", delay: 2.5 },
  { left: "72%", top: "70%", delay: 1.5 },
  { left: "24%", top: "28%", delay: 3.4 },
] as const;
const SERVICES = [
  { name: "AI mentor", state: "Online" },
  { name: "Code judge", state: "Ready" },
  { name: "Mock interviewer", state: "Standby" },
] as const;

/** Radar-style "AI core": a rotating scan, orbiting code symbols, blips and service status. */
export function AiCore() {
  return (
    <HudPanel index="03" title="ai.core" status="scanning" bodyClassName="p-5">
      <div aria-hidden className="relative mx-auto w-[220px]">
        <div className={styles.radar}>
          <div className={styles.radarSweep} />
          <span className="absolute inset-x-[6%] top-1/2 h-px bg-(--v2-line)" />
          <span className="absolute inset-y-[6%] left-1/2 w-px bg-(--v2-line)" />
          {BLIPS.map((b) => (
            <span
              key={b.left + b.top}
              className={cn(styles.blip, "absolute size-1.5 bg-(--v2-amber) shadow-[0_0_10px_var(--v2-amber)]")}
              style={{ left: b.left, top: b.top, animationDelay: `${b.delay}s` }}
            />
          ))}
          <span
            className={cn(
              styles.chamfer,
              styles.display,
              "absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center bg-(--v2-mint)/15 text-lg font-bold text-(--v2-mint) shadow-[inset_0_0_0_1px_var(--v2-line-strong)] [--v2-cut:10px]",
            )}
          >
            AI
          </span>
          <div className={styles.orbit}>
            {ORBIT.map((token, i) => {
              const angle = (i / ORBIT.length) * 360;
              return (
                <span
                  key={token}
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: `rotate(${angle}deg) translateY(-100px) rotate(${-angle}deg)` }}
                >
                  <span
                    className={cn(
                      styles.upright,
                      "block -translate-x-1/2 -translate-y-1/2 border border-(--v2-line-strong) bg-(--v2-bg)/90 px-1.5 py-0.5 font-mono text-[10px] text-(--v2-mint)",
                    )}
                  >
                    {token}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <ul className="mt-5 space-y-2 font-mono text-[11px] tracking-[0.12em] uppercase">
        {SERVICES.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="text-muted-foreground">{s.name}</span>
            <span aria-hidden className="h-px flex-1 border-b border-dotted border-(--v2-line)" />
            <span className="text-(--v2-mint)">{s.state}</span>
          </li>
        ))}
      </ul>
    </HudPanel>
  );
}
