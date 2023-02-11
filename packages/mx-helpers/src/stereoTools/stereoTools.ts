import { MappedValue } from '@mxfriend/common';
import { Container, Dispatcher, pairs, ScaledValue } from '@mxfriend/oscom';
import { HelperInfo, HelperInterface, HelperState } from '../helpers';
import { StereoLink } from '../stereoLink';
import { StereoToolsAdapterInterface } from './types';

const $key = Symbol('StereoTools');

export class StereoTools implements HelperInterface {
  private readonly adapter: StereoToolsAdapterInterface;
  private readonly dispatcher: Dispatcher;
  private readonly stereoLink: StereoLink;
  private readonly pairs: Map<Container, Container> = new Map();
  private readonly map: Map<ScaledValue | MappedValue, () => void> = new Map();

  constructor(adapter: StereoToolsAdapterInterface, dispatcher: Dispatcher, stereoLink: StereoLink) {
    this.adapter = adapter;
    this.dispatcher = dispatcher;
    this.stereoLink = stereoLink;
    this.setup = this.setup.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  init(): void {
    this.stereoLink.on('link', this.setup);
    this.stereoLink.on('unlink', this.cleanup);
  }

  getInfo(): HelperInfo {
    return {
      name: 'Stereo Tools',
    };
  }

  getState(channels: Container[]): HelperState {
    const linked = channels.length === 2 && this.stereoLink.isLinked(channels[0], channels[1]);
    return !linked ? 'unavailable' : this.pairs.has(channels[0]) ? 'active' : 'inactive';
  }

  async activate([a, b]: Container[]): Promise<void> {
    await this.setup(a, b);
  }

  deactivate([a, b]: Container[]): void {
    this.cleanup(a, b);
  }

  destroy(): void {
    this.stereoLink.off('link', this.setup);
    this.stereoLink.off('unlink', this.cleanup);

    for (const [node, handler] of this.map) {
      this.dispatcher.remove($key, node);
      node.$off('remote-change', handler);
      this.map.delete(node);
    }
  }

  async setup(a: Container, b: Container): Promise<void> {
    if (this.pairs.has(a) || this.pairs.has(b)) {
      return;
    }

    this.pairs.set(a, b);
    this.pairs.set(b, a);

    for (const [pa, pb] of pairs(this.adapter.getMixPanNodes(a), this.adapter.getMixPanNodes(b))) {
      await this.setupPair(pa, pb);
    }
  }

  cleanup(a: Container, b: Container): void {
    if (this.pairs.get(a) !== b) {
      return;
    }

    this.pairs.delete(a);
    this.pairs.delete(b);

    for (const [pa, pb] of pairs(this.adapter.getMixPanNodes(a), this.adapter.getMixPanNodes(b))) {
      this.cleanupPair(pa, pb);
    }
  }

  private async setupPair(a: ScaledValue | MappedValue, b: ScaledValue | MappedValue): Promise<void> {
    await this.dispatcher.addAndQuery($key, a, b);

    const lock = createMutualLock();
    let center: number = Math.round(a.$toValue()! + b.$toValue()!) / 2;
    let width: number = Math.round(b.$toValue()! - a.$toValue()!);
    let tmr: NodeJS.Timeout | undefined = undefined;

    const reset = () => {
      clearTimeout(tmr);

      tmr = setTimeout(() => {
        center = Math.round(a.$toValue()! + b.$toValue()!) / 2;
        width = Math.round(b.$toValue()! - a.$toValue()!);
      }, 1500);
    };

    const handlePan = () => {
      if (lock('a')) {
        const lpan = Math.round(a.$toValue()!);
        center = Math.max(-100, Math.min(100, lpan + width / 2));
        b.$fromValue(lpan + width, true);
        reset();
      }
    };

    const handleWidth = () => {
      if (lock('b')) {
        const rpan = Math.round(b.$toValue()!);
        width = Math.max(-200, Math.min(200, 2 * (rpan - center)));
        a.$fromValue(center - width / 2, true);
        reset();
      }
    };

    a.$on('remote-change', handlePan);
    b.$on('remote-change', handleWidth);

    this.map.set(a, handlePan);
    this.map.set(b, handleWidth);
  }

  private cleanupPair(a: ScaledValue | MappedValue, b: ScaledValue | MappedValue): void {
    for (const n of [a, b]) {
      const h = this.map.get(n);
      h && n.$off('remote-change', h);
      this.dispatcher.remove($key, n);
      this.map.delete(n);
    }
  }
}

type LockState = { ts: number };

function createMutualLock() {
  const a: LockState = { ts: 0 };
  const b: LockState = { ts: 0 };

  return (side: 'a' | 'b'): boolean => {
    const now = Date.now();
    const [local, remote] = side === 'a' ? [a, b] : [b, a];

    if (now - remote.ts < 500) {
      return false;
    }

    local.ts = now;
    return true;
  };
}
