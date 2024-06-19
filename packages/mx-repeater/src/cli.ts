#!/usr/bin/env node

import { log, parseArgs } from '@mxfriend/common/cli';
import { resolveLocalIp, resolveMixer } from './resolve';
import { MX32AdapterFactory, MXAirAdapterFactory } from './adapters';

const [, mode, ip] = parseArgs(process.argv, '[mode=mx32|mxair]', '[ip]');

if (mode && !/^mx(32|air)$/.test(mode)) {
  log(`Invalid mode: '${mode}', please specify either 'mx32' or 'mxair'`);
  process.exit(1);
}

(async () => {
  const info = await resolveMixer(mode, ip);

  console.log(`Found mixer: ${info.model} '${info.name}'`);

  const factories = [
    new MX32AdapterFactory(),
    new MXAirAdapterFactory(),
  ];

  for (const factory of factories) {
    if (factory.supports(info.model)) {
      const localIp = resolveLocalIp(info.ip);
      await factory.create(localIp, info.ip);
      console.log(`Repeater listening at ${localIp}.`);
      return;
    }
  }

  console.log('No adapter supports this mixer');
})();
