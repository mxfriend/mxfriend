import { MXDispatcher, MXDiscoveryService, MXMixerInfo, Mixer, Bool } from '@mxfriend/common';
import { EventEmitter } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { Container, EnumValue, StringValue } from '@mxfriend/oscom';
import { HeadroomAdjustment, HeadroomAdjustmentAdapterInterface } from '../../headroomAdjustment';
import { StereoLink, StereoLinkAdapterInterface } from '../../stereoLink';
import { StereoTools } from '../../stereoTools';
import {
  AvailableMixer,
  HelperAdapterEvents,
  HelperAdapterInterface,
  HelperInterface,
} from '../types';


export type MXHelperAdapterOptions = {
  port: number;
};


type MixerState<TMixer extends Mixer> = {
  mixer: TMixer;
  conn: UdpOSCPort;
  dispatcher: MXDispatcher;
  helpers: Map<string, HelperInterface>;
  handleSolo: () => void;
};

const nameMap: Record<string, string> = {
  ch: 'Ch',
  auxin: 'Aux In',
  fxrtn: 'Fx Rtn',
  rtn: 'Rtn',
  bus: 'Bus',
  main: 'Main',
  lr: 'LR',
  dca: 'DCA',
};

function addrToName(addr: string): string {
  return addr.replace(
    /^\/([^\/]+)(?:\/([^\/]+))?$/,
    (_, t, n = '') => `${nameMap[t] ?? t.toUpperCase()}${n.length ? ' ' : ''}${n.toUpperCase()}`,
  );
}


const $key = Symbol('helper adapter');

export abstract class AbstractMXHelperAdapter<TMixer extends Mixer>
  extends EventEmitter<HelperAdapterEvents>
  implements HelperAdapterInterface
{
  private readonly availableMixers: Map<string, MXMixerInfo> = new Map();
  private readonly activeMixers: Map<string, MixerState<TMixer>> = new Map();
  private readonly options: MXHelperAdapterOptions;
  private readonly discovery: MXDiscoveryService;

  constructor(options: MXHelperAdapterOptions) {
    super();
    this.options = options;
    this.discovery = new MXDiscoveryService(options.port);
  }

  abstract getId(): string;
  abstract getChannelNames(channels: Container[]): string[];
  protected abstract createMixer(): TMixer;
  protected abstract createStereoLinkAdapter(mixer: TMixer): StereoLinkAdapterInterface;
  protected abstract createHeadroomAdjustmentAdapter(mixer: TMixer): HeadroomAdjustmentAdapterInterface;
  protected abstract getChannelNameNodes(mixer: TMixer): Iterable<StringValue>;
  protected abstract getSoloSwitches(mixer: TMixer): Iterable<EnumValue<Bool>>;
  protected abstract getSoloTarget(mixer: TMixer, solo: EnumValue<Bool>): Container;

  async init(): Promise<void> {
    this.discovery.on('mixer-found', (info) => {
      this.availableMixers.set(`${info.model}@${info.ip}`, info);
      this.emit('available-mixers-change');
    });

    this.discovery.on('mixer-lost', (info) => {
      this.availableMixers.delete(`${info.model}@${info.ip}`);
      this.emit('available-mixers-change');
    });

    await this.discovery.start();
  }

  getAvailableMixers(): AvailableMixer[] {
    const mixers: AvailableMixer[] = [];

    for (const [id, info] of this.availableMixers) {
      mixers.push([this.getId(), id, `${info.name} (${info.model} ${info.firmwareVersion.replace(/^v?/, 'v')})`]);
    }

    return mixers;
  }

  async initMixer(id: string): Promise<Map<string, HelperInterface>> {
    const info = this.availableMixers.get(id);

    if (!info) {
      throw new Error(`Unknown mixer: '${id}'`);
    }

    const mixer = this.createMixer();
    const conn = new UdpOSCPort({ remoteAddress: info.ip, remotePort: this.options.port });
    const dispatcher = new MXDispatcher(conn, mixer);
    const helpers: Map<string, HelperInterface> = new Map();

    const stereoAdapter = this.createStereoLinkAdapter(mixer);
    const headroomAdapter = this.createHeadroomAdjustmentAdapter(mixer);
    const stereoLink = new StereoLink(stereoAdapter, dispatcher);
    const stereoTools = new StereoTools(stereoAdapter, dispatcher, stereoLink);
    const headroomAdjustment = new HeadroomAdjustment(headroomAdapter, dispatcher, stereoLink);

    helpers.set('headroom-adjustment', headroomAdjustment);
    helpers.set('stereo-tools', stereoTools);
    helpers.set('stereo-link', stereoLink);

    await conn.open();
    await dispatcher.requestUpdates();
    await dispatcher.addAndQuery($key, ...this.getSoloSwitches(mixer), ...this.getChannelNameNodes(mixer));

    for (const helper of helpers.values()) {
      await helper.init();
    }

    const handleSolo = this.createSoloHandler(id, mixer);

    for (const sw of this.getSoloSwitches(mixer)) {
      sw.$on('local-change', handleSolo);
      sw.$on('remote-change', handleSolo);
    }

    this.activeMixers.set(id, {
      mixer,
      conn,
      dispatcher,
      helpers,
      handleSolo,
    });

    return helpers;
  }

  async shutdown(id?: string): Promise<void> {
    const mixers = id ? [this.activeMixers.get(id)] : this.activeMixers.values();

    for (const state of mixers) {
      if (!state) {
        continue;
      }

      for (const helper of state.helpers.values()) {
        await helper.destroy();
      }

      for (const sw of this.getSoloSwitches(state.mixer)) {
        sw.$off('local-change', state.handleSolo);
        sw.$off('remote-change', state.handleSolo);
      }

      state.dispatcher.remove($key, ...this.getSoloSwitches(state.mixer));
      state.dispatcher.cancelUpdates();
      await state.conn.close();
    }

    if (!id) {
      this.discovery.off();
      await this.discovery.stop();
    }
  }

  private createSoloHandler(mixerId: string, mixer: TMixer): () => void {
    return () => {
      const selected: Container[] = [];

      for (const solo of this.getSoloSwitches(mixer)) {
        if (solo.$get()) {
          selected.push(this.getSoloTarget(mixer, solo));
        }
      }

      this.emit('selection-change', this.getId(), mixerId, selected);
    };
  }

  protected resolveName(ch: Container, name?: string): string {
    return name !== undefined && name !== '' ? name : addrToName(ch.$address);
  }
}
