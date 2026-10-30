/*
 * Optional background sound for sign-up and onboarding: an original ambient pad with soft
 * "data" chimes, synthesised live with the Web Audio API (no audio files, no licensed music).
 *
 * It is off by default and only starts from a click on the sound button. The visitor's choice is
 * kept for the browser session, so sound carries on from sign-up into onboarding.
 */

const PREFERENCE_KEY = "ec-ambient-sound";
const LEVEL = 0.3; // master volume once faded in; the mix underneath stays well below full scale
const FADE_IN = 2.5; // seconds
const FADE_OUT = 0.6;
const CHORD_SECONDS = 14;

// Two chords the pad drifts between (A maj9 and F# m9), in Hz.
const CHORDS = [
  [110, 164.81, 246.94, 277.18, 415.3],
  [92.5, 138.59, 220, 277.18, 329.63],
];
// A major pentatonic, high up, for the chimes.
const CHIME_NOTES = [880, 987.77, 1108.73, 1318.51, 1479.98, 1760];

function readPreference() {
  try {
    return sessionStorage.getItem(PREFERENCE_KEY) === "on";
  } catch {
    return false;
  }
}

function savePreference(on: boolean) {
  try {
    sessionStorage.setItem(PREFERENCE_KEY, on ? "on" : "off");
  } catch {
    // Storage can be blocked (private mode); the toggle still works for this page.
  }
}

/** A short generated room reverb: exponentially decaying stereo noise. */
function makeImpulse(ctx: BaseAudioContext, seconds: number) {
  const length = Math.round(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6);
  }
  return buffer;
}

/** Slow sine LFO added on top of an AudioParam's base value. */
function modulate(ctx: BaseAudioContext, param: AudioParam, rate: number, depth: number) {
  const lfo = ctx.createOscillator();
  const amount = ctx.createGain();
  lfo.frequency.value = rate;
  amount.gain.value = depth;
  lfo.connect(amount).connect(param);
  lfo.start();
}

class AmbientSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private chimeBus: GainNode | null = null;
  private voices: OscillatorNode[][] = [];
  private chordIndex = 0;
  private playing = false;
  private chimeTimer = 0;
  private chordTimer = 0;
  private suspendTimer = 0;
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  isPlaying = () => this.playing;

  /** Sound button click. Running inside the click is what lets the browser start audio. */
  toggle() {
    savePreference(!this.playing);
    if (this.playing) this.stop();
    else this.start();
  }

  /**
   * Back on sign-up or onboarding: resume only if the visitor turned sound on earlier in this
   * session and has already interacted with this page, so the browser's autoplay rules hold.
   */
  resumeIfWanted() {
    if (!this.playing && readPreference() && navigator.userActivation?.hasBeenActive) this.start();
  }

  start() {
    const ctx = this.ensureGraph();
    if (!ctx || !this.master) return;
    window.clearTimeout(this.suspendTimer);
    this.playing = true;
    this.emit();
    void ctx.resume();
    this.rampTo(LEVEL, FADE_IN);
    this.scheduleChimes();
    this.scheduleChords();
  }

  /** Fades out, then suspends the audio context so nothing keeps running in the background. */
  stop() {
    if (!this.playing) return;
    this.playing = false;
    this.emit();
    window.clearTimeout(this.chimeTimer);
    window.clearTimeout(this.chordTimer);
    const ctx = this.ctx;
    if (!ctx) return;
    this.rampTo(0, FADE_OUT);
    this.suspendTimer = window.setTimeout(() => {
      if (!this.playing) void ctx.suspend();
    }, FADE_OUT * 1000 + 150);
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  private rampTo(value: number, seconds: number) {
    const gain = this.master!.gain;
    const now = this.ctx!.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(value, now + seconds);
  }

  private ensureGraph() {
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();

    // master -> gentle limiter -> speakers
    const master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -20;
    limiter.ratio.value = 6;
    master.connect(limiter).connect(ctx.destination);

    // Everything goes through a shared bus with some generated reverb.
    const bus = ctx.createGain();
    const reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(ctx, 3.2);
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    bus.connect(master);
    bus.connect(reverb).connect(wet).connect(master);

    // Pad: a sine and a triangle per note, slightly detuned, through a slowly sweeping low-pass.
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 700;
    padFilter.Q.value = 0.6;
    const padLevel = ctx.createGain();
    padLevel.gain.value = 0.5;
    padFilter.connect(padLevel).connect(bus);
    modulate(ctx, padFilter.frequency, 0.045, 320);

    this.voices = CHORDS[0]!.map((freq, i) => {
      const voice = ctx.createGain();
      voice.gain.value = 0.05;
      modulate(ctx, voice.gain, 0.03 + i * 0.013, 0.025); // each note breathes at its own pace
      voice.connect(padFilter);
      return [-7, 7].map((detune, k) => {
        const osc = ctx.createOscillator();
        osc.type = k === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(voice);
        osc.start();
        return osc;
      });
    });

    // Low sub note under the pad.
    const sub = ctx.createOscillator();
    sub.frequency.value = 55;
    const subLevel = ctx.createGain();
    subLevel.gain.value = 0.05;
    sub.connect(subLevel).connect(bus);
    sub.start();

    // Chimes with a soft, darkening echo.
    const chimeBus = ctx.createGain();
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.42;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const echo = ctx.createGain();
    echo.gain.value = 0.6;
    chimeBus.connect(bus);
    chimeBus.connect(delay).connect(tone);
    tone.connect(feedback).connect(delay);
    tone.connect(echo).connect(bus);

    // Never play to a hidden tab.
    document.addEventListener("visibilitychange", () => {
      if (!this.playing) return;
      if (document.hidden) void ctx.suspend();
      else void ctx.resume();
    });

    this.ctx = ctx;
    this.master = master;
    this.chimeBus = chimeBus;
    return ctx;
  }

  private chime(when: number, freq: number, level: number) {
    const ctx = this.ctx!;
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(level, when + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.2 - 0.6;
    envelope.connect(pan).connect(this.chimeBus!);

    const body = ctx.createOscillator();
    body.frequency.value = freq;
    body.connect(envelope);
    const overtone = ctx.createOscillator();
    overtone.frequency.value = freq * 2;
    const overtoneLevel = ctx.createGain();
    overtoneLevel.gain.value = 0.25;
    overtone.connect(overtoneLevel).connect(envelope);

    for (const osc of [body, overtone]) {
      osc.start(when);
      osc.stop(when + 2);
    }
    body.onended = () => pan.disconnect();
  }

  private scheduleChimes() {
    window.clearTimeout(this.chimeTimer);
    const tick = () => {
      if (!this.playing || !this.ctx) return;
      if (!document.hidden) {
        const now = this.ctx.currentTime + 0.05;
        const first = Math.floor(Math.random() * CHIME_NOTES.length);
        const count = Math.random() < 0.3 ? 3 : 1; // now and then a quick "processing" run
        for (let i = 0; i < count; i++) {
          this.chime(now + i * 0.12, CHIME_NOTES[(first + i * 2) % CHIME_NOTES.length]!, i === 0 ? 0.06 : 0.04);
        }
      }
      this.chimeTimer = window.setTimeout(tick, 2600 + Math.random() * 3600);
    };
    this.chimeTimer = window.setTimeout(tick, 1800);
  }

  private scheduleChords() {
    window.clearTimeout(this.chordTimer);
    const change = () => {
      if (!this.playing || !this.ctx) return;
      this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
      const now = this.ctx.currentTime;
      CHORDS[this.chordIndex]!.forEach((freq, i) => {
        this.voices[i]?.forEach((osc) => osc.frequency.setTargetAtTime(freq, now, 1.8));
      });
      this.chordTimer = window.setTimeout(change, CHORD_SECONDS * 1000);
    };
    this.chordTimer = window.setTimeout(change, CHORD_SECONDS * 1000);
  }
}

export const ambientSound = new AmbientSound();
