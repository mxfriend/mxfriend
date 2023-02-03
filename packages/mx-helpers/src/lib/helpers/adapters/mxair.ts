import { MXDispatcher } from '@mxfriend/common';
import { Mixer, MXAirDiscoveryService, MXAirMixerInfo, MXAirOSCPort } from '@mxfriend/libmxair';
import { HeadroomAdjustment, MXAirHeadroomAdjustmentAdapter } from '../../headroomAdjustment';
import { StereoLink, MXAirStereoLinkAdapter } from '../../stereoLink';
import { StereoTools } from '../../stereoTools';
import { AvailableMixer, HelperAdapterInterface, HelperInterface } from '../types';


type MixerState = {
  mixer: Mixer;
  conn: MXAirOSCPort;
  dispatcher: MXDispatcher;
  helpers: Map<string, HelperInterface>;
};


export class MXAirHelperAdapter implements HelperAdapterInterface {
  private readonly discovery: MXAirDiscoveryService;
  private readonly availableMixers: Map<string, MXAirMixerInfo> = new Map();
  private readonly activeMixers: Map<string, MixerState> = new Map();

  constructor() {
    this.discovery = new MXAirDiscoveryService();
  }

  async init(): Promise<void> {
    this.discovery.on('mixer-found', (info) => {
      this.availableMixers.set(`${info.model}@${info.ip}`, info);
    });

    this.discovery.on('mixer-lost', (info) => {
      this.availableMixers.delete(`${info.model}@${info.ip}`);
    });

    await this.discovery.start();
  }

  async getAvailableMixers(): Promise<AvailableMixer[]> {
    const mixers: AvailableMixer[] = [];

    for (const [id, info] of this.availableMixers) {
      mixers.push([id, `${info.name} (${info.model} @ ${info.firmwareVersion})`]);
    }

    return mixers;
  }

  async initMixer(id: string): Promise<Record<string, HelperInterface>> {
    const info = this.availableMixers.get(id);

    if (!info) {
      throw new Error(`Unknown mixer: '${id}'`);
    }

    const mixer = new Mixer();
    const conn = new MXAirOSCPort({ mixerAddress: info.ip });
    const dispatcher = new MXDispatcher(conn, mixer);
    const helpers: Map<string, HelperInterface> = new Map();

    const stereoAdapter = new MXAirStereoLinkAdapter(mixer);
    const headroomAdapter = new MXAirHeadroomAdjustmentAdapter(mixer);
    const stereoLink = new StereoLink(stereoAdapter, dispatcher);
    const stereoTools = new StereoTools(stereoAdapter, dispatcher, stereoLink);
    const headroomAdjustment = new HeadroomAdjustment(headroomAdapter, dispatcher, stereoLink);

    helpers.set('stereo-link', stereoLink);
    helpers.set('stereo-tools', stereoTools);
    helpers.set('headroom-adjustment', headroomAdjustment);

    await conn.open();
    await dispatcher.requestUpdates();

    for (const helper of helpers.values()) {
      await helper.init();
    }

    this.activeMixers.set(id, {
      mixer,
      conn,
      dispatcher,
      helpers,
    });

    return Object.fromEntries([...helpers]);
  }

  async shutdown(id?: string): Promise<void> {
    for (const state of this.activeMixers.values()) {
      for (const helper of state.helpers.values()) {
        await helper.destroy();
      }

      state.dispatcher.cancelUpdates();
      await state.conn.close();
    }

    this.discovery.off();
    await this.discovery.stop();
  }
}
