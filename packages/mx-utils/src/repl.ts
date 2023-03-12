#!/usr/bin/env node

import { parseArgs } from '@mxfriend/common/cli';
import { osc, OSCArgument } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';

const [opts, ip, port] = parseArgs(process.argv, '-b', '<ip>', '<port>');

type Command = (...args: string[]) => void;

const io = createInterface({
  input: stdin,
  output: stdout,
  prompt: '# ',
  tabSize: 2,
  removeHistoryDuplicates: true,
});

const conn = new UdpOSCPort({
  remoteAddress: ip,
  remotePort: parseInt(port, 10),
  broadcast: opts.includes('-b'),
});

let printBuffers: boolean = false;
let terminating: boolean = false;
const timers: Map<string, NodeJS.Timeout> = new Map();

const commands: Record<string, Command> = {
  buffers: (on) => {
    printBuffers = /^(on|true|1|yes)$/.test(on);
    println(`Verbose buffers are ${printBuffers ? 'on' : 'off'}.`);
  },
  every: async (interval, addr, types, ...values) => {
    const args = compose(types, ...values);
    await conn.send(addr, args);
    timers.set(addr, setInterval(() => conn.send(addr, args), parseFloat(interval) * 1000));
    println('Timer set.');
  },
  stop: (addr) => {
    clearInterval(timers.get(addr));
    timers.delete(addr);
    println('Timer cleared.');
  },
  quit: async () => {
    terminating = true;
    println('Bye!');
    io.removeAllListeners();
    io.close();
    conn.off();

    for (const tmr of timers.values()) {
      clearInterval(tmr);
    }

    await conn.close();
  },
};

(async () => {
  io.on('line', async (line) => {
    const [addr, ...values] = parse(line);

    if (!addr) {
      io.prompt();
      return;
    }

    if (addr.startsWith('@')) {
      const cmd = addr.slice(1);

      if (cmd in commands) {
        await commands[cmd](...values);
      } else {
        println(`Unknown command: ${addr}`);
      }
    } else {
      await conn.send(addr, compose(...values));
    }

    terminating || io.prompt();
  });

  conn.on('message', (msg) => {
    println(`> ${msg.address} ${extract(msg.args).join(' ')}`);
    io.prompt();
  });

  await conn.open();
  io.prompt();
})();

function println(message: string): void {
  stdout.write(`\r${message}\n`);
}

function parse(line: string): string[] {
  return [...line.trim().matchAll(/"[^"]*"|\S+/g)].map((m) => m[0].replace(/^"(.*)"$/, '$1'));
}

function compose(types?: string, ...values: string[]): OSCArgument[] {
  const args: OSCArgument[] = [];

  if (!types) {
    return args;
  }

  for (let i = 0; i < types.length; ++i) {
    switch (types.charAt(i)) {
      case 's': args.push(osc.string(values[i])); break;
      case 'i': args.push(osc.int(parseInt(values[i], 10))); break;
      case 'f': args.push(osc.float(parseFloat(values[i]))); break;
    }
  }

  return args;
}

function extract(args: OSCArgument[]): string[] {
  return args.map((arg) => {
    switch (arg.type) {
      case 's': return `"${arg.value}"`;
      case 'i':
      case 'f':
        return arg.value.toString();
      case 'b':
        return printBuffers ? arg.value.toString('hex' as any) : `<${arg.value.byteLength}B>`;
      default:
        return '?';
    }
  });
}
