import { EventEmitter, osc, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';

export type MXMixerInfo = {
  name: string;
  model: string;
  firmwareVersion: string;
  ip: string;
};

export type DiscoveryEvents = {
  'mixer-found': [info: MXMixerInfo];
  'mixer-lost': [info: MXMixerInfo];
};

type MixerState = {
  info: MXMixerInfo;
  expire: NodeJS.Timeout;
};

export class MXDiscoveryService extends EventEmitter<DiscoveryEvents> {
  private readonly port: UdpOSCPort;
  private readonly mixers: Map<string, MixerState> = new Map();
  private readonly interval: number;
  private readonly expiration: number;
  private tmr?: NodeJS.Timeout;

  constructor(port: number, interval: number = 5000, expiration: number = interval * 3.5) {
    super();
    this.port = new UdpOSCPort({
      remoteAddress: '255.255.255.255',
      remotePort: port,
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

  getDiscoveredMixers(): MXMixerInfo[] {
    return [...this.mixers.values()].map((state) => state.info);
  }

  private handleMessage(message: OSCMessage): void {
    const [ip, name, model, firmwareVersion] = osc.extract(message.args, 's', 's', 's', 's');

    if (ip === undefined) {
      return;
    }

    const existing = this.mixers.get(ip);

    if (existing) {
      clearTimeout(existing.expire);

      if (
        existing.info.name === name
        && existing.info.model === model
        && existing.info.firmwareVersion === firmwareVersion
      ) {
        existing.expire = setTimeout(this.handleExpired.bind(this, ip), this.expiration);
        return;
      }
    }

    const info: MXMixerInfo = { name, model, firmwareVersion, ip };
    const expire = setTimeout(this.handleExpired.bind(this, ip), this.expiration);
    this.mixers.set(ip, { info, expire });

    this.emit('mixer-found', info);
  }

  private handleExpired(ip: string): void {
    const mixer = this.mixers.get(ip);

    if (mixer) {
      this.mixers.delete(ip);
      this.emit('mixer-lost', mixer.info);
    }
  }
}
