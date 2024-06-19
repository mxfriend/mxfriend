import { isOSCType, OSCArgumentOfType, OSCMessage, OSCType } from '@mxfriend/osc';
import { UdpOSCPeer } from '@mxfriend/osc/udp';
import { RepeaterAdapterInterface } from './types';

type OSCVal<T extends OSCType> = OSCArgumentOfType<T>['value'];

export abstract class MXRepeaterAdapter implements RepeaterAdapterInterface {
  private readonly localIp: string;
  private readonly localIpBytes: number[];
  private readonly mixerIp: string;
  private readonly mixerIpBytes: number[];
  private readonly mixerPort: number;

  constructor(localIp: string, mixerIp: string, mixerPort: number) {
    this.localIp = localIp;
    this.localIpBytes = localIp.split(/\./g).map((byte) => parseInt(byte, 10));
    this.mixerIp = mixerIp;
    this.mixerIpBytes = mixerIp.split(/\./g).map((byte) => parseInt(byte, 10));
    this.mixerPort = mixerPort;
  }

  abstract filterMixerMessage(message: OSCMessage): OSCMessage | undefined;
  abstract filterClientMessage(message: OSCMessage): OSCMessage | undefined;

  protected prefixMixerName(message: OSCMessage, idx: number): OSCMessage {
    return this.filterArg(message, idx, 's', (name) => name.replace(/^(?:Proxy:\s*)?/i, 'Proxy: '));
  }

  protected unprefixMixerName(message: OSCMessage, idx: number): OSCMessage {
    return this.filterArg(message, idx, 's', (name) => name.replace(/^Proxy:\s*/i, ''));
  }

  protected setMixerIp(message: OSCMessage, idx: number): OSCMessage {
    return this.filterArg(message, idx, 's', () => this.mixerIp);
  }

  protected setLocalIp(message: OSCMessage, idx: number): OSCMessage {
    return this.filterArg(message, idx, 's', () => this.localIp);
  }

  protected setMixerIpBytes(message: OSCMessage): OSCMessage {
    for (let i = 0; i < 4; ++i) {
      message = this.setMixerIpByte(message, i, i);
    }

    return message;
  }

  protected setLocalIpBytes(message: OSCMessage): OSCMessage {
    for (let i = 0; i < 4; ++i) {
      message = this.setLocalIpByte(message, i, i);
    }

    return message;
  }

  protected setMixerIpByte(message: OSCMessage, idx: number, byte: number): OSCMessage {
    return this.filterArg(message, idx, 'i', () => this.mixerIpBytes[byte]);
  }

  protected setLocalIpByte(message: OSCMessage, idx: number, byte: number): OSCMessage {
    return this.filterArg(message, idx, 'i', () => this.localIpBytes[byte]);
  }

  protected filterArg<T extends OSCType>(
    message: OSCMessage,
    idx: number,
    type: T,
    cb: (value: OSCVal<T>) => OSCVal<T>,
  ): OSCMessage {
    const arg = message.args[idx];

    if (isOSCType(arg, type)) {
      arg.value = cb(arg.value as OSCVal<T>);
    }

    return message;
  }

  isMixer(peer?: UdpOSCPeer): boolean {
    return peer?.ip === this.mixerIp && peer.port === this.mixerPort;
  }
}
