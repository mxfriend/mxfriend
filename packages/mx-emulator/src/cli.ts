#!/usr/bin/env node

import { parseArgs, log } from '@mxfriend/common/cli';
import { UdpOSCPeer, UdpOSCPort } from '@mxfriend/osc/udp';
import { EmulatorAdapterInterface, MX32Adapter, MXAirAdapter } from './adapters';
import { Emulator } from './emulator';

import './patches';

const [, model, ip, ...patterns] = parseArgs(process.argv, '<model>', '<ip>', '[...patterns]');

(async () => {
  const adapter = createAdapter(model);

  const port = new UdpOSCPort({
    localPort: adapter.getPort(),
  });

  if (patterns.length) {
    const pattern = new RegExp(`^(?:${patterns.map(formatPattern).join('|')})`);
    const peers: Map<number, number> = new Map();
    const pid = (peer?: UdpOSCPeer): number | string => {
      if (!peer) return '?';
      peers.has(peer.port) || peers.set(peer.port, peers.size + 1);
      return peers.get(peer.port)!;
    };

    port.on('message', (msg, peer) => pattern.test(msg.address) && console.log(`C${pid(peer)}->M`, msg.address, ...msg.args));

    const send = port.send;
    port.send = async (address, args, to) => {
      try {
        return await send.call(port, address, args, to);
      } finally {
        pattern.test(address) && console.log(`M->C${pid(to)}`, address, ...(args ?? []));
      }
    };
  }

  const emulator = new Emulator(port, adapter, ip);
  await emulator.start();
})();


function createAdapter(model: string): EmulatorAdapterInterface {
  for (const adapter of [MX32Adapter, MXAirAdapter]) {
    if (adapter.supports(model)) {
      return new adapter(model);
    }
  }

  log(`Unsupported mixer model: '${model}'`);
  process.exit(1);
}

function formatPattern(pattern: string): string {
  return pattern
    .replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
    .replace(/(?:\\\*)+/g, (p) => p.length > 1 ? '.+' : '[^/]+');
}
