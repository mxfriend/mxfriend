import { parseArgs } from '@mxfriend/common/cli';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { Emulator } from './emulator';

import './patches';

const [, ip, ...patterns] = parseArgs(process.argv, '<ip>', '[...patterns]');

(async () => {
  const port = new UdpOSCPort({
    localPort: 10024,
  });

  if (patterns.length) {
    const pattern = new RegExp(`^(?:${patterns.map(formatPattern).join('|')})`);

    port.on('message', (msg) => pattern.test(msg.address) && console.log('C->M', msg.address, ...msg.args));

    const send = port.send;
    port.send = async (address, args, to) => {
      try {
        return await send.call(port, address, args, to);
      } finally {
        pattern.test(address) && console.log('M->C', address, ...(args ?? []));
      }
    };
  }

  const emulator = new Emulator(port, ip);
  await emulator.start();
})();

function formatPattern(pattern: string): string {
  return pattern
    .replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
    .replace(/(?:\\\*)+/g, (p) => p.length > 1 ? '.+' : '[^/]+');
}
