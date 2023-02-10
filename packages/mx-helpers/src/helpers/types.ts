import { EventEmitter, EventMap } from '@mxfriend/osc';
import { Container } from '@mxfriend/oscom';

export type HelperInfo = {
  name: string;
  icon?: string;
};

export type HelperState = 'active' | 'inactive' | 'unavailable';

export interface HelperInterface {
  init(): void;
  getInfo(): HelperInfo;
  getState(channels: Container[]): HelperState;
  activate(channels: Container[]): void;
  deactivate(channels: Container[]): void;
  destroy(): void;
}

export type AvailableMixer = [adapterId: string, mixerId: string, mixerName: string];

export interface HelperAdapterEvents extends EventMap {
  'available-mixers-change': [];
  'selection-change': [adapterId: string, mixerId: string, channels: Container[]];
}

export interface HelperAdapterInterface extends EventEmitter<HelperAdapterEvents> {
  getId(): string;
  init(): void;
  initMixer(id: string): Promise<Map<string, HelperInterface>>;
  getChannelNames(channels: Container[]): string[];
  getAvailableMixers(): AvailableMixer[];
  shutdown(id?: string): void;
}
