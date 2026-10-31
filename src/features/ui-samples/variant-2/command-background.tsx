"use client";

import * as React from "react";
import { readColor } from "@/components/ai-theme/neural-background";
import { cn } from "@/lib/utils";
import styles from "./command.module.css";

const LANE = 96; // spacing of the circuit lanes the data packets travel on
const ROW = 20; // line height of the binary columns
const MAX_DPR = 1.5;
const FRAME_MS = 32; // ~30fps

interface Packet {
  horizontal: boolean;
  lane: number; // y for horizontal packets, x for vertical ones
  pos: number;
  dir: 1 | -1;
  speed: number;
  trail: number;
  color: number;
}

interface BinaryColumn {
  x: number;
  offset: number;
  speed: number;
  strip: HTMLCanvasElement;
  rows: number;
  color: number;
  nextFlip: number;
}

const FLOATING = [
  { text: "{ }", left: "5%", top: "20%", size: "text-4xl", color: "text-(--v2-mint)", dur: 9, delay: 0 },
  { text: "</>", left: "88%", top: "13%", size: "text-3xl", color: "text-(--v2-ice)", dur: 11, delay: -3 },
  { text: "AI", left: "93%", top: "58%", size: "text-5xl", color: "text-(--v2-amber)", dur: 10, delay: -5 },
  { text: "TS", left: "3%", top: "66%", size: "text-3xl", color: "text-(--v2-ice)", dur: 12, delay: -2 },
  { text: "JS", left: "47%", top: "6%", size: "text-2xl", color: "text-(--v2-amber)", dur: 8, delay: -6 },
  { text: "01", left: "28%", top: "90%", size: "text-4xl", color: "text-(--v2-mint)", dur: 10, delay: -1 },
  { text: "=>", left: "72%", top: "88%", size: "text-3xl", color: "text-(--v2-mint)", dur: 9, delay: -4 },
  { text: "10110", left: "13%", top: "44%", size: "text-xl", color: "text-(--v2-amber)", dur: 13, delay: -7 },
] as const;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Command-center backdrop: a perspective grid floor, data packets running along circuit lanes
 * (junctions light up as they pass), scrolling binary columns at the edges, floating syntax, an
 * occasional scan beam and fine scanlines. Pauses in hidden tabs; one still frame for reduced motion.
 */
