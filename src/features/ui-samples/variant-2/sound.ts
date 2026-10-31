/*
 * Sound for Design Option 2: short interface clicks and an optional ambient "command center" bed,
 * all synthesised live with the Web Audio API (no audio files, nothing licensed). Off by default;
 * only a click on the Sound button turns it on. Separate from Design Option 1's sound.
 */

export type Sfx = "select" | "toggle" | "nav" | "confirm" | "error";

export interface SoundState {
  enabled: boolean; // clicks (and ambient, if `ambient`) are on
  ambient: boolean; // the background bed, while sound is on
}

const SOUND_KEY = "ec-v2-sound";
const AMBIENT_KEY = "ec-v2-ambient";
const AMBIENT_LEVEL = 0.5;
const SERVER_STATE: SoundState = { enabled: false, ambient: true };

// Sonar-like pings (D dorian, high) for the ambient bed.
const PING_NOTES = [1174.66, 880, 1318.51, 987.77];

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
    // Storage can be blocked; the controls still work for this page.
  }
}

function makeImpulse(ctx: BaseAudioContext, seconds: number) {
  const length = Math.round(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
  }
  return buffer;
}

class CommandSound {
  private ctx: AudioContext | null = null;
  private sfxBus: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private pingBus: GainNode | null = null;
  private tickBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambientBuilt = false;
  private pingTimer = 0;
  private tickTimer = 0;
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

  /** Sound button. Runs inside the click, which is what lets the browser start audio. */
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

  /** Coming back within the same page session: resume only if sound was turned on and the visitor has interacted. */
  resumeIfWanted() {
    if (!this.state.enabled && read(SOUND_KEY) === "on" && navigator.userActivation?.hasBeenActive) this.enable();
  }

  /** Leaving the sample: fade everything out but keep the saved choice. */
  shutdown() {
    if (this.state.enabled) this.disable();
  }

