import { UdpOSCPort } from '@mxfriend/osc/udp';
import { Repeater } from '../repeater';
import { RepeaterAdapterFactory } from './types';

export abstract class MXAdapterFactory implements RepeaterAdapterFactory {
  abstract supports(model: string): boolean;
  abstract create(localIp: string, mixerIp: string): Promise<Repeater>;

  protected async createMixerPort(mixerIp: string, mixerPort: number): Promise<UdpOSCPort> {
    const port = new UdpOSCPort({
      localPort: mixerPort,
      remoteAddress: mixerIp,
      remotePort: mixerPort,
    });

    await port.open();
    return port;
  }
}
