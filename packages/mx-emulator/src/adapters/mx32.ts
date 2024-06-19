import { AbstractMeterBank, BitmaskValue, Bool, CallCommand, IpAddress } from '@mxfriend/common';
import { Mixer, MX32_UDP_PORT } from '@mxfriend/libmx32';
import { MX32StereoLinkAdapter, StereoLinkAdapterInterface } from '@mxfriend/mx-helpers';
import { Collection, EnumValue } from '@mxfriend/oscom';
import { AbstractMXEmulatorAdapter, RangeAddressResolver } from './mx';
import { EmulatorAdapterInterface } from './types';

const supportedModels = [
  'X32',
  'X32RACK',
  'X32C',
  'X32P',
  'X32CORE',
  'M32',
  'M32C',
  'M32R',
];

export class MX32Adapter extends AbstractMXEmulatorAdapter<Mixer> implements EmulatorAdapterInterface {
  static supports(model: string): boolean {
    return supportedModels.includes(model.toUpperCase());
  }

  constructor(model: string) {
    super(new Mixer(), model);
  }

  getPort(): number {
    return MX32_UDP_PORT;
  }

  getMeters(): Collection<AbstractMeterBank> {
    return this.mixer.meters;
  }

  createStereoLinkAdapter(): StereoLinkAdapterInterface {
    return new MX32StereoLinkAdapter(this.mixer);
  }

  protected createRangeAddressResolver(sample: string): RangeAddressResolver {
    const m = sample.match(/^(?:.*\/)?(\*+)(?:\/.*)?$/);

    if (!m) {
      return (pattern: string) => pattern;
    }

    const placeholder = m[1];
    const re = new RegExp(placeholder.replace(/\*/g, '\\*'));
    const pad = placeholder.length > 1
      ? (v: number) => v.toString().padStart(placeholder.length, '0')
      : (v: number) => v.toString();

    return (pattern: string, i: number) => pattern.replace(re, pad(i));
  }

  protected getBlankSceneFilePath(): string {
    return __dirname + '/data/mx32.blank.scn';
  }

  protected * getMixerIPNodes(): Iterable<IpAddress> {
    yield this.mixer['-prefs'].ip.addr;
    yield this.mixer['-prefs'].ip.gateway;
  }

  protected * getMuteGroupNodes(): Iterable<EnumValue<Bool>> {
    yield * this.mixer.config.mute;
  }

  protected * getMuteGroupTargets(): Iterable<[mask: BitmaskValue, on: EnumValue<Bool>]> {
    for (const ch of [...this.mixer.ch, ...this.mixer.auxin, ...this.mixer.fxrtn, ...this.mixer.bus, ...this.mixer.mtx, this.mixer.main.st, this.mixer.main.m]) {
      yield [ch.grp.mute, ch.mix.on];
    }
  }

  protected * getSoloSwitchStates(): Iterable<EnumValue<Bool>> {
    yield * this.mixer['-stat'].solosw;
  }

  protected getGlobalSoloState(): EnumValue<Bool> {
    return this.mixer['-stat'].solo;
  }

  protected getClearSoloCommand(): CallCommand {
    return this.mixer['-action'].clearsolo;
  }

  async initMixer(ip: string): Promise<void> {
    await super.initMixer(ip);

    const name = `${this.model} Emulator`;
    this.mixer['-prefs'].name.$set(name);
  }
}
