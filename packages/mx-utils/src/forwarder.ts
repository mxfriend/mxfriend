#!/usr/bin/env node

import { parseArgs } from '@mxfriend/common/cli';
import { UdpOSCPeer, UdpOSCPort } from '@mxfriend/osc/udp';
import { osc, OSCArgument } from '@mxfriend/osc';

const [opts, publicIp, ...mixers] = parseArgs(process.argv, '-q', '-v', '<local ip>', '[...mixer ip[:port]]');
const log = opts.includes('-v') ? logMsgWithArgs : opts.includes('-q') ? dontLog : logMsg;

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
    log('>', address, args);
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

    log('<', address, args);
    await client.send(address, args, clientPeer);
  });
});

function logMsg(direction: '<' | '>', address: string): void {
  console.log(direction, address);
}

function logMsgWithArgs(direction: '<' | '>', address: string, args: OSCArgument[]): void {
  console.log(direction, address, ...args);
}

function dontLog(): void {}
