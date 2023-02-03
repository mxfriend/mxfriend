import { EventEmitter, isOSCType, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { MXAIR_UDP_PORT } from './constants';

export type MXAirMixerInfo = {
  name: string;
  model: string;
  firmwareVersion: string;
  ip: string;
};

export type MXAirDiscoveryEvents = {
  'mixer-found': [info: MXAirMixerInfo];
  'mixer-lost': [info: MXAirMixerInfo];
};

type MixerState = {
  info: MXAirMixerInfo;
  expire: NodeJS.Timeout;
};

export class MXAirDiscoveryService extends EventEmitter<MXAirDiscoveryEvents> {
  private readonly port: UdpOSCPort;
  private readonly mixers: Map<string, MixerState> = new Map();
  private readonly interval: number;
  private readonly expiration: number;
  private tmr?: NodeJS.Timeout;

  constructor(interval: number = 5000, expiration: number = interval * 3.5) {
    super();
    this.port = new UdpOSCPort({
      remoteAddress: '255.255.255.255',
      remotePort: MXAIR_UDP_PORT,
      broadcast: true,
    });
    this.interval = interval;
    this.expiration = expiration;
  }

  async start(): Promise<void> {
    this.port.subscribe('/xinfo', this.handleMessage.bind(this));
    await this.port.open();
    await this.port.send('/xinfo');
    this.tmr = setInterval(async () => this.port.send('/xinfo'), this.interval);
  }

  async stop(): Promise<void> {
    this.tmr && clearInterval(this.tmr);
    this.port.unsubscribe();
    await this.port.close();

    for (const { expire } of this.mixers.values()) {
      clearTimeout(expire);
    }

    this.mixers.clear();
  }

  private handleMessage({ args: [ip, name, model, fw] }: OSCMessage): void {
    if (isOSCType(ip, 's') && isOSCType(name, 's') && isOSCType(model, 's') && isOSCType(fw, 's')) {
      const existing = this.mixers.get(ip.value);

      if (existing) {
        clearTimeout(existing.expire);

        if (
          existing.info.name === name.value
          && existing.info.model === model.value
          && existing.info.firmwareVersion === fw.value
        ) {
          existing.expire = setTimeout(this.handleExpired.bind(this, ip.value), this.expiration);
          return;
        }
      }

      const info: MXAirMixerInfo = {
        name: name.value,
        model: model.value,
        firmwareVersion: fw.value,
        ip: ip.value,
      };

      const expire = setTimeout(this.handleExpired.bind(this, ip.value), this.expiration);

      this.mixers.set(ip.value, { info, expire });
      this.emit('mixer-found', info);
    }
  }

  private handleExpired(ip: string): void {
    const mixer = this.mixers.get(ip);

    if (mixer) {
      this.mixers.delete(ip);
      this.emit('mixer-lost', mixer.info);
    }
  }
}
