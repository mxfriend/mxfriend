import { Container, Node, Value } from '@mxfriend/oscom';
import { applyToCallable } from '../types';

export class SceneSerializer {
  serialize(root: Node, withHidden: boolean = false): string {
    return [...this.serializeNode(root, withHidden)].join('');
  }

  *serializeNode(node: Node, hidden: boolean = false): IterableIterator<string> {
    if (!hidden && node.$address.startsWith('/-')) {
      return;
    }

    if (node instanceof Container) {
      const [results, unused] = applyToCallable(node, [], (node) => node.$toText());

      if (results && results.length) {
        yield `${node.$address} ${results.join(' ')}\n`;
      }

      for (const child of unused) {
        yield * this.serializeNode(child);
      }
    } else if (node instanceof Value) {
      if (node.$isSet()) {
        yield `${node.$address} ${node.$toText()}\n`;
      }
    }
  }
}
