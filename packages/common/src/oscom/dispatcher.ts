import {
  AbstractOSCPort,
  AnyEventHandler,
  Cursor,
  osc,
  OSCArgument,
  OSCMessage,
} from '@mxfriend/osc';
import { Dispatcher, Node } from '@mxfriend/oscom';
import { Mixer, SubscriptionCommand, UnsubscribeCommand, XRemoteCommand } from '../types';
import { AbstractMeterBank } from './meters';
import { isBatchCapable } from './types';

const $dispatcher = Symbol('dispatcher');

export class MXDispatcher extends Dispatcher {
  private readonly mixer: Mixer;
  private readonly subscriptions: Map<string, string[]> = new Map();
  private renewalTmr?: NodeJS.Timeout;
  private updateTmr?: NodeJS.Timeout;

  constructor(port: AbstractOSCPort, mixer: Mixer) {
    super(port);
    this.mixer = mixer;

    this.add(
      $dispatcher,
      mixer.info,
      mixer.xinfo,
      mixer.status,
      mixer[''],
      mixer.node,
      mixer.xremote,
      mixer.xremotenfb,
      mixer.subscribe,
      mixer.formatsubscribe,
      mixer.batchsubscribe,
      mixer.renew,
      mixer.unsubscribe,
    );
  }

  async requestUpdates(): Promise<void> {
    this.cancelUpdates();
    await this.port.send('/xremotenfb');
    this.updateTmr = setInterval(async () => this.port.send('/xremotenfb'), 4500);
  }

  cancelUpdates(): void {
    this.updateTmr && clearInterval(this.updateTmr);
  }

  protected * createNodeListeners(node: Node): IterableIterator<[string, AnyEventHandler]> {
    yield * super.createNodeListeners(node);

    if (node instanceof AbstractMeterBank) {
      yield ['local-subscribe', async (args: OSCArgument[]) => {
        await this.port.send('/meters', [osc.string(node.$address), ...args]);
        this.registerSubscription(node.$address);
      }];

      yield ['local-unsubscribe', () => {
        this.unregisterSubscription(node.$address);
      }];
    } else if (node instanceof XRemoteCommand) {
      yield ['local-call', async () => this.requestUpdates()];
    } else if (node instanceof SubscriptionCommand) {
      yield ['local-call', (args: OSCArgument[]) => {
        const [alias, patterns, range] = osc.extract(args, 's', '...s', '...i');

        if (alias) {
          const [start, end] = range.length > 2 ? range : [0, 0];
          this.registerSubscription(alias, this.expandSubscriptionPatterns(patterns, start, end));
        }
      }];
    } else if (node instanceof UnsubscribeCommand) {
      yield ['local-call', (args: OSCArgument[]) => {
        const [alias] = osc.extract(args, 's');
        this.unregisterSubscription(alias);
      }];
    }
  }


  protected registerSubscription(alias: string, addresses: string[] = []): void {
    this.subscriptions.set(alias, addresses);

    if (addresses.length) {
      this.port.subscribe(alias, this.handleSubscriptionPayload);
    }

    if (this.renewalTmr === undefined) {
      this.renewalTmr = setInterval(() => this.port.send('/renew'), 4500);
    }
  }

  protected unregisterSubscription(alias?: string): void {
    const aliases = alias ? [alias] : this.subscriptions.keys();

    for (const a of aliases) {
      this.subscriptions.delete(a);
      this.port.unsubscribe(a, this.handleSubscriptionPayload);
    }

    if (!this.subscriptions.size) {
      clearInterval(this.renewalTmr);
      this.renewalTmr = undefined;
    }
  }

  protected handleSubscriptionPayload(message: OSCMessage, peer?: unknown): void {
    const subscription = this.subscriptions.get(message.address);
    const [payload] = osc.extract(message.args, 'b');

    if (!subscription || !subscription.length || !payload) {
      return;
    }

    const cursor = new Cursor();
    cursor.inc(4);

    for (const address of subscription) {
      const node = this.mixer.$lookup(address);

      if (isBatchCapable(node)) {
        node.$fromBatchBlob(payload, cursor, false, peer);
      }
    }
  }

  protected expandSubscriptionPatterns(patterns: string[], start: number, end: number): string[] {
    const addresses: string[] = [];

    for (const pattern of patterns) {
      const m = pattern.match(/^(.*?)(\*+)(.*)$/);

      if (m) {
        for (let i = start; i <= end; ++i) {
          addresses.push(`${m[1]}${i.toString().padStart(m[2].length, '0')}${m[3]}`);
        }
      } else {
        addresses.push(pattern);
      }
    }

    return addresses;
  }
}
