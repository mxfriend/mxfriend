import { osc, OSCMessage } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { Client } from '../client';
import {
  BatchSubscription,
  FormatSubscription,
  NodeSubscription,
  Subscription,
} from './subscription';

type SubscriptionType = 'node' | 'format' | 'batch';

export class SubscriptionManager {
  private readonly port: UdpOSCPort;
  private readonly subscriptions: Map<string, Subscription> = new Map();
  private readonly serverAliases: Map<string, Subscription> = new Map();
  private readonly clientAliases: Map<Client, Map<string, Subscription>> = new Map();
  private renewTmr?: NodeJS.Timeout;
  private aliasId: number = 0;

  constructor(port: UdpOSCPort) {
    this.port = port;
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  async handleClientMessage(client: Client, message: OSCMessage): Promise<boolean> {
    if (message.address === '/subscribe') {
      const [address, tf] = osc.extract(message.args, 's', 'i?');
      address && await this.subscribeNode(client, address, tf);
    } else if (message.address === '/formatsubscribe') {
      const [alias, patterns, start, end, tf] = osc.extract(message.args, 's', '...s', 'i', 'i', 'i?');
      alias && await this.formatSubscribe(client, alias, patterns, start, end, tf);
    } else if (message.address === '/batchsubscribe') {
      const [alias, address, param1, param2, tf] = osc.extract(message.args, 's', 's', 'i?', 'i?', 'i?');
      alias && await this.batchSubscribe(client, alias, address, param1, param2, tf);
    } else if (message.address === '/meters') {
      const [bank, param1, param2, tf] = osc.extract(message.args, 's', 'i?', 'i?', 'i?');
      bank && await this.batchSubscribe(client, bank, bank, param1, param2, tf);
    } else if (/^\/meters\/\d+$/.test(message.address)) {
      const [param1, param2, tf] = osc.extract(message.args, 'i?', 'i?', 'i?');
      await this.batchSubscribe(client, message.address, message.address, param1, param2, tf);
    } else if (message.address === '/renew') {
      const [alias] = osc.extract(message.args, 's?');
      this.renew(client, alias);
    } else if (message.address === '/unsubscribe') {
      const [alias] = osc.extract(message.args, 's?');
      this.unsubscribe(client, alias);
    } else {
      return false;
    }

    return true;
  }

  async handleMixerMessage(message: OSCMessage): Promise<boolean> {
    if (!message.address.startsWith('/s/')) {
      return false;
    }

    const subscription = this.serverAliases.get(message.address);

    if (!subscription) {
      return false;
    }

    await subscription.handle(message);
    return true;
  }

  async terminate(): Promise<void> {
    clearInterval(this.renewTmr);
    await this.port.send('/unsubscribe');
  }

  private async subscribeNode(client: Client, address: string, factor: number = 1): Promise<void> {
    await this.subscribe(client, address, 'node', address, 0, 0, factor);
  }

  private async formatSubscribe(client: Client, alias: string, patterns: string[], start: number, end: number, factor: number = 1): Promise<void> {
    await this.subscribe(client, alias, 'format', patterns, start, end, factor);
  }

  private async batchSubscribe(client: Client, alias: string, address: string, param1: number = 0, param2: number = 0, factor: number = 1): Promise<void> {
    await this.subscribe(client, alias, 'batch', address, param1, param2, factor);
  }

  private async subscribe(
    client: Client,
    alias: string,
    type: SubscriptionType,
    param0: string[] | string,
    param1: number = 0,
    param2: number = 0,
    factor: number = 1,
  ): Promise<void> {
    const subscription = this.getSubscription(type, param0, param1, param2);

    subscription.add(client, alias);
    this.clientAliases.has(client) || this.clientAliases.set(client, new Map());
    this.clientAliases.get(client)!.set(alias, subscription);
    client.on('expire', this.unsubscribe);

    await subscription.send(factor);
  }

  private renew(client: Client, alias?: string): void {
    this.applyToClientSubscriptions(client, alias, (subscription) => subscription.renew(client));
  }

  private unsubscribe(client: Client, alias?: string): void {
    this.applyToClientSubscriptions(client, alias, (subscription) => subscription.remove(client));
  }

  private applyToClientSubscriptions(client: Client, alias: string | undefined, cb: (subscription: Subscription) => void): void {
    const subscriptions = this.clientAliases.get(client);

    if (!subscriptions) {
      return;
    }

    if (alias) {
      const subscription = subscriptions.get(alias);
      subscription && cb(subscription);
    } else {
      subscriptions.forEach(cb);
    }
  }

  private getSubscription(
    type: SubscriptionType,
    param0: string[] | string,
    param1: number = 0,
    param2: number = 0,
  ): Subscription {
    const key = `${type}|${param0}|${param1}|${param2}`;
    const existing = this.subscriptions.get(key);

    if (existing) {
      return existing;
    }

    const subscription = this.createSubscription(key, type, param0, param1, param2);
    this.subscriptions.set(key, subscription);
    this.serverAliases.set(subscription.alias, subscription);

    subscription.on('clientRemoved', async (client, alias) => {
      await this.removeClientSubscription(subscription, client, alias);
    });

    if (this.subscriptions.size === 1) {
      this.renewTmr = setInterval(() => this.port.send('/renew'), 5000);
    }

    return subscription;
  }

  private createSubscription(
    key: string,
    type: SubscriptionType,
    param0: string[] | string,
    param1: number = 0,
    param2: number = 0,
  ): Subscription {
    switch (type) {
      case 'node': return new NodeSubscription(this.port, key, param0 as string);
      case 'format': return new FormatSubscription(this.port, key, this.createAlias(), param0 as string[], param1, param2);
      case 'batch': return new BatchSubscription(this.port, key, this.createAlias(), param0 as string, param1, param2);
    }
  }

  private async removeSubscription(subscription: Subscription): Promise<void> {
    await subscription.cleanup();
    this.serverAliases.delete(subscription.alias);
    this.subscriptions.delete(subscription.key);

    if (this.subscriptions.size < 1) {
      clearInterval(this.renewTmr);
    }
  }

  private async removeClientSubscription(subscription: Subscription, client: Client, alias: string): Promise<void> {
    this.clientAliases.get(client)?.delete(alias);

    if (!subscription.active) {
      await this.removeSubscription(subscription);
    }
  }

  private createAlias(): string {
    ++this.aliasId;
    return `/s/${this.aliasId.toString(36)}`;
  }
}
