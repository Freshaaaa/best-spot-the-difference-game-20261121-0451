// audio.js — every sound is synthesized with the Web Audio API.
// No audio files, no network. Mute is a single flag the game toggles.

let ctx = null;
let muted = false;

export function setMuted(m) {
  muted = m;
}

export function isMuted() {
  return muted;
}

function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, startAt, dur, type, vol) {
  const ac = audioCtx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFound() {
  tone(659.25, 0, 0.18, 'sine', 0.25);
  tone(880, 0.09, 0.3, 'sine', 0.25);
}

/** A soft low thud for a wrong click. */
export function playWrong() {
  tone(160, 0, 0.16, 'triangle', 0.18);
  tone(110, 0.05, 0.2, 'triangle', 0.12);
}

/** A shimmer when a hint fires. */
export function playHint() {
  tone(1046.5, 0, 0.25, 'sine', 0.12);
  tone(1318.5, 0.08, 0.3, 'sine', 0.1);
}

/** A little arpeggio when a level is complete. */
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone(f, i * 0.11, 0.28, 'sine', 0.22));
}

/** A soft tick for button clicks. */
export function playClick() {
  tone(1200, 0, 0.06, 'sine', 0.08);
}
