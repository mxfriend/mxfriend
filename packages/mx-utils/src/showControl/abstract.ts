import { parseNodeText } from '@mxfriend/common';
import { UdpOSCPort } from '@mxfriend/osc/udp';

export abstract class AbstractShowControlUtil {
  protected readonly conn: UdpOSCPort;

  constructor(ip: string) {
    this.conn = new UdpOSCPort({
      remoteAddress: ip,
      remotePort: 10023,
    });
  }

  async init(): Promise<void> {
    await this.conn.open();
  }

  async cleanup(): Promise<void> {
    await this.conn.close();
  }

  protected parseLine(line: string): string[] {
    const [addr, ...args] = parseNodeText(line);
    return [addr?.replace(/^\//, ''), ...args.map((arg) => arg.replace(/^"(.*)"$/, '$1'))];
  }

  protected parseMask(value: string): number {
    return parseInt(value.replace(/^%/, ''), /^%/.test(value) ? 2 : 10);
  }
}
