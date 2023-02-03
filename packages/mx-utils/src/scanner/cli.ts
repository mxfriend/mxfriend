#!/usr/bin/env node

import { parseArgs, log, logUnlessQuiet } from '@mxfriend/common/cli';
import { sleep } from '@mxfriend/common';
import { osc } from '@mxfriend/osc';
import { mkdir } from 'node:fs/promises';
import { knownParams } from './params';
import { MXParamScanner } from './scanner';

const [opts, ip, port, ...targets] = parseArgs(process.argv, '-q', '<ip>', '<port>', '[...target@resolution]');
const params = resolveParamsToScan(targets);
const scanner = new MXParamScanner(ip, parseInt(port, 10), opts.includes('-q') ? logUnlessQuiet : log);

(async () => {
  await mkdir('data', { recursive: true });
  process.chdir('data');

  await scanner.init();
  let errors: number = 0;

  for (const [target, resolution] of params) {
    log(`Now resolving '${target}'.\n`);

    const address = await resolveAddress(scanner, target);

    try {
      const actual = await scanner.scanParam(address, resolution);

      if (actual !== resolution) {
        ++errors;
      }
    } catch (e) {
      ++errors;
    }

    log('\n');
  }


  await scanner.destroy();
  log('\n\nAll finished.\n');
  log(`Total parameters scanned: ${params}; errors: ${errors || 'none'}.\n\n`);
})();

function resolveParamsToScan(params: string[]): [target: string, resolution: number][] {
  if (!params.length) {
    return knownParams;
  }

  return params.map((param) => {
    const [target, res] = param.split('@');
    return [target, parseInt(res ?? '101', 10)];
  });
}

async function resolveAddress(scanner: MXParamScanner, target: string): Promise<string> {
  const m = target.match(/^(?!\/)([^:]+):(\d+)$/);

  if (!m) {
    return target;
  }

  await scanner.setup(async (port) => {
    await port.send('/fx/1/type', osc.compose('s', m[1]));
    await sleep(100);
  });

  return `/fx/1/par/${m[2]}`;
}
