import { OSCMessage } from '@mxfriend/osc';
import { MXRepeaterAdapter } from './mxAdapter';

export class MX32Adapter extends MXRepeaterAdapter {
  filterMixerMessage(message: OSCMessage): OSCMessage | undefined {
    switch (message.address) {
      case '/info': return this.prefixMixerName(message, 1);
      case '/xinfo': return this.prefixMixerName(this.setLocalIp(message, 0), 1);
      case '/status': return this.prefixMixerName(this.setLocalIp(message, 1), 2);
      case '/-prefs/name': return this.prefixMixerName(message, 0);
      case '/-prefs/ip/addr': return this.setLocalIpBytes(message);
      case '/-prefs/ip/addr/0': return this.setLocalIpByte(message, 0, 0);
      case '/-prefs/ip/addr/1': return this.setLocalIpByte(message, 0, 1);
      case '/-prefs/ip/addr/2': return this.setLocalIpByte(message, 0, 2);
      case '/-prefs/ip/addr/3': return this.setLocalIpByte(message, 0, 3);
    }

    return message;
  }

  filterClientMessage(message: OSCMessage): OSCMessage | undefined {
    switch (message.address) {
      case '/info': return this.unprefixMixerName(message, 1);
      case '/xinfo': return this.unprefixMixerName(this.setMixerIp(message, 0), 1);
      case '/status': return this.unprefixMixerName(this.setMixerIp(message, 1), 2);
      case '/-prefs/name': return this.unprefixMixerName(message, 0);
      case '/-prefs/ip/addr': return this.setMixerIpBytes(message);
      case '/-prefs/ip/addr/0': return this.setMixerIpByte(message, 0, 0);
      case '/-prefs/ip/addr/1': return this.setMixerIpByte(message, 0, 1);
      case '/-prefs/ip/addr/2': return this.setMixerIpByte(message, 0, 2);
      case '/-prefs/ip/addr/3': return this.setMixerIpByte(message, 0, 3);
    }

    return message;
  }
}
