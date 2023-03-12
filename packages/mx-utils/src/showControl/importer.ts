import { parseNodeText } from '@mxfriend/common';
import { osc, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { readFile } from 'fs/promises';
import { NumericProp, SceneOptions, SnippetOptions } from './types';


export class ShowImporter {
  private readonly conn: UdpOSCPort;

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

  async importShow(path: string): Promise<void> {
    const data = await readFile(path, 'utf-8');

    for (const line of data.trim().split(/\n/g)) {
      if (/^(?!#)\S/.test(line)) {
        const [cmd, ...args] = parseNodeText(line);
        const [type, idx] = cmd.split(/\//);

        switch (type) {
          case 'show':
            await this.importShowInfo(args[0]);
            break;
          case 'scene':
            await this.importShowScene(path, parseInt(idx, 10), args);
            break;
          case 'snippet':
            await this.importShowSnippet(path, parseInt(idx, 10), args);
            break;
        }
      }
    }
  }

  async importScene(path: string, idx: number, options: SceneOptions): Promise<void> {
    await this.importFile(path);
    await this.setProps('scene', idx, options, 'safes');
    await this.conn.send('/save', osc.compose('s', 'scene', 'i', idx, 's', options.name, 's', options.note ?? ''));
  }

  async importSnippet(path: string, idx: number, options: SnippetOptions): Promise<void> {
    await this.importFile(path);
    await this.setProps('snippet', idx, options, 'eventtyp', 'channels', 'auxbuses', 'maingrps');
    await this.conn.send('/save', osc.compose('s', 'snippet', 'i', idx, 's', options.name));
  }

  private async importShowInfo(name: string): Promise<void> {
    // todo safes
    await this.conn.send('/-show/showfile/show/name', osc.compose('s', name));
  }

  private async importShowScene(show: string, idx: number, [name, note, safes]: string[]): Promise<void> {
    const sceneFile = show.replace(/\.shw$/i, `.${idx.toString().padStart(3, '0')}.scn`);

    await this.importScene(sceneFile, idx, {
      name: name.replace(/^"(.*)"$/, '$1'),
      note: note.replace(/^"(.*)"$/, '$1'),
      safes: parseInt(safes.replace(/^%/, ''), 2),
    });
  }

  private async importShowSnippet(show: string, idx: number, [name, eventtyp, channels, auxbuses, maingrps]: string[]): Promise<void> {
    const snippetFile = show.replace(/\.shw$/i, `.${idx.toString().padStart(3, '0')}.snp`);

    await this.importSnippet(snippetFile, idx, {
      name: name.replace(/^"(.*)"$/, '$1'),
      eventtyp: parseInt(eventtyp, 10),
      auxbuses: parseInt(auxbuses, 10),
      channels: parseInt(channels, 10),
      maingrps: parseInt(maingrps, 10),
    });
  }

  private async setProps<T, P extends NumericProp<T>>(type: string, idx: number, options: T, ...props: P[]): Promise<void> {
    for (const prop of props) {
      const value = options[prop];

      if (typeof value === 'number') {
        await this.conn.send(
          `/-show/showfile/${type}/${idx.toString().padStart(3, '0')}/${prop}`,
          osc.compose('i', value),
        );
      }
    }
  }

  private async importFile(path: string): Promise<void> {
    const data = await readFile(path, 'utf-8');

    for (const line of data.trim().split(/\n/g)) {
      if (/^(?!#)\S/.test(line)) {
        await this.importLine(line.trim());
      }
    }
  }

  private async importLine(line: string): Promise<void> {
    const received = new Promise<void>((resolve) => {
      const handle = ({ address, args: [arg] }: OSCMessage): void => {
        if (address === '/' && arg && osc.is.string(arg) && arg.value.trim() === line) {
          this.conn.off('message', handle);
          resolve();
        }
      };

      this.conn.on('message', handle);
    });

    await this.conn.send('/', osc.compose('s', line));
    const retry = setInterval(async () => await this.conn.send('/', osc.compose('s', line)), 500);
    await received;
    clearInterval(retry);
  }
}
