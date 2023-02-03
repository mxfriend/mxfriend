import { osc, OSCArgument } from '@mxfriend/osc';
import { Collection, Command, Container, Node, Value } from '@mxfriend/oscom';
import { Mixer } from './mixer';

const $mixer = Symbol('mixer');

export abstract class AbstractNodeCommand extends Command {
  private [$mixer]?: Mixer;

  protected get $mixer(): Mixer {
    if (!this[$mixer]) {
      throw new Error('Node is not attached');
    }

    return this[$mixer];
  }

  $attached(parent: Container, address: string) {
    if (!(parent instanceof Mixer)) {
      throw new Error('This node can only be attached to a Root container');
    }

    super.$attached(parent, address);
    this[$mixer] = parent;
  }
}

export class NodeCommand extends AbstractNodeCommand {
  $call(address: string): void {
    this.$emit('local-call', osc.compose('s', address), this);
  }

  $handleCall(peer?: unknown, ...args: OSCArgument[]): OSCArgument | undefined {
    const [payload] = osc.extract(args, 's');
    const [address] = parseNodeText(payload ?? '');
    const node = address && this.$mixer.$lookup(address, false);
    let result: string | undefined;

    if (node instanceof Container) {
      const [data] = applyToCallable(node, [], (v) => v.$toText());
      data && data.length && (result = data.join(' '));
    } else if (node instanceof Value) {
      result = node.$toText();
    }

    return result === undefined ? undefined : osc.string(`${address} ${result}`);
  }
}

export class SlashCommand extends AbstractNodeCommand {
  $call(address: string, ...args: string[]): void {
    const payload = `${address.replace(/^\//, '')}${args.length ? ' ' : ''}${args.join(' ')}`;
    this.$emit('local-call', osc.compose('s', payload), this);
  }

  $handleCall(peer?: unknown, ...args: OSCArgument[]): OSCArgument | undefined {
    const [payload] = osc.extract(args, 's');
    const [address, ...values] = parseNodeText(payload ?? '');
    const node = address && this.$mixer.$lookup(address, false);
    let result: string | undefined;

    if (node instanceof Container) {
      applyToCallable(node, values, (n, v) => n.$fromText(v!, false, peer));
      const [data] = applyToCallable(node, [], (v) => v.$toText());
      data && data.length && (result = data.join(' '));
    } else if (node instanceof Value && values.length) {
      node.$fromText(values[0], false, peer);
      result = node.$toText();
    }

    return result === undefined ? undefined : osc.string(`${address} ${result}`);
  }
}


export function applyToCallable<A, R>(
  container: Container,
  args: A[],
  cb: (node: Value, arg?: A) => R | undefined,
): [R[] | undefined, Node[]] {
  if (!container.$callable) {
    return [undefined, [...container.$children()]];
  }

  const props = container.$getNodeProperties();
  const indices = container instanceof Collection ? [...new Array(container.$size).keys()] : [];
  const [result, unused] = container.$applyToValues(props.length ? props : indices, args, cb);
  return [result, (props.length ? unused.concat(indices) : unused).map((prop) => container.$get(prop))];
}

export function parseNodeText(line: string): string[] {
  const normalized = line.trim().replace(/^\/?/, '/').replace(/#.*$/, '');
  return [...normalized.matchAll(/"[^"]*"|\S+/g)].map((m) => m[0]);
}
