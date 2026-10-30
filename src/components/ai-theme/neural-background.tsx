"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./ai-theme.module.css";

interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: number;
  phase: number;
}

interface Pulse {
  from: number;
  to: number;
  t: number;
  speed: number;
}

const COLOR_TOKENS = ["--ec-blue", "--ec-cyan", "--ec-violet"] as const;
const LINK_BUCKETS = [0.06, 0.12, 0.18, 0.26];
const MAX_DPR = 1.75;

/** Reads an accent token such as `oklch(0.7 0.17 256)` and returns a helper that adds alpha. */
export function readColor(el: Element, token: string) {
  const value = getComputedStyle(el).getPropertyValue(token).trim() || "oklch(0.7 0.17 256)";
  return (alpha: number) => value.replace(/\)\s*$/, ` / ${alpha})`);
}

/** Soft round glow drawn once per colour and reused for every node. */
function makeSprite(color: (alpha: number) => string, dpr: number) {
  const size = Math.ceil(32 * dpr);
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const r = size / 2;
    const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(0, color(1));
    gradient.addColorStop(0.18, color(0.9));
    gradient.addColorStop(0.45, color(0.25));
    gradient.addColorStop(1, color(0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return sprite;
}

function pickColor() {
  const r = Math.random();
  return r < 0.5 ? 0 : r < 0.8 ? 1 : 2; // mostly blue, some cyan, a little violet
}

function makeNode(width: number, height: number): NetNode {
  const angle = Math.random() * Math.PI * 2;
  const speed = 6 + Math.random() * 12; // px per second: a slow drift
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 9 + Math.random() * 9,
    color: pickColor(),
    phase: Math.random() * Math.PI * 2,
  };
}

/**
 * Decorative AI neural network: drifting glowing nodes, distance-faded links and a few
 * signals travelling along them. Pauses when the tab is hidden and draws a single static
 * frame when the visitor prefers reduced motion.
 */
export function NeuralBackground({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const colors = COLOR_TOKENS.map((token) => readColor(canvas, token));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let linkDistance = 150;
    let sprites: HTMLCanvasElement[] = [];
    let nodes: NetNode[] = [];
    let pulses: Pulse[] = [];
    let frame = 0;
    let lastTime = 0;
    let lastPulse = 0;
    const pointer = { x: 0, y: 0, active: false };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const nextWidth = Math.max(1, rect.width);
      const nextHeight = Math.max(1, rect.height);
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      if (nextDpr !== dpr || sprites.length === 0) {
        dpr = nextDpr;
        sprites = colors.map((color) => makeSprite(color, dpr));
      }
      canvas!.width = Math.round(nextWidth * dpr);
      canvas!.height = Math.round(nextHeight * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep existing nodes where they are (scaled), then add or drop to match the new area.
      const sx = width ? nextWidth / width : 1;
      const sy = height ? nextHeight / height : 1;
      for (const node of nodes) {
        node.x *= sx;
        node.y *= sy;
      }
      width = nextWidth;
      height = nextHeight;
      linkDistance = Math.min(160, Math.max(110, Math.min(width, height) * 0.18));
      const target = Math.round(Math.min(70, Math.max(22, (width * height) / 15000)));
      while (nodes.length < target) nodes.push(makeNode(width, height));
      if (nodes.length > target) nodes = nodes.slice(0, target);
      pulses = [];
    }

    function step(dt: number) {
      const margin = 24;
      for (const node of nodes) {
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        if (node.x < -margin) node.x = width + margin;
        else if (node.x > width + margin) node.x = -margin;
        if (node.y < -margin) node.y = height + margin;
        else if (node.y > height + margin) node.y = -margin;
      }
    }

    function spawnPulse() {
      const maxPulses = width < 640 ? 2 : 5;
      if (pulses.length >= maxPulses || nodes.length < 2) return;
      const from = Math.floor(Math.random() * nodes.length);
      const a = nodes[from]!;
      const near: number[] = [];
      nodes.forEach((b, i) => {
        if (i !== from && Math.hypot(a.x - b.x, a.y - b.y) < linkDistance) near.push(i);
      });
      if (near.length === 0) return;
      pulses.push({ from, to: near[Math.floor(Math.random() * near.length)]!, t: 0, speed: 0.45 + Math.random() * 0.35 });
    }

    function draw(time: number, animate: boolean) {
      ctx!.clearRect(0, 0, width, height);

      // Links, grouped into a few opacity buckets so each bucket is one stroke call.
      const buckets: number[][] = LINK_BUCKETS.map(() => []);
      const maxD2 = linkDistance * linkDistance;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD2) continue;
          const strength = 1 - Math.sqrt(d2) / linkDistance;
          const bucket = Math.min(LINK_BUCKETS.length - 1, Math.floor(strength * LINK_BUCKETS.length));
          buckets[bucket]!.push(a.x, a.y, b.x, b.y);
        }
      }
      ctx!.lineWidth = 1;
      buckets.forEach((segments, k) => {
        if (segments.length === 0) return;
        ctx!.strokeStyle = colors[0]!(LINK_BUCKETS[k]!);
        ctx!.beginPath();
        for (let s = 0; s < segments.length; s += 4) {
          ctx!.moveTo(segments[s]!, segments[s + 1]!);
          ctx!.lineTo(segments[s + 2]!, segments[s + 3]!);
        }
        ctx!.stroke();
      });

      // Gentle links to the pointer (desktop only).
      if (pointer.active) {
        const reach = linkDistance * 1.2;
        ctx!.beginPath();
        for (const node of nodes) {
          if (Math.hypot(node.x - pointer.x, node.y - pointer.y) < reach) {
            ctx!.moveTo(pointer.x, pointer.y);
            ctx!.lineTo(node.x, node.y);
          }
        }
        ctx!.strokeStyle = colors[1]!(0.14);
        ctx!.stroke();
      }

      // Nodes with a slow twinkle.
      for (const node of nodes) {
        const twinkle = animate ? 0.55 + 0.45 * Math.sin(time * 0.0012 + node.phase) : 0.8;
        const near = pointer.active && Math.hypot(node.x - pointer.x, node.y - pointer.y) < linkDistance;
        ctx!.globalAlpha = near ? 1 : twinkle;
        const size = near ? node.size * 1.3 : node.size;
        ctx!.drawImage(sprites[node.color]!, node.x - size / 2, node.y - size / 2, size, size);
      }

      // Signals travelling along links.
      for (const pulse of pulses) {
        const a = nodes[pulse.from];
        const b = nodes[pulse.to];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * pulse.t;
        const y = a.y + (b.y - a.y) * pulse.t;
        ctx!.globalAlpha = Math.sin(Math.PI * pulse.t);
        ctx!.drawImage(sprites[1]!, x - 9, y - 9, 18, 18);
      }
      ctx!.globalAlpha = 1;
    }

    function loop(time: number) {
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
      lastTime = time;
      step(dt);
      if (time - lastPulse > 650) {
        lastPulse = time;
        spawnPulse();
      }
      pulses = pulses.filter((pulse) => {
        pulse.t += pulse.speed * dt;
        const a = nodes[pulse.from];
        const b = nodes[pulse.to];
        return pulse.t < 1 && !!a && !!b && Math.hypot(a.x - b.x, a.y - b.y) < linkDistance * 1.2;
      });
      draw(time, true);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches) {
        pulses = [];
        pointer.active = false;
        draw(0, false); // static fallback
        return;
      }
      lastTime = 0;
      frame = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    }

    function onPointerMove(e: PointerEvent) {
      if (reducedMotion.matches) return;
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion.matches) draw(0, false);
    });
    observer.observe(canvas);
    resize();
    start();

    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", start);
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", start);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className={styles.orbBlue} />
      <div className={styles.orbViolet} />
      <div className={styles.orbCyan} />
      <div className={styles.grid} />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className={styles.vignette} />
    </div>
  );
}
