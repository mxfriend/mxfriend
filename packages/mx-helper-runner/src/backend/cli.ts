#!/usr/bin/env node

import { MX32HelperAdapter, MXAirHelperAdapter } from '@mxfriend/mx-helpers';
import { HelperRunner } from './helperRunner';
import { HelperServer } from './helperServer';

(async () => {
  const runner = new HelperRunner();
  const server = new HelperServer(runner);

  runner.addAdapter(new MXAirHelperAdapter());
  runner.addAdapter(new MX32HelperAdapter());
  await runner.init();

  await server.start();
})();
