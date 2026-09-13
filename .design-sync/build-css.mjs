#!/usr/bin/env node
// design-sync CSS build: compiles .design-sync/pkg/tailwind.css (which imports
// the app's real app/globals.css) with the repo's own Tailwind v4 into
// .design-sync/pkg/styles.css - the converter's cfg.cssEntry. Run from the repo
// root: `node .design-sync/build-css.mjs` (cfg.buildCmd).
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const here = dirname(fileURLToPath(import.meta.url));
const input = join(here, 'pkg', 'tailwind.css');
const output = join(here, 'pkg', 'styles.css');

const css = readFileSync(input, 'utf8');
const result = await postcss([tailwindcss({ optimize: { minify: false } })]).process(css, { from: input, to: output, map: false });
for (const w of result.warnings()) console.error(`  ! css: ${w.toString()}`);
writeFileSync(output, result.css);
console.error(`  css: ${output} (${(statSync(output).size / 1024).toFixed(0)} KB)`);
