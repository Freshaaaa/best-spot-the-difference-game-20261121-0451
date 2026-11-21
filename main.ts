// main.ts — hands the game in: copies game/ and screenshots/ to /output
// and writes /output/dossier.json with buildDossier from the kit library.
// Standard library only; runs twice and writes the same bytes both times.
// The output directory is /output in the grader, or MAKEFUN_OUTPUT_DIR
// when set (local runs use a scratch directory instead).

import { buildDossier } from './vendor/makefun-game.ts';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The repository root is where this file lives; the output directory is
// /output in the grader, or MAKEFUN_OUTPUT_DIR when set for local runs.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Create the output directory first so the copies below always land.
mkdirSync(out, { recursive: true });
// Copy the game and its screenshots verbatim; the dossier is built from
// these copies so it always describes exactly what is handed in.
cpSync(join(repoRoot, 'game'), join(out, 'game'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(out, 'screenshots'), { recursive: true });
// The dossier is rebuilt from the copied files, so it always matches
// exactly what the grader sees in /output.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  }),
);
