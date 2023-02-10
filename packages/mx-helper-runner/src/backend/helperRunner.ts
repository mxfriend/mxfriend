import { HelperAdapterInterface, HelperInterface } from '@mxfriend/mx-helpers';
import { osc, OSCArgument } from '@mxfriend/osc';
import { WsOSCPort } from '@mxfriend/osc/ws';
import { Container, Dispatcher, Node, Value } from '@mxfriend/oscom';
import { WebSocket } from 'ws';
import { HelpersOM, MixerState, SelectionHelperState } from '../common';

const $key = Symbol('helper runner');

export class HelperRunner {
  private readonly om: HelpersOM = new HelpersOM();
  private readonly conn: WsOSCPort = new WsOSCPort();
  private readonly dispatcher: Dispatcher = new Dispatcher(this.conn);
  private readonly adapters: Map<string, HelperAdapterInterface> = new Map();
  private readonly activeMixers: Map<string, Map<string, HelperInterface>> = new Map();
  private selection?: Container[];

  constructor() {
    this.updateMixerStates = this.updateMixerStates.bind(this);
    this.updateHelperStates = this.updateHelperStates.bind(this);
    this.handleToggleMixer = this.handleToggleMixer.bind(this);
    this.handleToggleHelper = this.handleToggleHelper.bind(this);
  }

  addAdapter(adapter: HelperAdapterInterface): void {
    this.adapters.set(adapter.getId(), adapter);
  }

  async addClient(client: WebSocket): Promise<void> {
    this.conn.add(client);
    await this.seedClient(client, this.om);
  }

  async init(): Promise<void> {
    this.dispatcher.add($key, this.om);
    this.om.toggleMixer.$on('remote-call', this.handleToggleMixer);
    this.om.toggleHelper.$on('remote-call', this.handleToggleHelper);

    for (const adapter of this.adapters.values()) {
      await adapter.init();

      adapter.on('available-mixers-change', this.updateMixerStates);
      adapter.on('selection-change', this.updateHelperStates);
    }
  }

  async initMixer(adapterId: string, mixerId: string): Promise<Record<string, any>> {
    const adapter = this.adapters.get(adapterId);

    if (!adapter) {
      throw new Error(`Unknown adapter: '${adapterId}'`);
    }

    const helpers = await adapter.initMixer(mixerId);
    const res: Record<string, any> = {};

    for (const [id, helper] of helpers) {
      res[id] = {
        ...helper.getInfo(),
        state: helper.getState([]),
      };
    }

    this.activeMixers.set(`${adapterId}:${mixerId}`, helpers);
    this.updateMixerStates();
    this.updateHelperStates(adapterId, mixerId, []);
    return res;
  }

  shutdownMixer(adapterId: string, mixerId: string): void {
    const adapter = this.adapters.get(adapterId);
    adapter && adapter.shutdown(mixerId);
    this.activeMixers.delete(`${adapterId}:${mixerId}`);
    this.selection = undefined;
    this.updateMixerStates();
    this.updateHelperStates();
  }

  private updateMixerStates(): void {
    const mixers: MixerState[] = [];

    for (const adapter of this.adapters.values()) {
      for (const [aid, mid, name] of adapter.getAvailableMixers()) {
        mixers.push([aid, mid, name, this.activeMixers.has(`${aid}:${mid}`)]);
      }
    }

    this.om.mixers.$set(mixers, true);
  }

  private updateHelperStates(adapterId?: string, mixerId?: string, channels?: Container[]): void {
    const adapter = adapterId && this.adapters.get(adapterId);
    const helpers = adapterId && mixerId && this.activeMixers.get(`${adapterId}:${mixerId}`);
    channels && (this.selection = channels);

    if (!adapter || !helpers || !this.selection) {
      this.om.state.$set(null, true);
      return;
    }

    const state: SelectionHelperState = {
      adapterId,
      mixerId,
      selection: adapter.getChannelNames(this.selection),
      helpers: [],
    };

    for (const [helperId, helper] of helpers) {
      const { name, icon } = helper.getInfo();
      const hstate = helper.getState(this.selection);
      state.helpers.push([helperId, hstate, name, icon]);
    }

    this.om.state.$set(state, true);
  }

  private async handleToggleMixer(args: OSCArgument[]): Promise<void> {
    const [adapterId, mixerId, on] = osc.extract(args, 's', 's', 'B');

    if (!adapterId) {
      return;
    }

    if (on) {
      await this.initMixer(adapterId, mixerId);
    } else {
      this.shutdownMixer(adapterId, mixerId);
    }
  }

  private async handleToggleHelper(args: OSCArgument[]): Promise<void> {
    if (!this.selection) {
      return;
    }

    const [adapterId, mixerId, helperId, on] = osc.extract(args, 's', 's', 's', 'B');

    if (!adapterId) {
      return;
    }

    const helper = this.activeMixers.get(`${adapterId}:${mixerId}`)?.get(helperId);

    if (!helper) {
      return;
    }

    if (on) {
      await helper.activate(this.selection);
    } else {
      await helper.deactivate(this.selection);
    }

    this.updateHelperStates(adapterId, mixerId);
  }

  private async seedClient(client: WebSocket, node: Node): Promise<void> {
    if (node instanceof Container) {
      for (const child of node.$children()) {
        await this.seedClient(client, child);
      }
    } else if (node instanceof Value) {
      const value = node.$toOSC();
      await this.conn.send(node.$address, value ? [value] : undefined, client);
    }
  }
}
