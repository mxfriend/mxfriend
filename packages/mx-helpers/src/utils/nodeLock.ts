import { Node } from '@mxfriend/oscom';

export class NodeLock {
  private readonly lockedNodes: Set<Node> = new Set();

  lock<Fn extends (...args: any[]) => Promise<void> | void>(node: Node, fn: Fn): Fn {
    const locked = async (...args: any[]) => {
      if (!this.lockedNodes.has(node)) {
        this.lockedNodes.add(node);
        await fn(...args);
        this.lockedNodes.delete(node);
      }
    };

    return locked as Fn;
  }
}
