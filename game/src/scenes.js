// scenes.js — the three hand-drawn scenes, all Canvas 2D, no image files.
// Each scene draws into a 520 x 520 panel. variant 0 is the ORIGINAL (left
// panel); variant 1 is the CHANGED panel (right), with every difference
// applied. The differences are wired to the ids in differences.js.

export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function petalFlower(ctx, x, y, petal, center, size) {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ellipse(ctx, x + Math.cos(a) * size * 0.7, y + Math.sin(a) * size * 0.7, size * 0.55, size * 0.55, petal);
  }
  circle(ctx, x, y, size * 0.5, center);
}

function cloud(ctx, x, y, s) {
  ellipse(ctx, x, y, 34 * s, 20 * s, '#ffffff');
  ellipse(ctx, x - 22 * s, y + 6 * s, 22 * s, 14 * s, '#ffffff');
  ellipse(ctx, x + 24 * s, y + 6 * s, 24 * s, 15 * s, '#ffffff');
  ellipse(ctx, x + 4 * s, y - 12 * s, 20 * s, 14 * s, '#f4f8ff');
}

function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
  ctx.stroke();
}

function butterfly(ctx, x, y, s, wing) {
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.ellipse(x - 9 * s, y - 4 * s, 10 * s, 7 * s, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 9 * s, y - 4 * s, 10 * s, 7 * s, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5b4636';
  ellipse(ctx, x, y, 3 * s, 9 * s, '#5b4636');
}

function bee(ctx, x, y, s) {
  ellipse(ctx, x, y, 9 * s, 7 * s, '#f7c948');
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(x - 3 * s, y - 6 * s);
  ctx.lineTo(x - 3 * s, y + 6 * s);
  ctx.moveTo(x + 3 * s, y - 6 * s);
  ctx.lineTo(x + 3 * s, y + 6 * s);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ellipse(ctx, x - 2 * s, y - 9 * s, 6 * s, 4 * s, 'rgba(255,255,255,0.75)');
}

// ---------------------------------------------------------------- garden

export function drawGarden(ctx, variant) {
  const W = 520;
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#8ec9ee');
  sky.addColorStop(0.7, '#bfe3f7');
  sky.addColorStop(1, '#fdf3c9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 320);
  // sun with rays
  ctx.fillStyle = '#ffd93b';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.4;
    line(ctx, 432 + Math.cos(a) * 44, 72 + Math.sin(a) * 44, 432 + Math.cos(a) * 58, 72 + Math.sin(a) * 58, '#ffd93b', 5);
  }
  circle(ctx, 432, 72, 36, '#ffd93b');
  circle(ctx, 432, 72, 28, '#ffe98a');
  // clouds (one missing on the right)
  cloud(ctx, 152, 82, 1);
  cloud(ctx, 268, 52, 0.8);
  if (variant === 0) cloud(ctx, 60, 140, 0.7);
  cloud(ctx, 360, 130, 0.9);
  // birds (one extra on the right)
  bird(ctx, 120, 130, 1);
  bird(ctx, 220, 100, 0.9);
  if (variant === 1) bird(ctx, 352, 92, 1);
  // hills
  ellipse(ctx, 110, 330, 190, 60, '#7cc46a');
  ellipse(ctx, 400, 335, 200, 64, '#68b357');
  ellipse(ctx, 260, 345, 180, 55, '#8ed07e');
  // grass field
  rect(ctx, 0, 320, W, 200, '#79c25f');
  // grass strokes
  ctx.strokeStyle = '#5da84a';
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const gx = (i * 137) % 520;
    const gy = 340 + ((i * 89) % 170);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 3, gy - 9);
    ctx.stroke();
  }
  // trees
  tree(ctx, 62, 250, 1);
  tree(ctx, 462, 235, 0.9);
  // birdhouse on a pole
  rect(ctx, 96, 268, 6, 62, '#8a6b46');
  rect(ctx, 78, 246, 42, 26, '#c96f4a');
  ctx.beginPath();
  ctx.moveTo(74, 246);
  ctx.lineTo(99, 228);
  ctx.lineTo(124, 246);
  ctx.closePath();
  ctx.fillStyle = '#a34d33';
  ctx.fill();
  circle(ctx, 99, 259, 6, '#5b3a24');
  // fence (one post missing on the right)
  rect(ctx, 0, 322, W, 8, '#b08954');
  rect(ctx, 0, 342, W, 8, '#b08954');
  for (let i = 0; i < 9; i++) {
    const px = 18 + i * 62;
    if (variant === 1 && i === 4) continue; // missing post
    rect(ctx, px, 308, 10, 52, '#c9a06b');
    circle(ctx, px + 5, 308, 5, '#c9a06b');
  }
  // stone path
  for (let i = 0; i < 5; i++) {
    ellipse(ctx, 250 + (i % 2 === 0 ? -8 : 10), 360 + i * 30, 26, 12, '#d9d2c4');
  }
  // pond with lily pads and a frog
  ellipse(ctx, 262, 472, 118, 46, '#5fb3d9');
  ellipse(ctx, 262, 472, 100, 36, '#7cc6e6');
  ellipse(ctx, 210, 462, 22, 10, '#4da34d');
  ellipse(ctx, 300, 482, 20, 9, '#4da34d');
  ellipse(ctx, 262, 488, 16, 7, '#5cb85c');
  circle(ctx, 330, 452, 12, '#5aa843');
  circle(ctx, 322, 442, 5, '#ffffff');
  circle(ctx, 338, 442, 5, '#ffffff');
  circle(ctx, 322, 442, 2.5, '#222');
  circle(ctx, 338, 442, 2.5, '#222');
  // flower bed — many flowers
  const flowers = [
    [60, 388, '#e74c3c', 10], [118, 388, '#e74c3c', 10], [160, 396, '#f7c948', 9],
    [205, 402, '#f7c948', 9], [250, 392, '#e78ac3', 10], [300, 400, '#ffffff', 9],
    [345, 390, '#9b59b6', 10], [395, 398, '#e74c3c', 9], [450, 388, '#f7c948', 10],
    [90, 420, '#e78ac3', 9], [150, 424, '#ffffff', 9], [230, 424, '#e74c3c', 10],
    [285, 420, '#f7c948', 9], [330, 426, '#e78ac3', 10], [420, 424, '#9b59b6', 9],
    [470, 420, '#e74c3c', 9], [55, 452, '#f7c948', 9], [110, 452, '#9b59b6', 10],
    [180, 452, '#e78ac3', 9], [380, 452, '#ffffff', 9], [440, 452, '#e74c3c', 10],
  ];
  for (const [fx, fy, col, fs] of flowers) {
    if (variant === 1 && fx === 118 && fy === 388) continue; // missing red flower
    const petal = variant === 1 && fx === 205 && fy === 402 ? '#e78ac3' : col; // yellow -> pink
    line(ctx, fx, fy + 8, fx, fy + 26, '#3e8e41', 3);
    petalFlower(ctx, fx, fy, petal, '#f7c948', fs);
  }
  // flower pots
  pot(ctx, 40, 470, '#c96f4a');
  pot(ctx, 480, 470, '#c96f4a');
  // watering can (green left, blue right)
  const canCol = variant === 0 ? '#4da34d' : '#3b7fd4';
  rect(ctx, 388, 408, 34, 26, canCol);
  ctx.beginPath();
  ctx.moveTo(388, 414);
  ctx.lineTo(372, 400);
  ctx.lineTo(372, 424);
  ctx.closePath();
  ctx.fillStyle = canCol;
  ctx.fill();
  line(ctx, 422, 410, 436, 398, canCol, 5);
  // butterflies (one missing on the right)
  butterfly(ctx, 282, 252, 1, '#e78ac3');
  if (variant === 0) butterfly(ctx, 340, 210, 0.9, '#7fb3e8');
  butterfly(ctx, 90, 300, 0.8, '#f7c948');
  // bees (one missing on the right)
  bee(ctx, 182, 352, 1);
  if (variant === 0) bee(ctx, 320, 340, 0.9);
  bee(ctx, 430, 360, 0.9);
  // bench
  rect(ctx, 300, 348, 70, 8, '#8a6b46');
  rect(ctx, 306, 356, 6, 22, '#6b4f33');
  rect(ctx, 358, 356, 6, 22, '#6b4f33');
}

