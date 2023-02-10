import { sleep } from '@mxfriend/common';
import { Dispatcher, Value } from '@mxfriend/oscom';
import { NodeLock } from './nodeLock';

type ChangeHandler<T> = (value?: T) => void;

const $key = Symbol('ParamLink');

export class ParamLink<T = any> {
  private readonly dispatcher: Dispatcher;
  private readonly a: Value<T>;
  private readonly b: Value<T>;
  private readonly locks: NodeLock = new NodeLock();
  private readonly localHandlerA: ChangeHandler<T>;
  private readonly localHandlerB: ChangeHandler<T>;
  private readonly remoteHandlerA: ChangeHandler<T>;
  private readonly remoteHandlerB: ChangeHandler<T>;

  constructor(dispatcher: Dispatcher, a: Value<T>, b: Value<T>, delayed?: boolean) {
    this.dispatcher = dispatcher;
    this.a = a;
    this.b = b;

    const set = (n: Value<T>) => async (v?: T) => {
      delayed && await sleep(250);
      v !== undefined && n.$set(v, true);
    };

    this.localHandlerA = this.locks.lock(a, set(b));
    this.localHandlerB = this.locks.lock(b, set(a));
    this.remoteHandlerA = this.locks.lock(b, set(b));
    this.remoteHandlerB = this.locks.lock(a, set(a));

    a.$on('local-change', this.localHandlerA);
    b.$on('local-change', this.localHandlerB);
    a.$on('remote-change', this.remoteHandlerA);
    b.$on('remote-change', this.remoteHandlerB);

    dispatcher.add($key, a, b);
  }

  async sync(query: boolean = true): Promise<void> {
    if (!query) {
      this.b.$set(this.a.$get(), true);
    } else {
      const [a] = await this.dispatcher.query(this.a, this.b);
      this.b.$set(a, true);
    }
  }

  destroy(): void {
    this.dispatcher.remove($key, this.a, this.b);

    this.a.$off('local-change', this.localHandlerA);
    this.b.$off('local-change', this.localHandlerB);
    this.a.$off('remote-change', this.remoteHandlerA);
    this.b.$off('remote-change', this.remoteHandlerB);
  }
}
