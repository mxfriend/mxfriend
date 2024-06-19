import { OSCMessage } from '@mxfriend/osc';
import { UdpOSCPeer } from '@mxfriend/osc/udp';
import { Repeater } from '../repeater';

export interface RepeaterAdapterFactory {
  supports(model: string): boolean;
  create(localIp: string, mixerIp: string): Promise<Repeater>;
}

export interface RepeaterAdapterInterface {
  isMixer(peer?: UdpOSCPeer): boolean;
  filterClientMessage(message: OSCMessage): OSCMessage | undefined;
  filterMixerMessage(message: OSCMessage): OSCMessage | undefined;
}
