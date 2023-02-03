import { Container, Node, Value } from '@mxfriend/oscom';
import { applyToCallable } from '../types';

export class SceneSerializer {
  serialize(root: Node): string {
    return [...this.serializeNode(root)].join('');
  }

  *serializeNode(node: Node): IterableIterator<string> {
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
