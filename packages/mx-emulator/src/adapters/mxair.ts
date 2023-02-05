import { AbstractMeterBank, IpAddress } from '@mxfriend/common';
import { Mixer, MXAIR_UDP_PORT } from '@mxfriend/libmxair';
import { MXAirStereoLinkAdapter, StereoLinkAdapterInterface } from '@mxfriend/mx-helpers';
import { Collection } from '@mxfriend/oscom';
import { AbstractMXEmulatorAdapter, RangeAddressResolver } from './mx';
import { EmulatorAdapterInterface } from './types';

const supportedModels = [
  'XR18',
  'MR18',
];

export class MXAirAdapter extends AbstractMXEmulatorAdapter<Mixer> implements EmulatorAdapterInterface {
  static supports(model: string): boolean {
    return supportedModels.includes(model.toUpperCase());
  }

  constructor(model: string) {
    super(new Mixer(), model);
  }

  getPort(): number {
    return MXAIR_UDP_PORT;
  }

  getMeters(): Collection<AbstractMeterBank> {
    return this.mixer.meters;
  }

  createStereoLinkAdapter(): StereoLinkAdapterInterface {
    return new MXAirStereoLinkAdapter(this.mixer);
  }

  protected createRangeAddressResolver(sample: string): RangeAddressResolver {
    const m = sample.match(/^(?:.*\/)?(\*+)(?:\/.*)?$/);

    if (!m) {
      return (pattern: string, i: number) => {
        if (i > 30) return `/lr${pattern}`;
        if (i > 26) return `/fxsend/${i - 26}${pattern}`;
        if (i > 20) return `/bus/${i - 20}${pattern}`;
        if (i > 16) return `/rtn/${i - 16}${pattern}`;
        if (i > 15) return `/rtn/aux${pattern}`;
        return `/ch/${(i + 1).toString().padStart(2, '0')}${pattern}`;
      };
    }

    const placeholder = m[1];
    const re = new RegExp(placeholder.replace(/\*/g, '\\*'));
    const pad = placeholder.length > 1
      ? (v: number) => v.toString().padStart(placeholder.length, '0')
      : (v: number) => v.toString();

    return (pattern: string, i: number) => pattern.replace(re, pad(i + 1));
  }

  protected getBlankSceneFilePath(): string {
    return __dirname + '/data/mxair.blank.scn';
  }

  protected * getMixerIPNodes(): Iterable<IpAddress> {
    yield this.mixer['-prefs'].lan.addr;
    yield this.mixer['-prefs'].lan.gateway;
  }

  async initMixer(ip: string): Promise<void> {
    await super.initMixer(ip);

    const name = `${this.model} Emulator`;
    this.mixer['-prefs'].name.$set(name);
    this.mixer['-prefs'].ap.ssid.$set(name);
    this.mixer['-prefs'].is.ssid.$set(name);
  }
}
