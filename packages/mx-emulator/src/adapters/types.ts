import { AbstractMeterBank } from '@mxfriend/common';
import { StereoLinkAdapterInterface } from '@mxfriend/mx-helpers';
import { Collection, Root } from '@mxfriend/oscom';

export interface EmulatorAdapterConstructor {
  supports(model: string): boolean;
  new (model: string): EmulatorAdapterInterface;
}

export interface EmulatorAdapterInterface {
  getPort(): number;
  getMixer(): Root;
  getMeters(): Collection<AbstractMeterBank>;
  createStereoLinkAdapter(): StereoLinkAdapterInterface;
  resolveSubscriptionPatterns(patterns: string[], start: number, end: number): string[];
  initMixer(ip: string): Promise<void>;
}
