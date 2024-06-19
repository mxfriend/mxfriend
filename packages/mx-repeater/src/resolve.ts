import { MXDiscoveryService, MXMixerInfo } from '@mxfriend/common';
import { MX32_UDP_PORT } from '@mxfriend/libmx32';
import { MXAIR_UDP_PORT } from '@mxfriend/libmxair';
import { networkInterfaces } from 'node:os';

export async function resolveMixer(mode?: string, ip?: string): Promise<MXMixerInfo> {
  const discovery: MXDiscoveryService[] = [];
  let timeout: NodeJS.Timeout | undefined = undefined;

  const mixer = new Promise<MXMixerInfo>((resolve, reject) => {
    if (mode !== 'mx32') {
      discovery.push(createDiscoveryService(MXAIR_UDP_PORT, resolve, ip));
    }

    if (mode !== 'mxair') {
      discovery.push(createDiscoveryService(MX32_UDP_PORT, resolve, ip));
    }

    timeout = setTimeout(() => reject(new Error('Mixer not found')), 10000);
  });

  try {
    await Promise.all(discovery.map(async (service) => service.start()));
    return await mixer;
  } finally {
    clearTimeout(timeout);
    await Promise.all(discovery.map(async (service) => service.stop()));
  }
}

function createDiscoveryService(port: number, cb: (info: MXMixerInfo) => void, ip?: string): MXDiscoveryService {
  const service = new MXDiscoveryService(port, 2000);

  service.on('mixer-found', (info) => {
    if (!ip || info.ip === ip) {
      cb(info);
    }
  });

  return service;
}

export function resolveLocalIp(mixerIp: string): string {
  const mixer = ipToBigint(mixerIp);

  for (const ifaces of Object.values(networkInterfaces())) if (ifaces) {
    for (const iface of ifaces) if (iface.family === 'IPv4') {
      const mask = ipToBigint(iface.netmask);
      const ip = ipToBigint(iface.address);

      if ((ip & mask) === (mixer & mask)) {
        return iface.address;
      }
    }
  }

  throw new Error('Unable to resolve local IP');
}

function ipToBigint(ip: string): bigint {
  return ip.split(/\./g).reduceRight((v, word, i) => v | (BigInt(parseInt(word, 10)) << BigInt(24 - 8 * i)), 0n);
}
