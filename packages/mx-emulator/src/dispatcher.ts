import {
  AbstractMeterBank,
  BatchSubscribeCommand,
  FormatSubscribeCommand, RenewCommand, SubscribeCommand, UnsubscribeCommand,
  XRemoteCommand,
} from '@mxfriend/common';
import { StereoLink } from '@mxfriend/mx-helpers';
import { AnyEventHandler, osc, OSCArgument } from '@mxfriend/osc';
import { UdpOSCPeer, UdpOSCPort } from '@mxfriend/osc/udp';
import { Container, Dispatcher, Node, Value } from '@mxfriend/oscom';
import { EmulatorAdapterInterface } from './adapters';
import { Client, Updates } from './client';

export type ClientMap = Iterable<Client> & {
  get(ip: string, port: number): Client;
};

const $key = Symbol('EmulatorDispatcher');

export class EmulatorDispatcher extends Dispatcher {
  private readonly adapter: EmulatorAdapterInterface;
  private readonly stereoLink: StereoLink;
  private readonly clients: ClientMap;

  constructor(port: UdpOSCPort, adapter: EmulatorAdapterInterface, clients: ClientMap) {
    super(port);
    this.adapter = adapter;
    this.stereoLink = new StereoLink(adapter.createStereoLinkAdapter(), this, true);
    this.clients = clients;
    this.handleNodeChange = this.handleNodeChange.bind(this);
  }

  async init(): Promise<void> {
    this.add($key, this.adapter.getMixer());
    await this.stereoLink.init();

    this.stereoLink.on('link', (a, b, native) => {
      native && this.stereoLink.link(a, b);
    });

    this.stereoLink.on('unlink', (a, b, native) => {
      native && this.stereoLink.unlink(a);
    });
  }

  async send(node: Node, client: Client): Promise<void> {
    await this.broadcastNode(node, [client]);
  }

  async sendMessage(address: string, args: OSCArgument[], client: Client): Promise<void> {
    await this.broadcastMessage(address, args, [client]);
  }

  async broadcast(node: Node): Promise<void> {
    await this.broadcastNode(node, this.resolveClients());
  }

  protected * createNodeListeners(node: Node): IterableIterator<[string, AnyEventHandler]> {
    if (node instanceof Value) {
      yield ['local-change', this.handleNodeChange];
      yield ['remote-change', this.handleNodeChange];
    } else if (node instanceof XRemoteCommand) {
      yield ['remote-call', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const client = peer && this.clients.get(peer.ip, peer.port);
        client && client.subscribeUpdates(node.$address === '/xremote');
      }];
    } else if (node instanceof SubscribeCommand) {
      yield ['remote-call', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const [address, tf] = osc.extract(args, 's', 'i?');
        const client = peer && this.clients.get(peer.ip, peer.port);
        address && client && client.subscribeNode(address, tf);
      }];
    } else if (node instanceof FormatSubscribeCommand) {
      yield ['remote-call', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const [alias, patterns, start, end, tf] = osc.extract(args, 's', '...s', 'i', 'i', 'i');
        const client = peer && this.clients.get(peer.ip, peer.port);
        alias && client && await client.formatSubscribe(alias, patterns, start, end, tf);
      }];
    } else if (node instanceof BatchSubscribeCommand) {
      yield ['remote-call', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const [alias, pattern, start, end, tf] = osc.extract(args, 's', 's', 'i', 'i', 'i');
        const client = peer && this.clients.get(peer.ip, peer.port);
        alias && client && pattern.startsWith('/meters/') && await client.subscribeMeters(alias, parseInt(pattern.slice(8), 10), start, end, tf);
      }];
    } else if (node instanceof AbstractMeterBank) {
      yield ['remote-subscribe', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const [start, end, tf] = osc.extract(args, 'i?', 'i?', 'i?');
        const client = peer && this.clients.get(peer.ip, peer.port);
        client && await client.subscribeMeters(node.$address, this.adapter.getMeters().$indexOf(node), start, end, tf);
      }];
    } else if (node instanceof RenewCommand) {
      yield ['remote-call', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const [aliases = []] = osc.extract(args, '...s');
        const client = peer && this.clients.get(peer.ip, peer.port);
        client && client.renewSubscriptions(...aliases);
      }];
    } else if (node instanceof UnsubscribeCommand) {
      yield ['remote-call', async (args: OSCArgument[], node: any, peer?: UdpOSCPeer): Promise<void> => {
        const [aliases = []] = osc.extract(args, '...s');
        const client = peer && this.clients.get(peer.ip, peer.port);
        client && client.unsubscribe(...aliases);
      }];
    }
  }

  private async handleNodeChange(value: unknown, node: Value, peer?: unknown): Promise<void> {
    await this.broadcastValue(node, this.resolveClients(peer));
  }

  private resolveClients(peer?: unknown): Client[] {
    return [...this.clients].filter(getClientFilter(peer));
  }

  private async broadcastNode(node: Node, clients: Client[]): Promise<void> {
    if (node instanceof Container) {
      const [args, unused] = node.$applyToCallable([], (v) => v.$toOSC());

      if (args && args.length) {
        await this.broadcastMessage(node.$address, args, clients);
      }

      for (const child of unused) {
        await this.broadcastNode(node.$get(child), clients);
      }
    } else if (node instanceof Value) {
      await this.broadcastValue(node, clients);
    }
  }

  private async broadcastValue(value: Value, clients: Client[]): Promise<void> {
    const arg = value.$toOSC();
    arg && await this.broadcastMessage(value.$address, [arg], clients);
  }

  private async broadcastMessage(address: string, args: OSCArgument[], clients: Client[]): Promise<void> {
    await Promise.all(clients.map((client) => {
      this.port.send(address, args, { ip: client.address, port: client.port });
    }));
  }
}

function isUdpOSCPeer(peer?: unknown): peer is UdpOSCPeer {
  return !!peer
    && typeof peer === 'object'
    && 'ip' in peer
    && typeof peer.ip === 'string'
    && 'port' in peer
    && typeof peer.port === 'number';
}

function getClientFilter(peer?: unknown): (client: Client) => boolean {
  if (isUdpOSCPeer(peer)) {
    return (client) => client.updates === Updates.All
      || (client.updates === Updates.External && (client.address !== peer.ip || client.port !== peer.port));
  } else {
    return (client) => client.updates !== Updates.None;
  }
}