export function CommandBackground({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const font = getComputedStyle(canvas).fontFamily || "monospace";
    const colors = [readColor(canvas, "--v2-mint"), readColor(canvas, "--v2-amber"), readColor(canvas, "--v2-ice")];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastTime = 0;
    let packets: Packet[] = [];
    let columns: BinaryColumn[] = [];
    let junctionLayer: HTMLCanvasElement | null = null;
    let headSprites: HTMLCanvasElement[] = [];
    const lit = new Map<string, number>(); // junction -> glow (0..1)

    function makeHeadSprite(color: (a: number) => string) {
      const size = Math.ceil(24 * dpr);
      const sprite = document.createElement("canvas");
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext("2d")!;
      const r = size / 2;
      const g = sctx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, color(1));
      g.addColorStop(0.25, color(0.8));
      g.addColorStop(1, color(0));
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, size, size);
      return sprite;
    }

    function pickColor() {
      const r = Math.random();
      return r < 0.6 ? 0 : r < 0.85 ? 1 : 2;
    }

    function makePacket(): Packet {
      const horizontal = Math.random() < 0.55;
      const lanes = Math.max(1, Math.floor((horizontal ? height : width) / LANE));
      const dir = Math.random() < 0.5 ? 1 : -1;
      const span = horizontal ? width : height;
      return {
        horizontal,
        lane: (1 + Math.floor(Math.random() * lanes)) * LANE - LANE / 2,
        pos: dir === 1 ? -rand(0, span * 0.6) : span + rand(0, span * 0.6),
        dir,
        speed: rand(70, 160),
        trail: rand(70, 170),
        color: pickColor(),
      };
    }

    function renderJunctions() {
      junctionLayer = document.createElement("canvas");
      junctionLayer.width = Math.round(width * dpr);
      junctionLayer.height = Math.round(height * dpr);
      const jctx = junctionLayer.getContext("2d")!;
      jctx.scale(dpr, dpr);
      jctx.fillStyle = colors[0]!(0.16);
      for (let x = LANE / 2; x < width; x += LANE) for (let y = LANE / 2; y < height; y += LANE) jctx.fillRect(x - 1, y - 1, 2, 2);
    }

    function makeColumn(x: number): BinaryColumn {
      const rows = Math.ceil(height / ROW) + 1;
      const strip = document.createElement("canvas");
      strip.width = Math.ceil(22 * dpr);
      strip.height = Math.ceil(rows * ROW * dpr);
      const column: BinaryColumn = { x, offset: rand(0, rows * ROW), speed: rand(10, 28), strip, rows, color: Math.random() < 0.5 ? 0 : 1, nextFlip: 0 };
      const sctx = strip.getContext("2d")!;
      sctx.scale(dpr, dpr);
      for (let r = 0; r < rows; r++) drawDigit(column, r);
      return column;
    }

    function drawDigit(column: BinaryColumn, row: number) {
      const sctx = column.strip.getContext("2d")!;
      sctx.clearRect(0, row * ROW, 22, ROW);
      sctx.font = `14px ${font}`;
      sctx.textBaseline = "middle";
      sctx.fillStyle = colors[column.color]!(Math.random() < 0.15 ? 0.75 : 0.3);
      sctx.fillText(Math.random() < 0.5 ? "0" : "1", 4, row * ROW + ROW / 2);
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      headSprites = colors.map(makeHeadSprite);
      renderJunctions();
      packets = Array.from({ length: width < 640 ? 5 : width < 1200 ? 9 : 13 }, makePacket);
      // Binary columns sit in the outer margin only, clear of the page content.
      const perSide = width >= 1400 ? 2 : 1;
      columns = [];
      for (let i = 0; i < perSide; i++) {
        columns.push(makeColumn(4 + i * 22));
        columns.push(makeColumn(width - 26 - i * 22));
      }
      lit.clear();
    }

    function step(dt: number, time: number) {
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i]!;
        const before = p.pos;
        p.pos += p.dir * p.speed * dt;
        // Light up any junction the head just crossed.
        const a = Math.min(before, p.pos);
        const b = Math.max(before, p.pos);
        const first = Math.ceil((a - LANE / 2) / LANE);
        for (let k = first; LANE / 2 + k * LANE <= b; k++) {
          const at = LANE / 2 + k * LANE;
          lit.set(p.horizontal ? `${at},${p.lane}` : `${p.lane},${at}`, 1);
        }
        const span = p.horizontal ? width : height;
        if ((p.dir === 1 && p.pos - p.trail > span) || (p.dir === -1 && p.pos + p.trail < 0)) packets[i] = makePacket();
      }
      for (const [key, glow] of lit) {
        const next = glow - dt * 0.9;
        if (next <= 0) lit.delete(key);
        else lit.set(key, next);
      }
      for (const column of columns) {
        column.offset = (column.offset + column.speed * dt) % (column.rows * ROW);
        if (time > column.nextFlip) {
          column.nextFlip = time + rand(120, 420);
          drawDigit(column, Math.floor(Math.random() * column.rows));
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      if (junctionLayer) ctx!.drawImage(junctionLayer, 0, 0, width, height);

      // Binary columns, scrolling down and wrapping.
      for (const column of columns) {
        const h = column.rows * ROW;
        ctx!.drawImage(column.strip, column.x, column.offset - h, 22, h);
        ctx!.drawImage(column.strip, column.x, column.offset, 22, h);
      }

      // Lit junctions.
      for (const [key, glow] of lit) {
        const [x, y] = key.split(",").map(Number) as [number, number];
        ctx!.fillStyle = colors[0]!(0.85 * glow);
        ctx!.fillRect(x - 2.5, y - 2.5, 5, 5);
      }

      // Packets: a fading trail and a glowing head.
      ctx!.lineWidth = 1.5;
      for (const p of packets) {
        const head = p.pos;
        const tail = p.pos - p.dir * p.trail;
        const [hx, hy, tx, ty] = p.horizontal ? [head, p.lane, tail, p.lane] : [p.lane, head, p.lane, tail];
        const gradient = ctx!.createLinearGradient(tx, ty, hx, hy);
        gradient.addColorStop(0, colors[p.color]!(0));
        gradient.addColorStop(1, colors[p.color]!(0.85));
        ctx!.strokeStyle = gradient;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty);
        ctx!.lineTo(hx, hy);
        ctx!.stroke();
        ctx!.drawImage(headSprites[p.color]!, hx - 12, hy - 12, 24, 24);
      }
    }

    function loop(time: number) {
      frame = requestAnimationFrame(loop);
      if (lastTime && time - lastTime < FRAME_MS) return;
      const dt = lastTime ? Math.min(0.08, (time - lastTime) / 1000) : 0;
      lastTime = time;
      step(dt, time);
      draw();
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches) {
        draw(); // still frame
        return;
      }
      lastTime = 0;
      frame = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion.matches) draw();
    });
    observer.observe(canvas);
    resize();
    start();
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className={styles.floor}>
        <div className={styles.floorGrid} />
      </div>
      <div className={styles.horizon} />
      <canvas ref={canvasRef} className="absolute inset-0 size-full font-mono" />
      {FLOATING.map((item) => (
        <span
          key={item.text}
          className={cn(styles.display, styles.float, "absolute hidden font-semibold opacity-25 md:block", item.size, item.color)}
          style={{ left: item.left, top: item.top, "--float-dur": `${item.dur}s`, "--float-delay": `${item.delay}s` } as React.CSSProperties}
        >
          {item.text}
        </span>
      ))}
      <div className={styles.beam} />
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
    </div>
  );
}
