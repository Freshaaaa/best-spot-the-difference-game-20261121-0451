// render.js — draws both panels, the found markers, the hint pulse,
// the wrong-click shake, and every HUD element (counter, timer bar,
// score, level name, buttons).

import { PANEL_SIZE } from './differences.js';
import { drawGarden, drawKitchen, drawStation, circle, line } from './scenes.js';

const SCENES = { garden: drawGarden, kitchen: drawKitchen, station: drawStation };

/** Draw one level's scene into a canvas (variant 0 = left, 1 = right). */
export function drawPanel(canvas, level, variant) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, PANEL_SIZE, PANEL_SIZE);
  SCENES[level.id](ctx, variant);
}

/**
 * Draw the found markers on a panel: a clean green circle with a check,
 * popping in over 250 ms. `markers` is [{id, x, y, born}] and `now` is
 * performance.now(). Markers are drawn on BOTH panels so the pair reads
 * as one solved difference.
 */
export function drawMarkers(canvas, markers, now) {
  const ctx = canvas.getContext('2d');
  for (const m of markers) {
    const age = now - m.born;
    const pop = age >= 250 ? 1 : 0.6 + 0.4 * (age / 250);
    const r = 26 * pop;
    ctx.strokeStyle = '#22a06b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(34,160,107,0.18)';
    ctx.beginPath();
    ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.fill();
    // check mark
    ctx.strokeStyle = '#22a06b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x - 11, m.y + 1);
    ctx.lineTo(m.x - 3, m.y + 9);
    ctx.lineTo(m.x + 12, m.y - 9);
    ctx.stroke();
  }
}

/** Draw the hint pulse: a golden ring that breathes around one difference. */
export function drawHintPulse(canvas, diff, now) {
  if (!diff) return;
  const ctx = canvas.getContext('2d');
  const t = (now % 900) / 900;
  const r = diff.r + 6 + Math.sin(t * Math.PI * 2) * 7;
  ctx.strokeStyle = 'rgba(247,201,72,0.95)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(247,201,72,0.16)';
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Draw the gentle "not a difference" X at a wrong click, fading fast. */
export function drawWrongMark(canvas, wrong, now) {
  if (!wrong) return;
  const age = now - wrong.born;
  if (age > 500) return;
  const alpha = 1 - age / 500;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = `rgba(231,76,60,${alpha})`;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const s = 10;
  line(ctx, wrong.x - s, wrong.y - s, wrong.x + s, wrong.y + s, `rgba(231,76,60,${alpha})`, 4);
  line(ctx, wrong.x + s, wrong.y - s, wrong.x - s, wrong.y + s, `rgba(231,76,60,${alpha})`, 4);
}

/** Format seconds as M:SS. */
export function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Refresh every HUD element from the state. Elements are looked up once
 * by id: levelName, foundCounter, scoreValue, timeText, timeFill,
 * hintButton, muteButton, levelDots.
 */
export function updateHud(els, st) {
  const level = st.level;
  els.levelName.textContent = `Level ${st.levelIndex + 1} — ${level.name}`;
  els.foundCounter.textContent = `Found ${st.found.size}/${level.differences.length}`;
  els.scoreValue.textContent = `Score ${st.score}`;
  els.timeText.textContent = fmtTime(st.timeLeft);
  const frac = Math.max(0, st.timeLeft / level.timeLimit);
  els.timeFill.style.width = `${frac * 100}%`;
  els.timeFill.style.background = frac > 0.5 ? '#22a06b' : frac > 0.25 ? '#f7a928' : '#e74c3c';
  els.hintButton.textContent = `Hint (${st.hintsLeft})  [H]`;
  els.hintButton.disabled = st.hintsLeft <= 0 || st.status !== 'playing';
  els.muteButton.textContent = st.muted ? 'Sound: Off  [M]' : 'Sound: On  [M]';
  els.levelDots.textContent = st.levels.map((l, i) => (i < st.levelIndex ? '●' : i === st.levelIndex ? '◉' : '○')).join(' ');
}

/** Show or hide the overlay screens (level complete / game over / final). */
export function showOverlay(els, kind, data) {
  const ov = els.overlay;
  const title = els.overlayTitle;
  const body = els.overlayBody;
  const btn = els.overlayButton;
  if (kind === null) {
    ov.style.display = 'none';
    return;
  }
  ov.style.display = 'flex';
  if (kind === 'complete') {
    title.textContent = `Level Complete! ${data.stars}`;
    body.innerHTML =
      `You found all ${data.total} differences with <b>${fmtTime(data.timeLeft)}</b> to spare.<br>` +
      `Level score: <b>${data.levelScore}</b> &nbsp;·&nbsp; Total score: <b>${data.score}</b>`;
    btn.textContent = data.last ? 'See Final Results  [N]' : 'Next Level  [N]';
  } else if (kind === 'gameover') {
    title.textContent = 'Time Up!';
    body.innerHTML =
      `You found <b>${data.found}</b> of ${data.total} differences in ${data.levelName}.<br>` +
      `Try again — the differences are still hiding in the same places.`;
    btn.textContent = 'Retry Level  [R]';
  } else if (kind === 'final') {
    title.textContent = `You Did It! ${data.stars}`;
    body.innerHTML =
      `All three scenes solved.<br>` +
      `Final score: <b>${data.score}</b> &nbsp;·&nbsp; Differences found: <b>${data.foundTotal}</b><br>` +
      `Thanks for playing Spot the Difference!`;
    btn.textContent = 'Play Again  [R]';
  }
}
