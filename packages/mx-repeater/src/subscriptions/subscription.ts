import { EventEmitter, EventMap, osc, OSCArgument, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { clearTimeout } from 'timers';
import { Client } from '../client';

type ClientData = {
  alias: string;
  tmr: NodeJS.Timeout;
};

const EXPIRATION_TIMEOUT = 10_000;

export interface SubscriptionEvents extends EventMap {
  clientRemoved: [client: Client, alias: string];
}

export abstract class Subscription extends EventEmitter<SubscriptionEvents> {
  readonly key: string;
  readonly alias: string;

  private readonly port: UdpOSCPort;
  protected readonly clients: Map<Client, ClientData> = new Map();
  protected factor?: number;

  constructor(port: UdpOSCPort, key: string, alias: string) {
    super();
    this.port = port;
    this.key = key;
    this.alias = alias;
  }

  public add(client: Client, alias: string): void {
    const existing = this.clients.get(client);

    if (existing) {
      if (existing.alias !== alias) {
        this.removeClient(client, existing);
      } else {
        this.postponeExpiration(client, existing);
        return;
      }
    }

    this.clients.set(client, {
      alias,
      tmr: this.scheduleExpiration(client),
    });
  }

  public renew(client: Client): void {
    const data = this.clients.get(client);

    if (data) {
      this.postponeExpiration(client, data);
    }
  }

  public remove(client: Client): void {
    const data = this.clients.get(client);

    if (data) {
      this.removeClient(client, data);
    }
  }

  public get active(): boolean {
    return this.clients.size > 0;
  }

  public async cleanup(): Promise<void> {
    this.off();
    [...this.clients].map(([client, data]) => this.removeClient(client, data));
    this.clients.clear();
    this.factor = undefined;
    await this.port.send('/unsubscribe', osc.compose('s', this.alias));
  }

  public async send(factor: number): Promise<void> {
    if (this.factor === undefined || factor < this.factor) {
      this.factor = factor;
      await this.port.send(...this.compose(factor));
    }
  }

  protected abstract compose(factor: number): [address: string, args: OSCArgument[]];

  public async handle(message: OSCMessage): Promise<void> {
    for (const [client, data] of this.clients) {
      await this.port.send(data.alias, message.args, client);
    }
  }

  private removeClient(client: Client, data: ClientData): void {
    clearTimeout(data.tmr);
    this.clients.delete(client);
    this.emit('clientRemoved', client, data.alias);
  }

  private postponeExpiration(client: Client, data: ClientData): void {
    clearTimeout(data.tmr);
    data.tmr = this.scheduleExpiration(client);
  }

  private scheduleExpiration(client: Client): NodeJS.Timeout {
    return setTimeout(() => this.remove(client), EXPIRATION_TIMEOUT);
  }
}

export class NodeSubscription extends Subscription {
  protected compose(factor: number): [address: string, args: OSCArgument[]] {
    return ['/subscribe', osc.compose('s', this.alias, 'i', factor)];
  }
}

export class FormatSubscription extends Subscription {
  private readonly patterns: string[];
  private readonly start: number;
  private readonly end: number;

  constructor(port: UdpOSCPort, key: string, alias: string, patterns: string[], start: number, end: number) {
    super(port, key, alias);
    this.patterns = patterns;
    this.start = start;
    this.end = end;
  }

  protected compose(factor: number): [address: string, args: OSCArgument[]] {
    return ['/formatsubscribe', osc.compose('s', this.alias, '...s', this.patterns, 'i', this.start, 'i', this.end, 'i', factor)];
  }
}

export class BatchSubscription extends Subscription {
  private readonly address: string;
  private readonly param1: number;
  private readonly param2: number;

  constructor(port: UdpOSCPort, key: string, alias: string, address: string, param1: number, param2: number) {
    super(port, key, alias);
    this.address = address;
    this.param1 = param1;
    this.param2 = param2;
  }

  protected compose(factor: number): [address: string, args: OSCArgument[]] {
    return ['/batchsubscribe', osc.compose('s', this.alias, 's', this.address, 'i', this.param1, 'i', this.param2, 'i', factor)];
  }
}
