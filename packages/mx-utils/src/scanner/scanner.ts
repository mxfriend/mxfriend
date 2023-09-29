import { sleep } from '@mxfriend/common';
import { AbstractOSCPort, isOSCType, osc, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { writeFile } from 'fs/promises';
import { query, DeferrableTimeout } from '../utils';

export type LogFn = (msg: string, verbose?: boolean) => void;

const defaultLogFn: LogFn = () => {};

export class MXParamScanner {
  private readonly worker: UdpOSCPort;
  private readonly observer: UdpOSCPort;
  private readonly log: LogFn;

  constructor(remoteAddress: string, remotePort: number, log: LogFn = defaultLogFn) {
    this.worker = new UdpOSCPort({ remoteAddress, remotePort });
    this.observer = new UdpOSCPort({ remoteAddress, remotePort });
    this.log = log;
  }

  async init(): Promise<void> {
    await this.worker.open();
    await this.observer.open();
  }

  async destroy(): Promise<void> {
    await this.worker.close();
    await this.observer.close();
  }

  async setup(cb: (port: UdpOSCPort) => void): Promise<void> {
    await cb(this.worker);
  }

  async scanParam(address: string, resolution: number): Promise<number> {
    const floats = await this.scanFloatValues(address, resolution);
    const [node, index] = await this.resolveNode(address);
    const pairs = await this.scanNodeValues(floats, address, node, index);
    await this.writeResultFile(pairs);
    return pairs.length;
  }

  private logln(msg: string, verbose?: boolean): void {
    this.log(msg + '\n', verbose);
  }

  private async scanFloatValues(address: string, resolution: number): Promise<number[]> {
    this.log('Scanning known float values...');
    await this.worker.send(address, osc.compose('f', 1));

    const results: Set<number> = new Set();

    const cleanup = await this.subscribeUpdates(this.observer, address, ({ args: [arg] }) => {
      if (isOSCType(arg, 'f')) {
        results.add(arg.value);
      }
    });

    const steps = (resolution - 1) * 2;
    const batch = Math.round(steps / 10);

    for (let i = 0; i <= steps; ++i) {
      if (i % batch === 0) {
        this.log(` ${Math.round(100 * i / steps)}%`, true);
      }

      await this.worker.send(address, osc.compose('f', i / steps));
      await sleep(10);
    }

    await sleep(100);
    cleanup();

    if (!results.size) {
      this.logln('\nERROR: no float values received from mixer, probably a connection issue!');
      throw new Error();
    }

    this.logln(`\nDone, found ${results.size} values.`);

    if (results.size !== resolution) {
      this.logln(`WARNING: expected to find ${resolution} values!`);
    }

    return [...results].sort();
  }

  private async resolveNode(address: string): Promise<[string, number]> {
    this.logln('Resolving node properties...');
    let node = address.replace(/^\/|\/[^\/]+$/g, '');

    while (node) {
      this.logln(`Trying '${node}'..`, true);
      const states: string[] = [];

      for (let i = 0; i < 2; ++i) {
        this.log(`  #${i+1}:`, true);
        await this.worker.send(address, osc.compose('f', i));
        await sleep(50);
        const result = await query(this.worker, '/node', osc.compose('s', node), 'node');
        const [arg] = osc.validate(result, 's');
        this.logln(result ? ` got ${arg ? '' : 'in'}valid response.` : ' timed out.', true);
        arg && states.push(arg.value);
      }

      if (states.length > 1) {
        const values = states.map(parseNode);

        for (let i = 0, n = Math.min(values[0].length, values[1].length); i < n; ++i) {
          if (values[0][i] !== values[1][i]) {
            return [node, i];
          }
        }

        this.logln('All node values match, no change detected.', true);
      }

      if (!node.includes('/')) {
        break;
      }

      node = node.replace(/\/[^\/]+$/, '');
    }

    this.logln(`ERROR: Failed to resolve node properties from address '${address}'`);
    throw new Error();
  }

  private async scanNodeValues(floats: number[], address: string, node: string, index: number): Promise<[number, number][]> {
    return new Promise(async (resolve, reject) => {
      this.logln('Resolving values...');
      const pairs: [number, number][] = [];
      let idx: number = 0;
      let lastOp: string = 'unknown';

      await this.worker.send(address, osc.compose('f', 1));
      await sleep(50);

      const timeout = new DeferrableTimeout(5000, () => {
        cleanup();
        this.logln(`\nERROR: operation timed out, last action was '${lastOp}'`);
        reject(new Error());
      });

      const cancelUpdates = await this.subscribeUpdates(this.observer, address, async () => {
        lastOp = `observed update from state #${idx}`;
        timeout.postpone();
        await this.worker.send('/node', osc.compose('s', node));
        lastOp = `queried state #${idx}`;
      });

      const unsubscribe = this.subscribe(this.worker, 'node', async ({ args: [arg] }) => {
        lastOp = `received state #${idx}`;
        timeout.postpone();

        if (isOSCType(arg, 's')) {
          const values = parseNode(arg.value);

          if (values.length > index) {
            pairs.push([floats[idx], parseFloat(cleanupValue(values[index]))]);

            if (++idx < floats.length) {
              lastOp = `requested value #${idx}`;
              await this.worker.send(address, osc.compose('f', floats[idx]));
            } else {
              this.logln(`Done, resolved ${pairs.length} value pairs.`);
              await cleanup();
              resolve(pairs);
            }

            return;
          }
        }

        await cleanup();
        this.logln(`ERROR: Unprocessable data returned from node ${node}: '${arg.value}'`);
        reject(new Error());
      });

      const cleanup = async () => {
        timeout.cancel();
        cancelUpdates();
        unsubscribe();
        await this.worker.send(address, osc.compose('f', 0));
      };

      await this.worker.send(address, osc.compose('f', 0));
    });
  }

  private formatResultFileName(pairs: [number, number][]): string {
    const lo = formatValue(pairs[0][1]);
    const hi = formatValue(pairs[pairs.length - 1][1]);
    const n = formatValue(pairs.length);
    const type = isLinear(pairs) ? 'lin' : 'log';
    return `${type}_${lo}-${hi}@${n}.ts`;
  }

  private formatResultConstName(pairs: [number, number][]): string {
    const lo = formatValue(pairs[0][1], true);
    const hi = formatValue(pairs[pairs.length - 1][1], true);
    const n = formatValue(pairs.length, true);
    const type = isLinear(pairs) ? 'lin' : 'log';
    return `${type}_${lo}_${hi}_${n}`;
  }

  private formatResultData(pairs: [number, number][]): string {
    const buffer = Buffer.alloc(pairs.length * 3 * 4);
    let offset = 0;

    for (const [float, val] of pairs) {
      offset = buffer.writeFloatBE(float, offset);
      offset = buffer.writeDoubleBE(val, offset);
    }

    return buffer.toString('hex');
  }

  private async writeResultFile(pairs: [number, number][]): Promise<void> {
    const fn = this.formatResultFileName(pairs);
    const name = this.formatResultConstName(pairs);
    const data = this.formatResultData(pairs);
    const contents = [
      `import { $Buffer } from '@mxfriend/osc';\n\n`,
      `export const ${name} = $Buffer.from('${data}', 'hex');\n\n`,
    ];

    await writeFile(fn, contents.join(''));
  }

  private async subscribeUpdates(port: AbstractOSCPort, address: string, handler: (msg: OSCMessage) => void): Promise<() => void> {
    const unsubscribe = this.subscribe(port, address, handler);
    await port.send('/xremotenfb');
    const sub = setInterval(() => port.send('/xremotenfb'), 4500);

    return () => {
      clearInterval(sub);
      unsubscribe();
    };
  }

  private subscribe(port: AbstractOSCPort, address: string, handler: (msg: OSCMessage) => void): () => void {
    port.subscribe(address, handler);
    return () => port.unsubscribe(address, handler);
  }
}

function parseNode(node: string): string[] {
  return [...node.trim().matchAll(/"[^"]*"|\S+/g)].map((m) => m[0]);
}

function cleanupValue(value: string): string {
  if (/^\d+k\d+$/.test(value)) {
    return value.replace(/k(\d+)$/, (_, n) => n.padEnd(3, '0'));
  } else if (value === '-oo') {
    return '-Infinity';
  } else {
    return value.replace(/^\+/, '');
  }
}

function formatValue(value: number, ts: boolean = false): string {
  if (value === -Infinity) {
    return ts ? '_inf' : '-oo';
  } else {
    return ts ? value.toString().replace('.', 'o') : value.toString();
  }
}

function isLinear(values: [number, number][]): boolean {
  const a = values[0][1];
  const b = values[values.length - 1][1];
  return Math.abs(values[Math.floor(values.length / 2)][1] - (a + b) / 2) < Math.abs((a - b) / (2 * (values.length - 1)));
}