  play(kind: Sfx) {
    const ctx = this.ctx;
    if (!this.state.enabled || !ctx) return;
    const t = ctx.currentTime + 0.005;
    switch (kind) {
      case "select":
        this.blip(t, 1500, 2300, 0.05, "triangle", 0.05);
        this.blip(t + 0.045, 2300, 2300, 0.07, "sine", 0.03);
        break;
      case "toggle":
        this.blip(t, 900, 1250, 0.06, "triangle", 0.045);
        break;
      case "nav":
        this.blip(t, 520, 860, 0.1, "sine", 0.07);
        this.tick(t, 0.02);
        break;
      case "confirm":
        [880, 1318.51, 1760].forEach((f, i) => this.blip(t + i * 0.07, f, f, 0.12, "sine", 0.045));
        break;
      case "error":
        this.blip(t, 240, 170, 0.18, "sawtooth", 0.025, 900);
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

    // Clicks get a tiny digital slap-back.
    const sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.9;
    const slap = ctx.createDelay(0.2);
    slap.delayTime.value = 0.06;
    const slapLevel = ctx.createGain();
    slapLevel.gain.value = 0.18;
    sfxBus.connect(master);
    sfxBus.connect(slap).connect(slapLevel).connect(master);

    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(master);

    const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    document.addEventListener("visibilitychange", () => {
      if (!this.state.enabled) return;
      if (document.hidden) void ctx.suspend();
      else void ctx.resume();
    });

    this.ctx = ctx;
    this.sfxBus = sfxBus;
    this.ambientGain = ambientGain;
    this.noise = noise;
    return ctx;
  }

  /** A short pitched click: oscillator gliding from one frequency to another with a fast decay. */
  private blip(when: number, from: number, to: number, dur: number, type: OscillatorType, level: number, lowpass?: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(from, when);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, when + dur * 0.6);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(level, when + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    let out: AudioNode = env;
    if (lowpass) {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = lowpass;
      env.connect(filter);
      out = filter;
    }
    osc.connect(env);
    out.connect(this.sfxBus!);
    osc.start(when);
    osc.stop(when + dur + 0.02);
    osc.onended = () => out.disconnect();
  }

  /** A tiny filtered-noise "data" tick. */
  private tick(when: number, level: number, bus: AudioNode = this.sfxBus!) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 3200 + Math.random() * 1600;
    band.Q.value = 6;
    const env = ctx.createGain();
    env.gain.setValueAtTime(level, when);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.012);
    src.connect(band).connect(env).connect(bus);
    src.start(when, Math.random() * 0.9, 0.02);
    src.onended = () => env.disconnect();
  }

  private buildAmbient() {
    const ctx = this.ctx!;
    const bus = ctx.createGain();
    bus.connect(this.ambientGain!);

    // Low drone: two detuned saws on D and A through a slowly breathing low-pass.
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 380;
    droneFilter.Q.value = 1.1;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 160;
    lfo.connect(lfoDepth).connect(droneFilter.frequency);
    lfo.start();
    const drone = ctx.createGain();
    drone.gain.value = 0.05;
    droneFilter.connect(drone).connect(bus);
    for (const [freq, detune] of [
      [73.42, -6],
      [73.42, 6],
      [110, -4],
      [110, 4],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(droneFilter);
      osc.start();
    }
    const sub = ctx.createOscillator();
    sub.frequency.value = 73.42;
    const subLevel = ctx.createGain();
    subLevel.gain.value = 0.05;
    sub.connect(subLevel).connect(bus);
    sub.start();

    // Sonar pings with echo and room.
    const pingBus = ctx.createGain();
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.36;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(ctx, 2.8);
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    pingBus.connect(bus);
    pingBus.connect(delay).connect(feedback).connect(delay);
    delay.connect(bus);
    pingBus.connect(reverb).connect(wet).connect(bus);

    // Quiet bursts of processing ticks.
    const tickBus = ctx.createGain();
    tickBus.gain.value = 0.8;
    tickBus.connect(bus);

    this.pingBus = pingBus;
    this.tickBus = tickBus;
    this.ambientBuilt = true;
  }

  private startAmbient() {
    if (!this.ctx) return;
    if (!this.ambientBuilt) this.buildAmbient();
    const gain = this.ambientGain!.gain;
    const now = this.ctx.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(AMBIENT_LEVEL, now + 2.5);
    this.schedulePings();
    this.scheduleTicks();
  }

  private stopAmbient() {
    window.clearTimeout(this.pingTimer);
    window.clearTimeout(this.tickTimer);
    if (!this.ctx || !this.ambientGain) return;
    const gain = this.ambientGain.gain;
    const now = this.ctx.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + 0.6);
  }

  private ambientOn() {
    return this.state.enabled && this.state.ambient && !!this.ctx && !document.hidden;
  }

  private schedulePings() {
    window.clearTimeout(this.pingTimer);
    const ping = () => {
      if (!this.state.enabled || !this.state.ambient) return;
      if (this.ambientOn()) {
        const ctx = this.ctx!;
        const t = ctx.currentTime + 0.02;
        const freq = PING_NOTES[Math.floor(Math.random() * PING_NOTES.length)]!;
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.035, t + 0.006);
        env.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
        osc.connect(env).connect(this.pingBus!);
        osc.start(t);
        osc.stop(t + 2.3);
        osc.onended = () => env.disconnect();
      }
      this.pingTimer = window.setTimeout(ping, 3200 + Math.random() * 1600);
    };
    this.pingTimer = window.setTimeout(ping, 1500);
  }

  private scheduleTicks() {
    window.clearTimeout(this.tickTimer);
    const burst = () => {
      if (!this.state.enabled || !this.state.ambient) return;
      if (this.ambientOn()) {
        const t = this.ctx!.currentTime + 0.02;
        const count = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) this.tick(t + i * (0.045 + Math.random() * 0.045), 0.02, this.tickBus!);
      }
      this.tickTimer = window.setTimeout(burst, 1400 + Math.random() * 2200);
    };
    this.tickTimer = window.setTimeout(burst, 900);
  }
}

export const commandSound = new CommandSound();
