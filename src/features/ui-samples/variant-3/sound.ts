/*
 * Sound for Design Option 3: soft interface clicks and an optional airy ambient pad with sparse pings,
 * synthesised live with the Web Audio API (no audio files, nothing licensed). Modelled on Option 2's
 * sound, which the client liked, but a separate copy so the two designs stay independent; gentler here.
 * Off by default; only a click on the Sound switch turns it on.
 */

export type Sfx = "select" | "toggle" | "nav" | "confirm" | "error";

export interface SoundState {
  enabled: boolean; // clicks (and the ambient pad, if `ambient`) are on
  ambient: boolean; // the background pad, while sound is on
}

const SOUND_KEY = "ec-v3-sound";
const AMBIENT_KEY = "ec-v3-ambient";
const AMBIENT_LEVEL = 0.45;
const SERVER_STATE: SoundState = { enabled: false, ambient: true };

// Airy D major 9 pad, and soft pings above it.
const PAD_NOTES = [146.83, 220, 329.63, 369.99];
const PING_NOTES = [1174.66, 880, 1318.51, 1479.98];

function read(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function save(key: string, on: boolean) {
  try {
    sessionStorage.setItem(key, on ? "on" : "off");
  } catch {
    // Storage can be blocked; the switches still work for this page.
  }
}

function makeImpulse(ctx: BaseAudioContext, seconds: number) {
  const length = Math.round(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
  }
  return buffer;
}

class MinimalSound {
  private ctx: AudioContext | null = null;
  private sfxBus: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private pingBus: GainNode | null = null;
  private ambientBuilt = false;
  private pingTimer = 0;
  private suspendTimer = 0;
  private state: SoundState =
    typeof window === "undefined" ? SERVER_STATE : { enabled: false, ambient: read(AMBIENT_KEY) !== "off" };
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  getServerSnapshot = () => SERVER_STATE;

  /** Sound switch. Runs inside the click, which is what lets the browser start audio. */
  toggle() {
    if (this.state.enabled) {
      save(SOUND_KEY, false);
      this.disable();
    } else {
      save(SOUND_KEY, true);
      this.enable();
      this.play("confirm");
    }
  }

  toggleAmbient() {
    const ambient = !this.state.ambient;
    save(AMBIENT_KEY, ambient);
    this.set({ ambient });
    if (this.state.enabled) {
      if (ambient) this.startAmbient();
      else this.stopAmbient();
      this.play("toggle");
    }
  }

  /** Coming back within the same page session: resume only if sound was on and the visitor has interacted. */
  resumeIfWanted() {
    if (!this.state.enabled && read(SOUND_KEY) === "on" && navigator.userActivation?.hasBeenActive) this.enable();
  }

  /** Leaving the sample: fade out but keep the saved choice. */
  shutdown() {
    if (this.state.enabled) this.disable();
  }

  play(kind: Sfx) {
    const ctx = this.ctx;
    if (!this.state.enabled || !ctx) return;
    const t = ctx.currentTime + 0.005;
    switch (kind) {
      case "select":
        this.tone(t, 1320, 1760, 0.07, 0.04);
        this.tone(t + 0.04, 2640, 2640, 0.08, 0.012);
        break;
      case "toggle":
        this.tone(t, 990, 1180, 0.07, 0.035);
        break;
      case "nav":
        this.tone(t, 620, 880, 0.12, 0.05);
        break;
      case "confirm":
        [784, 1046.5, 1318.51].forEach((f, i) => this.tone(t + i * 0.075, f, f, 0.16, 0.035));
        break;
      case "error":
        this.tone(t, 330, 247, 0.16, 0.035);
        break;
    }
  }

  private set(patch: Partial<SoundState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  private enable() {
    const ctx = this.ensure();
    if (!ctx) return;
    window.clearTimeout(this.suspendTimer);
    void ctx.resume();
    this.set({ enabled: true });
    if (this.state.ambient) this.startAmbient();
  }

  private disable() {
    this.set({ enabled: false });
    this.stopAmbient();
    const ctx = this.ctx;
    if (!ctx) return;
    this.suspendTimer = window.setTimeout(() => {
      if (!this.state.enabled) void ctx.suspend();
    }, 900);
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();

    const master = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.ratio.value = 8;
    master.connect(limiter).connect(ctx.destination);

    // Clicks get a little room so they sound soft rather than sharp.
    const sfxBus = ctx.createGain();
    const room = ctx.createConvolver();
    room.buffer = makeImpulse(ctx, 0.6);
    const roomLevel = ctx.createGain();
    roomLevel.gain.value = 0.25;
    sfxBus.connect(master);
    sfxBus.connect(room).connect(roomLevel).connect(master);

    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(master);

    document.addEventListener("visibilitychange", () => {
      if (!this.state.enabled) return;
      if (document.hidden) void ctx.suspend();
      else void ctx.resume();
    });

    this.ctx = ctx;
    this.sfxBus = sfxBus;
    this.ambientGain = ambientGain;
    return ctx;
  }

  /** A short, soft sine tone gliding between two pitches. */
  private tone(when: number, from: number, to: number, dur: number, level: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(from, when);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, when + dur * 0.5);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(level, when + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(env).connect(this.sfxBus!);
    osc.start(when);
    osc.stop(when + dur + 0.02);
    osc.onended = () => env.disconnect();
  }

  private buildAmbient() {
    const ctx = this.ctx!;
    const bus = ctx.createGain();
    bus.connect(this.ambientGain!);

    // Pad: a sine and a soft triangle per note through a slowly breathing low-pass.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 350;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start();
    const pad = ctx.createGain();
    pad.gain.value = 0.05;
    filter.connect(pad).connect(bus);
    PAD_NOTES.forEach((freq, i) => {
      const voice = ctx.createGain();
      voice.gain.value = 0.5;
      const breathe = ctx.createOscillator();
      breathe.frequency.value = 0.035 + i * 0.012;
      const depth = ctx.createGain();
      depth.gain.value = 0.25;
      breathe.connect(depth).connect(voice.gain);
      breathe.start();
      voice.connect(filter);
      for (const [type, detune] of [
        ["sine", -5],
        ["triangle", 5],
      ] as const) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(voice);
        osc.start();
      }
    });

    // Sparse pings with echo and room.
    const pingBus = ctx.createGain();
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.4;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(ctx, 3);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    pingBus.connect(bus);
    pingBus.connect(delay).connect(feedback).connect(delay);
    delay.connect(bus);
    pingBus.connect(reverb).connect(wet).connect(bus);

    this.pingBus = pingBus;
    this.ambientBuilt = true;
  }

  private startAmbient() {
    if (!this.ctx) return;
    if (!this.ambientBuilt) this.buildAmbient();
    const gain = this.ambientGain!.gain;
    const now = this.ctx.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(AMBIENT_LEVEL, now + 3);
    this.schedulePings();
  }

  private stopAmbient() {
    window.clearTimeout(this.pingTimer);
    if (!this.ctx || !this.ambientGain) return;
    const gain = this.ambientGain.gain;
    const now = this.ctx.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + 0.7);
  }

  private schedulePings() {
    window.clearTimeout(this.pingTimer);
    const ping = () => {
      if (!this.state.enabled || !this.state.ambient || !this.ctx) return;
      if (!document.hidden) {
        const ctx = this.ctx;
        const t = ctx.currentTime + 0.02;
        const osc = ctx.createOscillator();
        osc.frequency.value = PING_NOTES[Math.floor(Math.random() * PING_NOTES.length)]!;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.025, t + 0.008);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
        osc.connect(env).connect(this.pingBus!);
        osc.start(t);
        osc.stop(t + 2.5);
        osc.onended = () => env.disconnect();
      }
      this.pingTimer = window.setTimeout(ping, 4000 + Math.random() * 3000);
    };
    this.pingTimer = window.setTimeout(ping, 1800);
  }
}

export const minimalSound = new MinimalSound();
