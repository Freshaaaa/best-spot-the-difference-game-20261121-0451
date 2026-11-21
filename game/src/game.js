// game.js — the state machine: levels, timer, score, hints, screens.
// Owns the game state and wires input, rendering and audio together.
// The state shape:
//   { levels, levelIndex, level, found:Set, score, timeLeft, hintsLeft,
//     muted, status:'playing'|'complete'|'gameover'|'final',
//     markers:[{id,x,y,born}], hintDiff, wrong, lastTick }

import { LEVELS } from './differences.js';
import { drawPanel, drawMarkers, drawHintPulse, drawWrongMark, updateHud, showOverlay } from './render.js';
import { attachClicks, attachKeys } from './input.js';
import { playFound, playWrong, playHint, playWin, playClick, setMuted } from './audio.js';

const HINT_MS = 2000;

export function createGame(els) {
  const st = {
    levels: LEVELS,
    levelIndex: 0,
    level: LEVELS[0],
    found: new Set(),
    score: 0,
    timeLeft: LEVELS[0].timeLimit,
    hintsLeft: 3,
    muted: false,
    status: 'playing',
    markers: [],
    hintDiff: null,
    hintUntil: 0,
    wrong: null,
    lastTick: performance.now(),
    levelScore: 0,
  };

  function startLevel(idx) {
    st.levelIndex = idx;
    st.level = LEVELS[idx];
    st.found = new Set();
    st.timeLeft = st.level.timeLimit;
    st.hintsLeft = 3;
    st.status = 'playing';
    st.markers = [];
    st.hintDiff = null;
    st.wrong = null;
    st.levelScore = 0;
    st.lastTick = performance.now();
    drawPanel(els.leftCanvas, st.level, 0);
    drawPanel(els.rightCanvas, st.level, 1);
    showOverlay(els, null);
    updateHud(els, st);
  }

  function starsFor(timeLeft) {
    if (timeLeft > 90) return '★★★';
    if (timeLeft > 45) return '★★☆';
    return '★☆☆';
  }

  function completeLevel() {
    st.status = 'complete';
    const timeBonus = Math.round(st.timeLeft) * 5;
    st.levelScore = st.level.differences.length * 100 + timeBonus;
    st.score += st.levelScore;
    playWin();
    updateHud(els, st);
    showOverlay(els, 'complete', {
      stars: starsFor(st.timeLeft),
      total: st.level.differences.length,
      timeLeft: st.timeLeft,
      levelScore: st.levelScore,
      score: st.score,
      last: st.levelIndex === LEVELS.length - 1,
    });
  }

  function gameOver() {
    st.status = 'gameover';
    updateHud(els, st);
    showOverlay(els, 'gameover', {
      found: st.found.size,
      total: st.level.differences.length,
      levelName: st.level.name,
    });
  }

  function finalScreen() {
    st.status = 'final';
    const foundTotal = LEVELS.reduce((n, l) => n + l.differences.length, 0);
    showOverlay(els, 'final', { stars: '★★★', score: st.score, foundTotal });
  }

  function nextLevel() {
    if (st.levelIndex + 1 < LEVELS.length) {
      playClick();
      startLevel(st.levelIndex + 1);
    } else {
      finalScreen();
    }
  }

  function useHint() {
    if (st.status !== 'playing' || st.hintsLeft <= 0) return;
    const remaining = st.level.differences.filter((d) => !st.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    st.hintsLeft -= 1;
    st.hintDiff = pick;
    st.hintUntil = performance.now() + HINT_MS;
    playHint();
    updateHud(els, st);
  }

  function onEvent(ev) {
    if (ev.kind === 'found') {
      if (st.status !== 'playing' || st.found.has(ev.id)) return;
      st.found.add(ev.id);
      st.markers.push({ id: ev.id, x: ev.x, y: ev.y, born: performance.now() });
      st.score += 100;
      playFound();
      updateHud(els, st);
      if (st.found.size === st.level.differences.length) completeLevel();
    } else if (ev.kind === 'wrong') {
      if (st.status !== 'playing') return;
      st.wrong = { x: ev.x, y: ev.y, born: performance.now() };
      st.timeLeft = Math.max(0, st.timeLeft - 5); // a wrong click costs 5 seconds
      playWrong();
      updateHud(els, st);
    } else if (ev.kind === 'key') {
      if (ev.key === 'h') useHint();
      else if (ev.key === 'm') {
        st.muted = !st.muted;
        setMuted(st.muted);
        updateHud(els, st);
      } else if (ev.key === 'r') {
        if (st.status === 'final') {
          st.score = 0;
          startLevel(0);
        } else {
          startLevel(st.levelIndex);
        }
      } else if (ev.key === 'n') {
        if (st.status === 'complete') nextLevel();
      }
    }
  }

  function tick(now) {
    const dt = (now - st.lastTick) / 1000;
    st.lastTick = now;
    if (st.status === 'playing') {
      st.timeLeft -= dt;
      if (st.timeLeft <= 0) {
        st.timeLeft = 0;
        gameOver();
      }
      updateHud(els, st);
    }
    // redraw markers / hint / wrong marks every frame (cheap, keeps pop alive)
    drawPanel(els.leftCanvas, st.level, 0);
    drawPanel(els.rightCanvas, st.level, 1);
    drawMarkers(els.leftCanvas, st.markers, now);
    drawMarkers(els.rightCanvas, st.markers, now);
    if (st.hintDiff && now < st.hintUntil) {
      drawHintPulse(els.rightCanvas, st.hintDiff, now);
    } else if (st.hintDiff) {
      st.hintDiff = null;
    }
    if (st.wrong) drawWrongMark(els.rightCanvas, st.wrong, now);
    requestAnimationFrame(tick);
  }

  attachClicks(els.rightCanvas, () => st, onEvent);
  attachKeys(onEvent);
  els.hintButton.addEventListener('click', () => onEvent({ kind: 'key', key: 'h' }));
  els.muteButton.addEventListener('click', () => onEvent({ kind: 'key', key: 'm' }));
  els.restartButton.addEventListener('click', () => onEvent({ kind: 'key', key: 'r' }));
  els.overlayButton.addEventListener('click', () => {
    if (st.status === 'complete') nextLevel();
    else onEvent({ kind: 'key', key: 'r' });
  });

  return { st, startLevel, tick };
}

/**
 * Screenshot set-up from the URL (?shot=...): the maker takes the
 * screenshots with a real browser, and the query param stages the scene.
 *   ?shot=found3    level 1, first 3 differences already found
 *   ?shot=level2    level 2 in play
 *   ?shot=complete  level 1 complete screen
 *   ?shot=level3    level 3 in play
 */
export function applyShot(game, els) {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  const { st, startLevel } = game;
  if (shot === 'found3') {
    startLevel(0);
    const now = performance.now();
    st.level.differences.slice(0, 3).forEach((d, i) => {
      st.found.add(d.id);
      st.markers.push({ id: d.id, x: d.x, y: d.y, born: now - 300 - i * 60 });
    });
    st.score = 300;
    updateHud(els, st);
  } else if (shot === 'level2') {
    startLevel(1);
  } else if (shot === 'level3') {
    startLevel(2);
  } else if (shot === 'complete') {
    startLevel(0);
    const now = performance.now();
    st.level.differences.forEach((d, i) => {
      st.found.add(d.id);
      st.markers.push({ id: d.id, x: d.x, y: d.y, born: now - 300 - i * 30 });
    });
    st.timeLeft = 132;
    st.score = 800;
    st.levelScore = 800 + Math.round(st.timeLeft) * 5;
    st.score += st.levelScore;
    st.status = 'complete';
    updateHud(els, st);
    showOverlay(els, 'complete', {
      stars: '★★★',
      total: st.level.differences.length,
      timeLeft: st.timeLeft,
      levelScore: st.levelScore,
      score: st.score,
      last: false,
    });
  }
}
