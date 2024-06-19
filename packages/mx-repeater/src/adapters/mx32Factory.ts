import { MX32_UDP_PORT } from '@mxfriend/libmx32';
import { Repeater } from '../repeater';
import { MX32Adapter } from './mx32Adapter';
import { MXAdapterFactory } from './mxFactory';

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

export class MX32AdapterFactory extends MXAdapterFactory {
  supports(model: string): boolean {
    return supportedModels.includes(model.toUpperCase());
  }

  async create(localIp: string, mixerIp: string): Promise<Repeater> {
    const port = await this.createMixerPort(mixerIp, MX32_UDP_PORT);
    return new Repeater(port, new MX32Adapter(localIp, mixerIp, MX32_UDP_PORT));
  }
}
