import { MappedValue } from '@mxfriend/common';
import { Container, ScaledValue, Value } from '@mxfriend/oscom';

export interface HeadroomAdjustmentAdapterInterface {
  getRequiredNodes(channels: Container[]): Iterable<Value>;
  getAdjustmentSources(channels: Container[]): Iterable<ScaledValue | MappedValue>;
  getAdjustmentTargets(channels: Container[]): Iterable<ScaledValue | MappedValue | [target: ScaledValue | MappedValue, invert: boolean]>;
}
