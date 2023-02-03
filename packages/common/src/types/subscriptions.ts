import { osc } from '@mxfriend/osc';
import { Command, Node } from '@mxfriend/oscom';
import { frequencyToTf } from '../utils';


export class XRemoteCommand extends Command {
  $call(): void {
    this.$emit('local-call', [], this);
  }
}


export abstract class SubscriptionCommand extends Command {
  // just a marker class for instanceof checks
}


export class SubscribeCommand extends SubscriptionCommand {
  $call(addressOrNode: Node | string, frequency: number = 10): void {
    const address = typeof addressOrNode !== 'string' ? addressOrNode.$address : addressOrNode;
    const tf = frequencyToTf(frequency);
    this.$emit('local-call', osc.compose('s', address, 'i', tf), this);
  }
}


export class FormatSubscribeCommand extends SubscriptionCommand {
  $call(
    alias: string,
    patterns: string | [string, ...string[]],
    rangeStart: number = 0,
    rangeEnd: number = 0,
    frequency: number = 10,
  ): void {
    const args = osc.compose(
      's', alias,
      '...s', Array.isArray(patterns) ? patterns : [patterns],
      'i', rangeStart,
      'i', rangeEnd,
      'i', frequencyToTf(frequency),
    );

    this.$emit('local-call', args, this);
  }
}

export class BatchSubscribeCommand extends SubscriptionCommand {
  $call(
    alias: string,
    addressOrBank: string | number,
    rangeStart: number = 0,
    rangeEnd: number = 0,
    frequency: number = 10,
  ): void {
    const args = osc.compose(
      's', alias,
      's', typeof addressOrBank === 'number' ? `/meters/${addressOrBank}` : addressOrBank,
      'i', rangeStart,
      'i', rangeEnd,
      'i', frequencyToTf(frequency),
    );

    this.$emit('local-call', args, this);
  }
}

export class RenewCommand extends Command {
  $call(aliasOrAddressOrNode?: Node | string): void {
    const arg = typeof aliasOrAddressOrNode !== 'string' ? aliasOrAddressOrNode?.$address : aliasOrAddressOrNode;
    this.$emit('local-call', osc.compose('s?', arg), this);
  }
}

export class UnsubscribeCommand extends Command {
  $call(aliasOrAddressOrNode?: Node | string): void {
    const arg = typeof aliasOrAddressOrNode !== 'string' ? aliasOrAddressOrNode?.$address : aliasOrAddressOrNode;
    this.$emit('local-call', osc.compose('s?', arg), this);
  }
}

