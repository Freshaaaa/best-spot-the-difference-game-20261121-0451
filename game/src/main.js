// main.js — bootstrap: grab the DOM, build the game, start the loop.

import { createGame, applyShot } from './game.js';

const els = {
  leftCanvas: document.getElementById('leftPanel'),
  rightCanvas: document.getElementById('rightPanel'),
  levelName: document.getElementById('levelName'),
  foundCounter: document.getElementById('foundCounter'),
  scoreValue: document.getElementById('scoreValue'),
  timeText: document.getElementById('timeText'),
  timeFill: document.getElementById('timeFill'),
  hintButton: document.getElementById('hintButton'),
  muteButton: document.getElementById('muteButton'),
  restartButton: document.getElementById('restartButton'),
  levelDots: document.getElementById('levelDots'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlayTitle'),
  overlayBody: document.getElementById('overlayBody'),
  overlayButton: document.getElementById('overlayButton'),
};

const game = createGame(els);
applyShot(game, els);
requestAnimationFrame(game.tick);
