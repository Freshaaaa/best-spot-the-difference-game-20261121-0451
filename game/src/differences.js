// differences.js — where every difference hides, per level.
// Coordinates are panel coordinates (each panel is 520 x 520).
// r is the click radius. type describes how the difference shows:
//   missing  — an object present on the left is gone on the right
//   colour   — the same object, a different colour on the right
//   extra    — an object present only on the right
//   moved    — the same object, in a different place on the right
//   changed  — the same object, drawn differently on the right

export const PANEL_SIZE = 520;

export const LEVELS = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    subtitle: 'A quiet afternoon in the garden',
    timeLimit: 180,
    differences: [
      { id: 'flower-red', x: 118, y: 388, r: 24, type: 'missing', label: 'Red flower' },
      { id: 'flower-colour', x: 205, y: 402, r: 24, type: 'colour', label: 'Flower colour' },
      { id: 'bird-extra', x: 352, y: 92, r: 26, type: 'extra', label: 'Extra bird' },
      { id: 'butterfly-missing', x: 282, y: 252, r: 26, type: 'missing', label: 'Butterfly' },
      { id: 'cloud-missing', x: 152, y: 82, r: 30, type: 'missing', label: 'Cloud' },
      { id: 'fence-post', x: 302, y: 332, r: 22, type: 'missing', label: 'Fence post' },
      { id: 'can-colour', x: 402, y: 424, r: 28, type: 'colour', label: 'Watering can' },
      { id: 'bee-missing', x: 182, y: 352, r: 22, type: 'missing', label: 'Bee' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    subtitle: 'Something is cooking',
    timeLimit: 180,
    differences: [
      { id: 'jar-missing', x: 148, y: 112, r: 24, type: 'missing', label: 'Jar on the shelf' },
      { id: 'clock-hand', x: 422, y: 102, r: 30, type: 'moved', label: 'Clock hand' },
      { id: 'apple-extra', x: 322, y: 382, r: 24, type: 'extra', label: 'Extra apple' },
      { id: 'kettle-colour', x: 382, y: 282, r: 28, type: 'colour', label: 'Kettle colour' },
      { id: 'cat-tail', x: 152, y: 472, r: 26, type: 'missing', label: 'Cat tail' },
      { id: 'plant-moved', x: 252, y: 82, r: 26, type: 'moved', label: 'Hanging plant' },
      { id: 'tile-colour', x: 202, y: 242, r: 22, type: 'colour', label: 'Wall tile' },
      { id: 'curtain-colour', x: 82, y: 132, r: 28, type: 'colour', label: 'Curtain' },
      { id: 'spoon-missing', x: 282, y: 362, r: 22, type: 'missing', label: 'Spoon' },
    ],
  },
  {
    id: 'station',
    name: 'Space Station',
    subtitle: 'Orbiting far above Earth',
    timeLimit: 180,
    differences: [
      { id: 'star-missing', x: 102, y: 52, r: 22, type: 'missing', label: 'Bright star' },
      { id: 'button-colour', x: 82, y: 322, r: 22, type: 'colour', label: 'Control button' },
      { id: 'cable-extra', x: 352, y: 122, r: 26, type: 'extra', label: 'Extra cable' },
      { id: 'visor-colour', x: 252, y: 332, r: 28, type: 'colour', label: 'Helmet visor' },
      { id: 'porthole-dark', x: 452, y: 102, r: 26, type: 'changed', label: 'Porthole' },
      { id: 'screen-graph', x: 202, y: 302, r: 28, type: 'changed', label: 'Screen graph' },
      { id: 'antenna-missing', x: 422, y: 372, r: 22, type: 'missing', label: 'Robot antenna' },
      { id: 'ring-colour', x: 262, y: 182, r: 30, type: 'colour', label: 'Planet ring' },
      { id: 'bolt-extra', x: 122, y: 382, r: 20, type: 'extra', label: 'Extra bolt' },
      { id: 'gauge-needle', x: 402, y: 252, r: 26, type: 'moved', label: 'Gauge needle' },
    ],
  },
];
