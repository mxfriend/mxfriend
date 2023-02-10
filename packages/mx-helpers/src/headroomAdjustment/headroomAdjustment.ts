import { MappedValue } from '@mxfriend/common';
import { AnyEventHandler } from '@mxfriend/osc';
import { Container, Dispatcher, ScaledValue, Value } from '@mxfriend/oscom';
import { HelperInfo, HelperInterface, HelperState } from '../helpers';
import { StereoLink } from '../stereoLink';
import { HeadroomAdjustmentAdapterInterface } from './types';


/**
 * Possible improvements
 *  - When adjusting channel headroom:
 *    - adjust gate & comp thresholds when on
 *    - optionally also drive from comp makeup gain
 *  - When adjusting master:
 *    - adjust returns which have rtnsw & LR on
 *    - adjust bus masters which have LR on
 *    - do not adjust channels which have LR off
 *  - When adjusting buses:
 *    - adjust bus send for channels / returns which have send tap < Grp,
 *      adjust main mix fader for channels / returns which have LR off and
 *      send tap == Grp
 *  - Add external trigger - make it possible to control
 *    headroom adjustment from something other than Solo
 *  - Handle channels which have the same source ("double-patch")
 *  - Handle linked channels (they'll be soloed together)
 */

type Adjustment = {
  channels: Container[];
  monitor: Value[];
  sources: Map<ScaledValue | MappedValue, number>;
  targets: Map<ScaledValue | MappedValue, [number, number]>;
};

const $key = Symbol('HeadroomAdjustment');

export class HeadroomAdjustment implements HelperInterface {
  private readonly adapter: HeadroomAdjustmentAdapterInterface;
  private readonly dispatcher: Dispatcher;
  private readonly stereoLink: StereoLink;
  private adjustment?: Adjustment;

  constructor(adapter: HeadroomAdjustmentAdapterInterface, dispatcher: Dispatcher, stereoLink: StereoLink) {
    this.adapter = adapter;
    this.dispatcher = dispatcher;
    this.stereoLink = stereoLink;
    this.handleSourceChange = this.handleSourceChange.bind(this);
  }

  init(): void {}

  getInfo(): HelperInfo {
    return {
      name: 'Headroom Adjustment',
    };
  }

  getState(channels: Container[]): HelperState {
    if (this.adjustment) {
      if (
        channels.length === this.adjustment.channels.length
        && this.adjustment.channels.every((ch) => channels.includes(ch))
      ) {
        return 'active';
      } else {
        this.endAdjustment();
      }
    }

    switch (channels.length) {
      case 1: return 'inactive';
      case 2: return this.stereoLink.isLinked(channels[0], channels[1]) ? 'inactive': 'unavailable';
      default: return 'unavailable';
    }
  }

  async activate(channels: Container[]): Promise<void> {
    await this.beginAdjustment(channels);
  }

  deactivate(channels: Container[]): void {
    this.endAdjustment();
  }

  destroy(): void {
    this.endAdjustment();
  }

  async beginAdjustment(channels: Container[]): Promise<void> {
    if (this.adjustment) {
      this.endAdjustment();
    }

    const monitor = [...this.adapter.getRequiredNodes(channels)];
    await this.dispatcher.addAndQuery($key, ...monitor);

    const sources = [...this.adapter.getAdjustmentSources(channels)];
    const targets = [...this.adapter.getAdjustmentTargets(channels)]
      .map((t) => Array.isArray(t) ? t : [t, false] as const);

    await this.dispatcher.addAndQuery($key, ...sources, ...targets.map(([t]) => t));

    this.adjustment = {
      channels,
      monitor,
      sources: new Map(sources.map((source) => [source, source.$toValue() ?? 0])),
      targets: new Map(targets.map(([target, invert]) => [target, [target.$toValue() ?? 0, invert ? -1 : 1]])),
    };

    for (const source of sources) {
      source.$on('remote-change', this.handleSourceChange as AnyEventHandler);
    }
  }

  endAdjustment(): void {
    if (!this.adjustment) {
      return;
    }

    this.dispatcher.remove(
      $key,
      ...this.adjustment.monitor,
      ...this.adjustment.sources.keys(),
      ...this.adjustment.targets.keys(),
    );

    for (const source of this.adjustment.sources.keys()) {
      source.$off('remote-change', this.handleSourceChange as AnyEventHandler);
    }

    this.adjustment = undefined;
  }

  private handleSourceChange(value: number | undefined, source: ScaledValue | MappedValue): void {
    if (!this.adjustment) {
      return;
    }

    const sourceCurrent = source.$toValue();
    const sourceInitial = this.adjustment.sources.get(source);

    if (sourceCurrent === undefined || sourceInitial === undefined) {
      return;
    }

    const delta = sourceCurrent - sourceInitial;

    for (const [target, [initial, invert]] of this.adjustment.targets) {
      target.$fromValue(initial - delta * invert, true);
    }
  }
}