function tree(ctx, x, y, s) {
  rect(ctx, x - 7 * s, y, 14 * s, 60 * s, '#8a6b46');
  circle(ctx, x, y - 18 * s, 34 * s, '#4da34d');
  circle(ctx, x - 26 * s, y + 2 * s, 24 * s, '#5cb85c');
  circle(ctx, x + 26 * s, y + 2 * s, 24 * s, '#3e8e41');
  circle(ctx, x, y - 40 * s, 22 * s, '#6abf5a');
}

function pot(ctx, x, y, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x + 16, y);
  ctx.lineTo(x + 11, y + 22);
  ctx.lineTo(x - 11, y + 22);
  ctx.closePath();
  ctx.fill();
  rect(ctx, x - 19, y - 6, 38, 8, '#b85c3c');
  circle(ctx, x - 6, y - 12, 7, '#4da34d');
  circle(ctx, x + 6, y - 12, 7, '#5cb85c');
}

// ---------------------------------------------------------------- kitchen

export function drawKitchen(ctx, variant) {
  const W = 520;
  // wall and floor
  rect(ctx, 0, 0, W, 350, '#f7ead2');
  rect(ctx, 0, 350, W, 170, '#b08954');
  for (let i = 0; i < 6; i++) line(ctx, 0, 380 + i * 26, W, 380 + i * 26, '#9c7a4a', 2);
  // tile backsplash
  rect(ctx, 0, 200, W, 84, '#e8dcc8');
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 13; c++) {
      const tx = c * 40 + 2;
      const ty = 202 + r * 28;
      let col = (r + c) % 2 === 0 ? '#dfeef5' : '#f5e6c8';
      if (variant === 1 && c === 5 && r === 1) col = '#e78ac3'; // changed tile
      rect(ctx, tx, ty, 36, 24, col);
    }
  }
  // window with curtains (curtain colour differs on the right)
  rect(ctx, 58, 58, 146, 142, '#7fb3e8');
  rect(ctx, 66, 66, 130, 126, '#bfe3f7');
  circle(ctx, 150, 96, 22, '#ffd93b');
  ellipse(ctx, 120, 150, 60, 26, '#7cc46a');
  ellipse(ctx, 170, 162, 50, 22, '#68b357');
  rect(ctx, 130, 150, 8, 42, '#8a6b46');
  circle(ctx, 134, 138, 26, '#4da34d');
  rect(ctx, 52, 52, 158, 10, '#8a6b46');
  const curt = variant === 0 ? '#5b8fd4' : '#4da34d';
  rect(ctx, 52, 58, 22, 150, curt);
  rect(ctx, 188, 58, 22, 150, curt);
  // shelf with jars (one missing on the right)
  rect(ctx, 230, 128, 260, 10, '#8a6b46');
  jar(ctx, 248, 96, '#f7c948');
  jar(ctx, 288, 96, '#e78ac3');
  if (variant === 0) jar(ctx, 330, 96, '#7fb3e8');
  jar(ctx, 372, 96, '#9b59b6');
  jar(ctx, 414, 96, '#e74c3c');
  jar(ctx, 456, 96, '#5cb85c');
  // wall clock (hour hand moved on the right)
  circle(ctx, 422, 102, 34, '#ffffff');
  ctx.strokeStyle = '#5b3a24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(422, 102, 34, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, 422 + Math.cos(a) * 28, 102 + Math.sin(a) * 28, 2, '#5b3a24');
  }
  const hourA = variant === 0 ? -Math.PI / 3 : Math.PI / 6; // 10 o'clock vs 2 o'clock
  line(ctx, 422, 102, 422 + Math.cos(hourA) * 16, 102 + Math.sin(hourA) * 16, '#222', 4);
  line(ctx, 422, 102, 422 + Math.cos(-Math.PI / 2 + 0.6) * 24, 102 + Math.sin(-Math.PI / 2 + 0.6) * 24, '#222', 3);
  circle(ctx, 422, 102, 4, '#e74c3c');
  // hanging plant (moved on the right)
  const px = variant === 0 ? 252 : 300;
  line(ctx, px, 40, px, 66, '#8a6b46', 3);
  pot(ctx, px, 70, '#c96f4a');
  circle(ctx, px - 10, 62, 10, '#4da34d');
  circle(ctx, px + 10, 62, 10, '#5cb85c');
  circle(ctx, px, 52, 11, '#6abf5a');
  // stove with pots and kettle (kettle colour differs)
  rect(ctx, 300, 300, 180, 50, '#8d99ae');
  rect(ctx, 312, 308, 60, 8, '#222');
  rect(ctx, 392, 308, 60, 8, '#222');
  circle(ctx, 342, 296, 22, '#5b6b7a');
  circle(ctx, 422, 296, 20, '#5b6b7a');
  const ket = variant === 0 ? '#c0c8d0' : '#e74c3c';
  circle(ctx, 382, 282, 18, ket);
  ctx.beginPath();
  ctx.moveTo(396, 276);
  ctx.lineTo(408, 266);
  ctx.lineTo(408, 284);
  ctx.closePath();
  ctx.fillStyle = ket;
  ctx.fill();
  line(ctx, 366, 276, 356, 264, ket, 4);
  // counter
  rect(ctx, 0, 350, W, 14, '#e8dcc8');
  // fruit bowl (extra apple on the right)
  ellipse(ctx, 322, 386, 52, 16, '#5b8fd4');
  circle(ctx, 300, 372, 12, '#e74c3c');
  circle(ctx, 322, 368, 12, '#f7a928');
  circle(ctx, 344, 372, 12, '#e74c3c');
  if (variant === 1) circle(ctx, 322, 352, 12, '#e74c3c');
  // spoon (missing on the right)
  if (variant === 0) {
    line(ctx, 282, 356, 282, 376, '#c0c8d0', 4);
    ellipse(ctx, 282, 380, 6, 8, '#c0c8d0');
  }
  // teapot and cups
  circle(ctx, 60, 372, 18, '#9b59b6');
  line(ctx, 76, 368, 88, 358, '#9b59b6', 4);
  rect(ctx, 110, 366, 22, 16, '#ffffff');
  rect(ctx, 140, 366, 22, 16, '#e78ac3');
  // plates rack
  for (let i = 0; i < 4; i++) {
    circle(ctx, 60 + i * 34, 316, 15, i % 2 === 0 ? '#ffffff' : '#dfeef5');
    ctx.strokeStyle = '#b8c4cc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(60 + i * 34, 316, 15, 0, Math.PI * 2);
    ctx.stroke();
  }
  // fridge with magnets
  rect(ctx, 440, 200, 72, 150, '#dfe6ea');
  rect(ctx, 448, 212, 56, 60, '#c8d2d8');
  circle(ctx, 452, 224, 5, '#e74c3c');
  circle(ctx, 470, 240, 5, '#f7c948');
  circle(ctx, 488, 222, 5, '#5b8fd4');
  circle(ctx, 462, 258, 5, '#9b59b6');
  // table and chairs
  rect(ctx, 40, 420, 170, 12, '#8a6b46');
  rect(ctx, 52, 432, 10, 60, '#6b4f33');
  rect(ctx, 188, 432, 10, 60, '#6b4f33');
  rect(ctx, 20, 400, 12, 92, '#a98a68');
  rect(ctx, 216, 400, 12, 92, '#a98a68');
  // rug
  ellipse(ctx, 260, 480, 120, 26, '#e78ac3');
  ellipse(ctx, 260, 480, 88, 18, '#f7c948');
  // cat (tail missing on the right)
  ellipse(ctx, 152, 470, 34, 20, '#e8a25c');
  circle(ctx, 128, 446, 16, '#e8a25c');
  ctx.beginPath();
  ctx.moveTo(118, 434);
  ctx.lineTo(122, 420);
  ctx.lineTo(130, 434);
  ctx.closePath();
  ctx.fillStyle = '#e8a25c';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(134, 432);
  ctx.lineTo(140, 420);
  ctx.lineTo(144, 434);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 122, 444, 2, '#222');
  circle(ctx, 134, 444, 2, '#222');
  if (variant === 0) {
    ctx.strokeStyle = '#e8a25c';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(184, 466);
    ctx.quadraticCurveTo(204, 452, 200, 430);
    ctx.stroke();
  }
  // cutting board
  rect(ctx, 420, 360, 70, 10, '#c9a06b');
}

