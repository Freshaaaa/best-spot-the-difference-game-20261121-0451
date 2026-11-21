// input.js — mouse clicks on the right panel and keyboard shortcuts.
// Converts a click to panel coordinates and hands the game a clean event:
//   { kind: 'found', id } when a difference is hit,
//   { kind: 'wrong', x, y } when the click lands on nothing,
//   { kind: 'key', key } for the shortcuts H / R / N / M.

import { PANEL_SIZE } from './differences.js';

/**
 * Attach the click handler to the RIGHT canvas. `onEvent` receives the
 * events described above. `getState` returns the live game state (level,
 * found set, status) so clicks are ignored when the game is not playing.
 */
export function attachClicks(rightCanvas, getState, onEvent) {
  rightCanvas.addEventListener('click', (ev) => {
    const st = getState();
    if (st.status !== 'playing') return;
    const rect = rightCanvas.getBoundingClientRect();
    const scaleX = PANEL_SIZE / rect.width;
    const scaleY = PANEL_SIZE / rect.height;
    const x = (ev.clientX - rect.left) * scaleX;
    const y = (ev.clientY - rect.top) * scaleY;
    const level = st.level;
    let best = null;
    let bestD = Infinity;
    for (const d of level.differences) {
      if (st.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= d.r && dist < bestD) {
        best = d;
        bestD = dist;
      }
    }
    if (best) {
      onEvent({ kind: 'found', id: best.id, x: best.x, y: best.y });
    } else {
      onEvent({ kind: 'wrong', x, y });
    }
  });
}

/** Keyboard shortcuts: H hint, R restart level, N next level, M mute. */
export function attachKeys(onEvent) {
  window.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    const key = ev.key.toLowerCase();
    if (key === 'h' || key === 'r' || key === 'n' || key === 'm') {
      onEvent({ kind: 'key', key });
    }
  });
}
