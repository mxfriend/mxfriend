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
  private readonly map: Map<ScaledValue | MappedValue, () => void> = new Map();
  private enabled: boolean = true;

  constructor(adapter: StereoToolsAdapterInterface, dispatcher: Dispatcher, stereoLink: StereoLink) {
    this.adapter = adapter;
    this.dispatcher = dispatcher;
    this.stereoLink = stereoLink;
    this.handleLink = this.handleLink.bind(this);
    this.handleUnlink = this.handleUnlink.bind(this);
  }

  init(): void {
    this.stereoLink.on('link', this.handleLink);
    this.stereoLink.on('unlink', this.handleUnlink);
  }

  getInfo(): HelperInfo {
    return {
      name: 'Stereo Tools',
    };
  }

  getState(channels: Container[]): HelperState {
    const linked = channels.length === 2 && this.stereoLink.isLinked(channels[0], channels[1]);
    return !linked ? 'unavailable' : this.enabled ? 'active' : 'inactive';
  }

  activate(channels: Container[]): void {
    this.enabled = true;
  }

  deactivate(channels: Container[]): void {
    this.enabled = false;
  }

  destroy(): void {
    this.stereoLink.off('link', this.handleLink);
    this.stereoLink.off('unlink', this.handleUnlink);

    for (const [node, handler] of this.map) {
      this.dispatcher.remove($key, node);
      node.$off('remote-change', handler);
      this.map.delete(node);
    }
  }

  private async handleLink(a: Container, b: Container): Promise<void> {
    for (const [pa, pb] of pairs(this.adapter.getMixPanNodes(a), this.adapter.getMixPanNodes(b))) {
      await this.setup(pa, pb);
    }
  }

  private handleUnlink(a: Container, b: Container): void {
    for (const [pa, pb] of pairs(this.adapter.getMixPanNodes(a), this.adapter.getMixPanNodes(b))) {
      this.cleanup(pa, pb);
    }
  }

  private async setup(a: ScaledValue | MappedValue, b: ScaledValue | MappedValue): Promise<void> {
    await this.dispatcher.addAndQuery($key, a, b);

    let center: number = (a.$toValue()! + b.$toValue()!) / 2;
    let width: number = b.$toValue()! - a.$toValue()!;

    const handlePan = () => {
      const lpan = a.$toValue()!;
      center = lpan + width / 2;
      console.log(center, width);
      b.$fromValue(lpan + width, true);
    };

    const handleWidth = () => {
      const rpan = b.$toValue()!;
      width = 2 * (rpan - center);
      console.log(center, width);
      a.$fromValue(center - width / 2, true);
    };

    a.$on('remote-change', handlePan);
    b.$on('remote-change', handleWidth);

    this.map.set(a, handlePan);
    this.map.set(b, handleWidth);
  }

  private cleanup(a: ScaledValue | MappedValue, b: ScaledValue | MappedValue): void {
    for (const n of [a, b]) {
      const h = this.map.get(n);
      h && n.$off('remote-change', h);
      this.dispatcher.remove($key, n);
      this.map.delete(n);
    }
  }
}
