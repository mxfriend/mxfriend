import { isBatchCapable } from '@mxfriend/common';
import { $Buffer, BufferInterface, EventEmitter, osc, OSCArgument } from '@mxfriend/osc';
import { EmulatorAdapterInterface } from './adapters';
import { EmulatorDispatcher } from './dispatcher';

export type NodeSubscription = {
  type: 'node';
  expires: number;
  next: number;
  interval: number;
  address: string;
};

export type FormatSubscription = {
  type: 'format';
  expires: number;
  next: number;
  interval: number;
  addresses: string[];
};

export type MeterSubscription = {
  type: 'meter';
  expires: number;
  next: number;
  interval: number;
  bank: number;
  param1?: number;
  param2?: number;
};

export type Subscription = NodeSubscription | FormatSubscription | MeterSubscription;

export type ClientEvents = {
  expire: [client: Client];
};

export enum Updates {
  None = 0,
  External = 1,
  All = 2,
}

const EXPIRATION_INTERVAL = 10_000;
const UPDATE_INTERVAL = 50;

export class Client extends EventEmitter<ClientEvents> {
  readonly address: string;
  readonly port: number;
  updates: Updates = Updates.None;

  private readonly adapter: EmulatorAdapterInterface;
  private readonly dispatcher: EmulatorDispatcher;
  private readonly subscriptions: Map<string, Subscription> = new Map();
  private subscriptionTmr?: NodeJS.Timeout;
  private updatesTmr?: NodeJS.Timeout;
  private expirationTmr?: NodeJS.Timeout;

  constructor(adapter: EmulatorAdapterInterface, dispatcher: EmulatorDispatcher, address: string, port: number) {
    super();
    this.adapter = adapter;
    this.dispatcher = dispatcher;
    this.address = address;
    this.port = port;
    this.postponeExpiration();
  }

  subscribeUpdates(feedback: boolean = true): void {
    this.updates = feedback ? Updates.All : Updates.External;

    if (this.updatesTmr) {
      clearTimeout(this.updatesTmr);
    }

    this.updatesTmr = setTimeout(() => this.updates = Updates.None, EXPIRATION_INTERVAL);
    this.postponeExpiration();
  }

  subscribeNode(address: string, factor: number = 1): void {
    const now = Date.now();

    this.subscriptions.set(address, {
      type: 'node',
      expires: now + EXPIRATION_INTERVAL,
      next: now,
      interval: factor * UPDATE_INTERVAL,
      address,
    });

    this.runSubscriptions();
    this.postponeExpiration();
  }

  async formatSubscribe(alias: string, patterns: string[], rangeStart: number, rangeEnd: number, factor: number = 1): Promise<void> {
    const now = Date.now();
    const addresses = this.adapter.resolveSubscriptionPatterns(patterns, rangeStart, rangeEnd);

    this.subscriptions.set(alias, {
      type: 'format',
      expires: now + EXPIRATION_INTERVAL,
      next: now,
      interval: factor * UPDATE_INTERVAL,
      addresses,
    });

    await this.runSubscriptions();
    this.postponeExpiration();
  }

  async subscribeMeters(alias: string, bank: number, param1?: number, param2?: number, factor: number = 1): Promise<void> {
    const now = Date.now();

    this.subscriptions.set(alias, {
      type: 'meter',
      expires: now + EXPIRATION_INTERVAL,
      next: now,
      interval: factor * UPDATE_INTERVAL,
      bank,
      param1,
      param2,
    });

    await this.runSubscriptions();
    this.postponeExpiration();
  }

  renewSubscriptions(...aliases: string[]): void {
    const now = Date.now();
    const keys = aliases.length ? aliases : this.subscriptions.keys();

    for (const alias of keys) {
      const subscription = this.subscriptions.get(alias);

      if (subscription) {
        subscription.expires = now + EXPIRATION_INTERVAL;
      }
    }

    this.postponeExpiration();
  }

  unsubscribe(...aliases: string[]): void {
    if (!aliases.length) {
      this.subscriptions.clear();
    } else {
      for (const alias of aliases) {
        this.subscriptions.delete(alias);
      }
    }

    this.cleanupSubscriptions();
  }

  private async runSubscriptions(): Promise<void> {
    this.subscriptionTmr && clearInterval(this.subscriptionTmr);
    await this.processSubscriptions();
    this.subscriptionTmr = setInterval(() => this.processSubscriptions(), 50);
  }

  private cleanupSubscriptions(): void {
    if (!this.subscriptions.size) {
      this.subscriptionTmr && clearInterval(this.subscriptionTmr);
      this.subscriptionTmr = undefined;
    }
  }

  private async processSubscriptions(): Promise<void> {
    const now = Date.now();

    for (const [alias, subscription] of this.subscriptions) {
      if (subscription.next <= now) {
        switch (subscription.type) {
          case 'node':
            await this.dispatcher.send(this.adapter.getMixer().$lookup(subscription.address), this);
            break;
          case 'format':
            await this.dispatcher.sendMessage(alias, this.getFormatSubscriptionPayload(subscription.addresses), this);
            break;
          case 'meter': {
            const data = this.adapter.getMeters().$get(subscription.bank).$toBatchBlob();
            await this.dispatcher.sendMessage(alias, osc.compose('b', data), this);
            break;
          }
        }

        subscription.next = now + subscription.interval;
      }

      if (subscription.expires <= now) {
        this.subscriptions.delete(alias);
      }
    }

    this.cleanupSubscriptions();
  }

  private getFormatSubscriptionPayload(addresses: string[]): OSCArgument[] {
    const payloads: BufferInterface[] = [];
    let size: number = 0;

    for (const address of addresses) {
      const node = this.adapter.getMixer().$lookup(address);

      if (isBatchCapable(node)) {
        const data = node.$toBatchBlob();
        size += data.byteLength;
        payloads.push(data);
      } else {
        break;
      }
    }

    const payload = $Buffer.concat([$Buffer.allocUnsafe(4), ...payloads]);
    payload.writeInt32LE(size + 4);
    return osc.compose('b', payload);
  }

  private postponeExpiration(): void {
    this.expirationTmr && clearTimeout(this.expirationTmr);
    this.expirationTmr = setTimeout(() => this.expire(), 3 * EXPIRATION_INTERVAL);
  }

  private expire(): void {
    this.emit('expire', this);
  }
}
