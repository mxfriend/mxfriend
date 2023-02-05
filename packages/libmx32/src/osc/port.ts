import { UdpOSCPort } from '@mxfriend/osc/udp';
import { MX32_UDP_PORT } from './constants';

export type MX32OSCPortOptions = {
  mixerAddress: string;
  localAddress?: string;
  localPort?: number;
};

export class MX32OSCPort extends UdpOSCPort {
  constructor({ mixerAddress, ...options }: MX32OSCPortOptions) {
    super({
      ...options,
      remotePort: MX32_UDP_PORT,
      remoteAddress: mixerAddress,
    });
  }
}
