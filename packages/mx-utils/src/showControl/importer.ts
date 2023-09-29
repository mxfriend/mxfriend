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
        const [type, idx] = cmd.replace(/^\//, '').split(/\//);

        switch (type) {
          case 'show':
            console.log('Importing show details...');
            await this.importShowInfo(args);
            break;
          case 'cue':
            console.log(`Importing cue ${idx}...`);
            await this.importShowCue(parseInt(idx, 10), args);
            break;
          case 'scene':
            console.log(`Importing scene ${idx}...`);
            await this.importShowScene(path, parseInt(idx, 10), args);
            break;
          case 'snippet':
            console.log(`Importing snippet ${idx}...`);
            await this.importShowSnippet(path, parseInt(idx, 10), args);
            break;
        }
      }
    }

    await this.conn.send('/-action/initall', osc.compose('i', 1));
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

  private async importShowInfo([name = '', inputs, mxsends, mxbuses, console, chan16, chan32, return_, buses, lrmtxdca, effects]: string[]): Promise<void> {
    await this.conn.send('/-action/initshow', osc.compose('i', 1));
    await this.conn.send('/-show/showfile/show/name', osc.compose('s', name.replace(/^"(.*)"$/, '$1')));

    for (const [prop, value] of Object.entries({ inputs, mxsends, mxbuses, console, chan16, chan32, return_, buses, lrmtxdca, effects })) {
      await this.conn.send(`/-show/showfile/show/${prop.replace(/_$/, '')}`, osc.compose('i', parseInt(value ?? '0', 10)));
    }
  }

  private async importShowCue(idx: number, [
    numb = '0',
    name = '',
    skip = '0',
    scene = '-1',
    bit = '-1',
    miditype = '0',
    midichan = '0',
    midipara1 = '0',
    midipara2 = '0',
  ]: string[]): Promise<void> {
    const idx3 = idx.toString().padStart(3, '0');

    for (const [prop, value] of Object.entries({ skip, scene, bit, miditype, midichan, midipara1, midipara2 })) {
      await this.conn.send(`/-show/showfile/cue/${idx3}/${prop}`, osc.compose('i', parseInt(value, 10)));
    }

    await this.conn.send('/add', osc.compose(
      's', 'cue',
      'i', parseInt(numb, 10),
      's', name.replace(/^"(.*)"$/, '$1'),
    ));
  }

  private async importShowScene(show: string, idx: number, [name = '', note = '', safes = '0']: string[]): Promise<void> {
    const sceneFile = show.replace(/\.shw$/i, `.${idx.toString().padStart(3, '0')}.scn`);

    await this.importScene(sceneFile, idx, {
      name: name.replace(/^"(.*)"$/, '$1'),
      note: note.replace(/^"(.*)"$/, '$1'),
      safes: parseInt(safes.replace(/^%/, ''), 2),
    });
  }

  private async importShowSnippet(show: string, idx: number, [name = '', eventtyp = '0', channels = '0', auxbuses = '0', maingrps = '0']: string[]): Promise<void> {
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
