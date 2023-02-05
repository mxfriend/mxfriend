import { Node } from '@mxfriend/oscom';

export class NodeLock {
  private readonly lockedNodes: Set<Node> = new Set();

  lock<Fn extends (...args: any[]) => void>(node: Node, fn: Fn): Fn {
    const locked = (...args: any[]) => {
      if (!this.lockedNodes.has(node)) {
        this.lockedNodes.add(node);
        fn(...args);
        this.lockedNodes.delete(node);
      }
    };

    return locked as Fn;
  }
}
