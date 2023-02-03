import { HelperAdapterInterface } from '../lib';

export class HelperRunner {
  private readonly adapters: Map<string, HelperAdapterInterface> = new Map();

  add(id: string, adapter: HelperAdapterInterface): void {
    this.adapters.set(id, adapter);
  }

  async init(): Promise<void> {
    for (const adapter of this.adapters.values()) {
      await adapter.init();
    }
  }

  async getAvailableMixers(): Promise<string[][]> {
    const list: string[][] = [];

    for (const [id, adapter] of this.adapters) {
      for (const [mixId, mixName] of await adapter.getAvailableMixers()) {
        list.push([id, mixId, mixName]);
      }
    }

    return list;
  }

  async initMixer(adapterId: string, mixerId: string): Promise<Record<string, any>> {
    const adapter = this.adapters.get(adapterId);

    if (!adapter) {
      throw new Error(`Unknown adapter: '${adapterId}'`);
    }

    const helpers = await adapter.initMixer(mixerId);
    const res: Record<string, any> = {};

    for (const [id, helper] of Object.entries(helpers)) {
      res[id] = {
        ...helper.getInfo(),
        state: helper.getState([]),
      };
    }

    return res;
  }
}
