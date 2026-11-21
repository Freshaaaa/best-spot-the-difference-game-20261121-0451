// main.ts — hands the game in: copies game/ and screenshots/ to /output
// and writes /output/dossier.json with buildDossier from the kit library.
// Standard library only; runs twice and writes the same bytes both times.

import { buildDossier } from './vendor/makefun-game.ts';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(repoRoot, 'game'), join(out, 'game'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(out, 'screenshots'), { recursive: true });
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  }),
);
