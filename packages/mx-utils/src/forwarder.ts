#!/usr/bin/env node

import { parseArgs } from '@mxfriend/common/cli';
import { UdpOSCPeer, UdpOSCPort } from '@mxfriend/osc/udp';
import { osc } from '@mxfriend/osc';

const [opts, publicIp, ...mixers] = parseArgs(process.argv, '-q', '<local ip>', '[...mixer ip[:port]]');
const verbose = !opts.includes('-q');

mixers.map(async (mixerConn) => {
  const [mixerIp, mixerPortStr] = mixerConn.split(':');
  const mixerPort = parseInt(mixerPortStr ?? 10023, 10);

  const client = new UdpOSCPort({
    localPort: mixerPort,
  });

  const mixer = new UdpOSCPort({
    remoteAddress: mixerIp,
    remotePort: mixerPort,
  });

  await client.open();
  await mixer.open();

  let clientPeer: UdpOSCPeer | undefined;

  client.on('message', async ({ address, args }, peer) => {
    clientPeer = peer;
    verbose && console.log('C->M', address, ...args);
    await mixer.send(address, args);
  });

  mixer.on('message', async ({ address, args }) => {
    if (!clientPeer) {
      return;
    }

    if (address === '/xinfo') {
      const [, ...rest] = args;
      args = [osc.string(publicIp), ...rest];
    } else if (address === '/status') {
      const [active, , ...rest] = args;
      args = [active, osc.string(publicIp), ...rest];
    }

    verbose && console.log('M->C', address, ...args);
    await client.send(address, args, clientPeer);
  });
});
