import { UdpOSCPort } from '@mxfriend/osc/udp';
import { MXAIR_UDP_PORT } from './constants';

export type MXAirOSCPortOptions = {
  mixerAddress: string;
  localAddress?: string;
  localPort?: number;
};

export class MXAirOSCPort extends UdpOSCPort {
  constructor({ mixerAddress, ...options }: MXAirOSCPortOptions) {
    super({
      ...options,
      remotePort: MXAIR_UDP_PORT,
      remoteAddress: mixerAddress,
    });
  }
}