function jar(ctx, x, y, col) {
  rect(ctx, x - 14, y - 6, 28, 34, col);
  rect(ctx, x - 10, y - 14, 20, 10, '#8a6b46');
  rect(ctx, x - 14, y + 6, 28, 8, 'rgba(255,255,255,0.35)');
}

// ---------------------------------------------------------------- space station

export function drawStation(ctx, variant) {
  const W = 520;
  // space background
  rect(ctx, 0, 0, W, 520, '#0d1b3e');
  // stars (one bright star missing on the right)
  const stars = [
    [40, 40, 2], [90, 90, 1.5], [140, 30, 2], [200, 70, 1.5], [260, 40, 2],
    [320, 80, 1.5], [380, 30, 2], [440, 70, 1.5], [480, 40, 2], [60, 140, 1.5],
    [480, 140, 2], [30, 220, 1.5], [490, 220, 2], [70, 300, 1.5], [450, 300, 2],
    [120, 180, 1.5], [400, 180, 1.5], [240, 120, 1.5], [300, 200, 2], [180, 240, 1.5],
  ];
  for (const [sx, sy, sr] of stars) circle(ctx, sx, sy, sr, '#ffffff');
  if (variant === 0) {
    circle(ctx, 102, 52, 4, '#fff7ae');
    circle(ctx, 102, 52, 8, 'rgba(255,247,174,0.35)');
  }
  // big window with planet (ring colour differs; one porthole dark)
  rect(ctx, 140, 60, 240, 220, '#1c2f57');
  rect(ctx, 150, 70, 220, 200, '#0a1230');
  const ringCol = variant === 0 ? '#e8c97a' : '#7fb3e8';
  circle(ctx, 262, 182, 52, '#d97b4f');
  circle(ctx, 262, 182, 40, '#e8915f');
  ctx.strokeStyle = ringCol;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(262, 182, 78, 20, -0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(232,201,122,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(262, 182, 64, 16, -0.35, 0, Math.PI * 2);
  ctx.stroke();
  circle(ctx, 220, 160, 8, '#c96f4a');
  circle(ctx, 290, 200, 6, '#c96f4a');
  // portholes
  circle(ctx, 452, 102, 26, '#1c2f57');
  if (variant === 0) {
    circle(ctx, 452, 102, 20, '#7fb3e8');
    circle(ctx, 444, 96, 5, '#ffffff');
  } else {
    circle(ctx, 452, 102, 20, '#0a1230');
  }
  circle(ctx, 452, 180, 26, '#1c2f57');
  circle(ctx, 452, 180, 20, '#bfe3f7');
  // control panels left and right
  rect(ctx, 20, 300, 140, 140, '#2a3a5c');
  rect(ctx, 360, 300, 140, 140, '#2a3a5c');
  // buttons (one colour differs)
  const btnCols = ['#5cb85c', '#e74c3c', '#f7c948', '#5b8fd4', '#9b59b6', '#e78ac3'];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      let col = btnCols[(r * 4 + c) % 6];
      if (variant === 1 && r === 0 && c === 0) col = '#e74c3c'; // was green, now red
      circle(ctx, 44 + c * 34, 322 + r * 34, 11, col);
      circle(ctx, 44 + c * 34, 322 + r * 34, 5, 'rgba(255,255,255,0.35)');
    }
  }
  // right panel buttons
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      circle(ctx, 384 + c * 34, 322 + r * 34, 11, btnCols[(r * 4 + c + 2) % 6]);
      circle(ctx, 384 + c * 34, 322 + r * 34, 5, 'rgba(255,255,255,0.35)');
    }
  }
  // screens (graph differs on the right)
  rect(ctx, 180, 300, 130, 70, '#12233f');
  rect(ctx, 186, 306, 118, 58, '#0a1230');
  ctx.strokeStyle = '#5cb85c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (variant === 0) {
    ctx.moveTo(190, 350);
    ctx.lineTo(210, 330);
    ctx.lineTo(230, 340);
    ctx.lineTo(250, 320);
    ctx.lineTo(270, 330);
    ctx.lineTo(295, 312);
  } else {
    ctx.moveTo(190, 320);
    ctx.lineTo(210, 340);
    ctx.lineTo(230, 325);
    ctx.lineTo(250, 350);
    ctx.lineTo(270, 335);
    ctx.lineTo(295, 348);
  }
  ctx.stroke();
  // gauge (needle moved on the right)
  circle(ctx, 402, 252, 30, '#f7ead2');
  ctx.strokeStyle = '#5b3a24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(402, 252, 30, 0, Math.PI * 2);
  ctx.stroke();
  const nA = variant === 0 ? -Math.PI * 0.75 : Math.PI * 0.25;
  line(ctx, 402, 252, 402 + Math.cos(nA) * 22, 252 + Math.sin(nA) * 22, '#e74c3c', 3);
  circle(ctx, 402, 252, 4, '#222');
  // cables (one extra on the right)
  ctx.strokeStyle = '#3a4a6b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 60);
  ctx.quadraticCurveTo(90, 120, 70, 170);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(460, 240);
  ctx.quadraticCurveTo(430, 280, 450, 320);
  ctx.stroke();
  if (variant === 1) {
    ctx.beginPath();
    ctx.moveTo(352, 60);
    ctx.quadraticCurveTo(370, 110, 352, 150);
    ctx.stroke();
  }
  // pipes along the top
  rect(ctx, 0, 0, W, 16, '#3a4a6b');
  rect(ctx, 0, 20, W, 6, '#2a3a5c');
  // astronaut (visor colour differs)
  const visor = variant === 0 ? '#7fb3e8' : '#f7c948';
  ellipse(ctx, 252, 380, 34, 44, '#e8eef2');
  circle(ctx, 252, 322, 26, '#e8eef2');
  circle(ctx, 252, 322, 18, visor);
  circle(ctx, 246, 316, 4, '#ffffff');
  rect(ctx, 214, 360, 14, 34, '#c8d2d8');
  rect(ctx, 276, 360, 14, 34, '#c8d2d8');
  ellipse(ctx, 236, 428, 12, 20, '#c8d2d8');
  ellipse(ctx, 268, 428, 12, 20, '#c8d2d8');
  rect(ctx, 238, 372, 28, 20, '#5b8fd4');
  circle(ctx, 244, 382, 3, '#e74c3c');
  circle(ctx, 258, 382, 3, '#5cb85c');
  // robot (antenna missing on the right)
  rect(ctx, 400, 390, 44, 50, '#c0c8d0');
  rect(ctx, 392, 402, 10, 26, '#9aa4ae');
  rect(ctx, 442, 402, 10, 26, '#9aa4ae');
  circle(ctx, 414, 412, 6, '#5b8fd4');
  circle(ctx, 430, 412, 6, '#e74c3c');
  rect(ctx, 408, 424, 28, 4, '#5b3a24');
  if (variant === 0) {
    line(ctx, 422, 390, 422, 372, '#9aa4ae', 3);
    circle(ctx, 422, 368, 5, '#e74c3c');
  }
  // hydroponic tubes with plants
  for (let i = 0; i < 4; i++) {
    const tx = 60 + i * 60;
    rect(ctx, tx, 460, 44, 34, 'rgba(127,179,232,0.35)');
    ctx.strokeStyle = '#7fb3e8';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx, 460, 44, 34);
    circle(ctx, tx + 14, 456, 9, '#4da34d');
    circle(ctx, tx + 30, 456, 9, '#5cb85c');
    circle(ctx, tx + 22, 448, 10, '#6abf5a');
  }
  // crates
  rect(ctx, 20, 452, 40, 42, '#8a6b46');
  rect(ctx, 480, 452, 40, 42, '#8a6b46');
  line(ctx, 20, 473, 60, 473, '#6b4f33', 3);
  line(ctx, 480, 473, 520, 473, '#6b4f33', 3);
  // extra bolt on the left panel (right only)
  if (variant === 1) {
    circle(ctx, 122, 382, 7, '#c0c8d0');
    circle(ctx, 122, 382, 3, '#5b3a24');
  }
  // ceiling lights
  rect(ctx, 60, 24, 60, 10, '#fff7ae');
  rect(ctx, 230, 24, 60, 10, '#fff7ae');
  rect(ctx, 400, 24, 60, 10, '#fff7ae');
}
