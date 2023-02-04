#!/usr/bin/env node

import { parseArgs } from '@mxfriend/common/cli';

const [opts, ...specs] = parseArgs(process.argv, '--base1', '--dash', '<spec>', '[...<spec>]');

let idx = opts.includes('--base1') ? 1 : 0;
const pattern = new RegExp(`^(.*?)(\\d+)${opts.includes('--dash') ? '-' : '\\.\\.\\.'}(\\d+)(.*)$`);
const pairs: string[] = [];

for (const spec of specs) {
  const m = spec.match(pattern);

  if (!m) {
    pairs.push(`${cleanup(spec)}: ${idx++},`);
    continue;
  }

  const prefix = cleanup(m[1]);
  const postfix = cleanup(m[4]);
  const start = parseInt(m[2], 10) - idx;
  const end = idx + parseInt(m[3], 10);
  const pad = m[2].length > 1 ? (v: number) => v.toString().padStart(m[2].length, '0') : (v: number) => v;
  const q = prefix ? '' : "'";

  for (; idx < end; ++idx) {
    pairs.push(`${q}${prefix}${pad(idx + start)}${postfix}${q}: ${idx},`);
  }
}

let line = 0;

for (const pair of pairs) {
  if (line + pair.length + 1 > 100) {
    process.stdout.write('\n');
    line = 0;
  }

  if (line < 1) {
    process.stdout.write(' ');
    line = 1;
  }

  process.stdout.write(' ' + pair);
  line += 1 + pair.length;
}

process.stdout.write('\n');

function cleanup(v: string): string {
  return v.replace(/[^a-z0-9_]+/gi, '');
}
