"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { readColor } from "./neural-background";
import styles from "./ai-theme.module.css";

const TOKENS = ["{}", "</>", "()", "=>", "&&", "AI", "JS", "TS", "0", "1", "01", "10101", "[]", "!=", "fn()", "0x1F", "||", "===", "<T>", "async", "await", "λ", "//", "0110"];
const CODE_LINES = [
  "const you = new Engineer();",
  "await mentor.review(code);",
  "path.compile({ modules: 6 });",
  "if (ready) interview.start();",
  "judge.run(tests); // 12/12",
  "for (const skill of plan) {",
  'git commit -m "level up"',
  "return offer;",
];
const STREAM_GLYPHS = "01010110ABCDEF{}<>=;";
const TOKEN_SIZES = [11, 13, 13, 16, 19];
const CELL = 18; // vertical spacing of stream glyphs
const LINE_FONT = 11.5;
const MAX_DPR = 1.5;
const FRAME_MS = 32; // ~30fps is plenty for slow-moving code and halves the drawing work

interface Sprite {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
}

interface Stream {
  x: number;
  y: number; // head position
  speed: number;
  glyphs: number[];
  tint: number; // 0 blue, 1 violet
  strip: HTMLCanvasElement | null; // the fading tail, pre-rendered and redrawn only when a glyph changes
  dirty: boolean;
}

interface Token {
  x: number;
  y: number;
  vy: number;
  sway: number;
  swayRate: number;
  phase: number;
  alpha: number;
  sprite: string;
}

interface TypedLine {
  text: string;
  x: number;
  y: number;
  age: number; // seconds since it started typing
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)]!;

/** Text drawn once to a small canvas (with an optional glow) and reused every frame. */
function makeTextSprite(text: string, px: number, font: string, fill: string, glow: string | null, dpr: number): Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const pad = glow ? 8 : 2;
  ctx.font = `${px}px ${font}`;
  const w = Math.ceil(ctx.measureText(text).width + pad * 2);
  const h = Math.ceil(px * 1.4 + pad * 2);
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  ctx.scale(dpr, dpr);
  ctx.font = `${px}px ${font}`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = fill;
  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = 8;
  }
  ctx.fillText(text, pad, h / 2);
  return { canvas, w, h };
}

/**
 * Coding layer for sign-up and onboarding, drawn above the neural network: sparse falling
 * data streams, drifting code symbols and binary, short code lines typed out in the empty side
 * gutters, a panning grid and a slow scan line. The canvas is dimmed in the middle so the form
 * stays readable. Pauses in hidden tabs and draws one still frame for reduced motion.
 */
