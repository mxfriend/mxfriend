import { OSCMessage } from '@mxfriend/osc';
import { UdpOSCPeer, UdpOSCPort } from '@mxfriend/osc/udp';
import { RepeaterAdapterInterface } from './adapters';
import { Client } from './client';
import { SubscriptionManager } from './subscriptions';

type ClientMap = Iterable<Client> & {
  get(ip: string, port: number): Client;
};

export class Dispatcher {
  private readonly port: UdpOSCPort;
  private readonly adapter: RepeaterAdapterInterface;
  private readonly subscriptions: SubscriptionManager;
  private readonly clients: ClientMap;

  constructor(port: UdpOSCPort, adapter: RepeaterAdapterInterface, clients: ClientMap) {
    this.port = port;
    this.adapter = adapter;
    this.subscriptions = new SubscriptionManager(port);
    this.clients = clients;

    this.port.on('message', this.handleMessage.bind(this));

    setInterval(async () => this.port.send('/xremote'), 5000);
  }

  private async handleMessage(message: OSCMessage, peer?: UdpOSCPeer): Promise<void> {
    if (this.adapter.isMixer(peer)) {
      if (/^\/xremote(?:nfb)?$/.test(message.address)) {
        return;
      }

      if (!await this.subscriptions.handleMixerMessage(message)) {
        await this.forwardMixerMessage(message);
      }
    } else if (peer) {
      const client = this.clients.get(peer.ip, peer.port);

      if (message.address === '/xremote') {
        await this.port.send('/xremote', undefined, client);
        return;
      } else if (message.address === '/xremotenfb') {
        return;
      }

      if (!await this.subscriptions.handleClientMessage(client, message)) {
        await this.forwardClientMessage(message);
      }
    }
  }

  private async forwardMixerMessage(message: OSCMessage): Promise<void> {
    const filteredMessage = this.adapter.filterMixerMessage(message);

    if (!filteredMessage) {
      return;
    }

    await Promise.all([...this.clients].map(async (client) => {
      await this.port.send(filteredMessage.address, filteredMessage.args, client);
    }));
  }

  private async forwardClientMessage(message: OSCMessage): Promise<void> {
    const filteredMessage = this.adapter.filterClientMessage(message);

    if (filteredMessage) {
      await this.port.send(filteredMessage.address, filteredMessage.args);
    }
  }
}

