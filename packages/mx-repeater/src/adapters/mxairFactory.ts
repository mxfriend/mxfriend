import { MXAIR_UDP_PORT } from '@mxfriend/libmxair';
import { Repeater } from '../repeater';
import { MXAirAdapter } from './mxairAdapter';
import { MXAdapterFactory } from './mxFactory';

const supportedModels = [
  'XR18',
  'MR18',
];

export class MXAirAdapterFactory extends MXAdapterFactory {
  supports(model: string): boolean {
    return supportedModels.includes(model.toUpperCase());
  }

  async create(localIp: string, mixerIp: string): Promise<Repeater> {
    const port = await this.createMixerPort(mixerIp, MXAIR_UDP_PORT);
    return new Repeater(port, new MXAirAdapter(localIp, mixerIp, MXAIR_UDP_PORT));
  }
}