export function CodeBackground({ contentWidth = 1152 }: { contentWidth?: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contentWidthRef = React.useRef(contentWidth);

  React.useEffect(() => {
    contentWidthRef.current = contentWidth;
  }, [contentWidth]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const font = getComputedStyle(canvas).fontFamily || "monospace";
    const blue = readColor(canvas, "--ec-blue");
    const cyan = readColor(canvas, "--ec-cyan");
    const violet = readColor(canvas, "--ec-violet");
    const tokenColors = [blue, cyan, violet];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastTime = 0;
    let nextLineAt = 0;
    let disposed = false;
    let glyphs: { head: Sprite[]; body: Sprite[][] } = { head: [], body: [] };
    const tokenSprites = new Map<string, Sprite>();
    let streams: Stream[] = [];
    let tokens: Token[] = [];
    let lines: TypedLine[] = [];

    function buildGlyphs() {
      const chars = [...STREAM_GLYPHS];
      glyphs = {
        head: chars.map((c) => makeTextSprite(c, 13, font, cyan(0.95), cyan(0.9), dpr)),
        body: [blue, violet].map((tint) => chars.map((c) => makeTextSprite(c, 13, font, tint(1), null, dpr))),
      };
      tokenSprites.clear();
      for (const s of streams) s.dirty = true;
    }

    /** Draws a stream's tail (every glyph but the head) into its strip, fading towards the top. */
    function renderStrip(s: Stream) {
      const body = glyphs.body[s.tint]!;
      const w = body[0]!.w;
      const tail = s.glyphs.length - 1;
      s.strip ??= document.createElement("canvas");
      const strip = s.strip;
      const pw = Math.ceil(w * dpr);
      const ph = Math.ceil(tail * CELL * dpr);
      if (strip.width !== pw || strip.height !== ph) {
        strip.width = pw;
        strip.height = ph;
      }
      const sctx = strip.getContext("2d")!;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, w, tail * CELL);
      for (let k = 1; k <= tail; k++) {
        const sprite = body[s.glyphs[k]!]!;
        sctx.globalAlpha = 0.34 * (1 - k / s.glyphs.length);
        sctx.drawImage(sprite.canvas, 0, (tail - k + 0.5) * CELL - sprite.h / 2, sprite.w, sprite.h);
      }
      s.dirty = false;
    }

    function tokenSprite(key: string) {
      let sprite = tokenSprites.get(key);
      if (!sprite) {
        const [text, size, color] = key.split("\u0000");
        const tint = tokenColors[Number(color)]!;
        sprite = makeTextSprite(text!, Number(size), font, tint(1), tint(0.8), dpr);
        tokenSprites.set(key, sprite);
      }
      return sprite;
    }

    function makeStream(fromTop: boolean): Stream {
      const columns = Math.max(1, Math.floor(width / CELL));
      const length = Math.round(rand(6, 14));
      return {
        x: Math.floor(Math.random() * columns) * CELL + CELL / 2,
        y: fromTop ? -rand(0, 240) : rand(0, height + length * CELL),
        speed: rand(28, 70),
        glyphs: Array.from({ length }, () => Math.floor(Math.random() * STREAM_GLYPHS.length)),
        tint: Math.random() < 0.7 ? 0 : 1,
        strip: null,
        dirty: true,
      };
    }

    function makeToken(anywhere: boolean): Token {
      const color = Math.random() < 0.45 ? 0 : Math.random() < 0.6 ? 1 : 2;
      return {
        x: rand(10, Math.max(20, width - 40)),
        y: anywhere ? rand(0, height) : height + rand(10, 60),
        vy: -rand(8, 22),
        sway: rand(4, 12),
        swayRate: rand(0.2, 0.5),
        phase: rand(0, Math.PI * 2),
        alpha: rand(0.22, 0.5),
        sprite: [pick(TOKENS), pick(TOKEN_SIZES), color].join("\u0000"),
      };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      if (nextDpr !== dpr || glyphs.head.length === 0) {
        dpr = nextDpr;
        buildGlyphs();
      }
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = width < 640;
      const streamCount = Math.round(Math.min(small ? 6 : 14, Math.max(5, width / 120)));
      const tokenCount = Math.round(Math.min(small ? 10 : 22, Math.max(8, (width * height) / 55000)));
      streams = Array.from({ length: streamCount }, () => makeStream(false));
      tokens = Array.from({ length: tokenCount }, () => makeToken(true));
      lines = [];
    }

    /** Free space beside the page content; code lines are only typed where they cannot cover it. */
    function spawnLine() {
      const gutter = (width - contentWidthRef.current) / 2 - 24;
      if (gutter < 150 || lines.length >= 3) return;
      ctx!.font = `${LINE_FONT}px ${font}`;
      const text = pick(CODE_LINES.filter((t) => !lines.some((l) => l.text === t)));
      const textWidth = ctx!.measureText(`> ${text}`).width;
      if (textWidth > gutter - 8) return;
      const left = Math.random() < 0.5;
      const x = left ? rand(16, gutter - textWidth) : rand(width - gutter, width - 16 - textWidth);
      const y = rand(96, height - 72);
      const crowded = lines.some((l) => Math.abs(l.y - y) < 48 && Math.abs(l.x - x) < gutter);
      if (!crowded) lines.push({ text, x, y, age: 0 });
    }

    function step(dt: number, time: number) {
      for (const s of streams) {
        s.y += s.speed * dt;
        if (Math.random() < dt * 4) {
          s.glyphs[Math.floor(Math.random() * s.glyphs.length)] = Math.floor(Math.random() * STREAM_GLYPHS.length);
          s.dirty = true;
        }
        if (s.y - s.glyphs.length * CELL > height) Object.assign(s, makeStream(true), { strip: s.strip });
      }
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i]!;
        t.y += t.vy * dt;
        if (t.y < -40) tokens[i] = makeToken(false);
      }
      for (const line of lines) line.age += dt;
      lines = lines.filter((l) => l.age < l.text.length / 22 + 3.4);
      if (time > nextLineAt) {
        nextLineAt = time + rand(1200, 2600);
        spawnLine();
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);

      // Data streams: bright head plus the pre-rendered fading tail (two draws per stream).
      for (const s of streams) {
        if (s.dirty || !s.strip) renderStrip(s);
        const tail = s.glyphs.length - 1;
        const w = glyphs.body[s.tint]![0]!.w;
        ctx!.globalAlpha = 1;
        ctx!.drawImage(s.strip!, s.x - w / 2, s.y - (tail + 0.5) * CELL, w, tail * CELL);
        const head = glyphs.head[s.glyphs[0]!]!;
        ctx!.globalAlpha = 0.75;
        ctx!.drawImage(head.canvas, s.x - head.w / 2, s.y - head.h / 2, head.w, head.h);
      }

      // Drifting symbols and binary, faded near the top and bottom edges.
      for (const t of tokens) {
        const sprite = tokenSprite(t.sprite);
        const edge = Math.max(0, Math.min(1, t.y / 120, (height - t.y) / 120));
        const breathe = 0.75 + 0.25 * Math.sin(time * 0.0009 + t.phase);
        ctx!.globalAlpha = t.alpha * edge * breathe;
        const x = t.x + Math.sin(time * 0.001 * t.swayRate + t.phase) * t.sway;
        ctx!.drawImage(sprite.canvas, x, t.y, sprite.w, sprite.h);
      }

      // Terminal-style lines: typed, held, then faded out.
      ctx!.font = `${LINE_FONT}px ${font}`;
      ctx!.textBaseline = "middle";
      for (const line of lines) {
        const typed = Math.min(line.text.length, Math.floor(line.age * 22));
        const holdEnd = line.text.length / 22 + 2.4;
        const alpha = line.age > holdEnd ? Math.max(0, 1 - (line.age - holdEnd)) : 1;
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = cyan(0.75);
        ctx!.fillText(">", line.x, line.y);
        const prompt = ctx!.measureText("> ").width;
        const shown = line.text.slice(0, typed);
        ctx!.fillStyle = blue(0.6);
        ctx!.fillText(shown, line.x + prompt, line.y);
        if (Math.floor(time / 450) % 2 === 0 || typed < line.text.length) {
          ctx!.fillStyle = cyan(0.7);
          ctx!.fillRect(line.x + prompt + ctx!.measureText(shown).width + 2, line.y - 6, 6, 12);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop(time: number) {
      frame = requestAnimationFrame(loop);
      if (lastTime && time - lastTime < FRAME_MS) return;
      const dt = lastTime ? Math.min(0.08, (time - lastTime) / 1000) : 0;
      lastTime = time;
      step(dt, time);
      draw(time);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches) {
        lines = [];
        draw(0); // static fallback
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
      if (reducedMotion.matches) draw(0);
    });
    observer.observe(canvas);
    resize();
    start();

    // The mono web font may finish loading after the first frame; redraw the glyphs with it.
    void document.fonts?.ready.then(() => {
      if (disposed) return;
      buildGlyphs();
      if (reducedMotion.matches) draw(0);
    });

    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", start);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className={styles.codeGrid} />
      <canvas ref={canvasRef} className={cn(styles.codeCanvas, "absolute inset-0 size-full font-mono")} />
      <div className={styles.scanLine} />
    </motion.div>
  );
}
