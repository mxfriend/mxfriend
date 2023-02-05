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

export type AvailableMixer = [id: string, name: string];

export interface HelperAdapterInterface {
  init(): void;
  getAvailableMixers(): Promise<AvailableMixer[]>;
  initMixer(id: string): Promise<Record<string, HelperInterface>>;
  shutdown(id?: string): void;
}
